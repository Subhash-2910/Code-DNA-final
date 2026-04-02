from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import boto3
import json
import os
from dotenv import load_dotenv

# Load .env from this file's directory
_BACKEND_DIR = Path(__file__).resolve().parent
_ENV_PATH = _BACKEND_DIR / ".env"

if _ENV_PATH.exists():
    load_dotenv(_ENV_PATH, override=True)
else:
    # Check for .en typo as suggested by user logs
    _ENV_PATH_EN = _BACKEND_DIR / ".en"
    if _ENV_PATH_EN.exists():
        load_dotenv(_ENV_PATH_EN, override=True)

# Initialize FastAPI
app = FastAPI(title="CO-DNA Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _create_bedrock_client():
    region = os.getenv("AWS_DEFAULT_REGION") or os.getenv("AWS_REGION") or "us-east-1"
    key_id = os.getenv("AWS_ACCESS_KEY_ID")
    secret = os.getenv("AWS_SECRET_ACCESS_KEY")
    if not key_id or not secret:
        return None
    return boto3.client(
        service_name="bedrock-runtime",
        region_name=region,
        aws_access_key_id=key_id,
        aws_secret_access_key=secret,
    )


bedrock_client = _create_bedrock_client()
if bedrock_client is None:
    print(
        f"CRITICAL: AWS credentials missing in {_BACKEND_DIR / '.env'} or environment."
    )
    print(f"DEBUG: ACCESS_KEY_ID present: {bool(os.getenv('AWS_ACCESS_KEY_ID'))}")
    print(f"DEBUG: SECRET_ACCESS_KEY present: {bool(os.getenv('AWS_SECRET_ACCESS_KEY'))}")
else:
    print("SUCCESS: Bedrock client initialized with environment variables.")

# Using the Free Amazon Nova Model
BEDROCK_MODEL_ID = 'amazon.nova-lite-v1:0'

from typing import Optional

#Bedrock CModel initialization
def get_bedrock():
    if bedrock_client is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "AWS Bedrock is not configured. Set AWS_ACCESS_KEY_ID and "
                "AWS_SECRET_ACCESS_KEY in model1/backend/.env (or export them), then restart the server."
            ),
        )
    return bedrock_client

class CodePayload(BaseModel):
    code: str
    language: str = "javascript"
    targetLanguage: Optional[str] = "Python"

@app.get("/")
def health_check():
    return {"status": "CO-DNA Engine is ALIVE!"}


# ==========================================
# ENDPOINT 0: FULL ANALYSIS FOR FRONTEND
# ==========================================
@app.post("/analyze-full")
def analyze_full(payload: CodePayload):
    target = payload.targetLanguage if payload.targetLanguage else "Python"
    
    system_prompt = f"""
    You are an expert Principal Engineer. Analyze the provided code for logic, structure, and conversion.
    You MUST respond with a raw JSON object and nothing else. Do not use markdown blocks like ```json.
    
    The JSON object must have the exact following structure:
    {{
      "analysis": [
        {{ "type": "warn" | "info" | "check", "title": "<short title>", "desc": "<description>" }}
      ],
      "conversion": "<A COMPLETE, RAW REWRITE of the original code into perfectly valid {target} syntax. DO NOT mix the original and target languages. The result must be clean, runnable {target} code with zero leftovers from the source.>",
      "flowchart": "<A valid Mermaid flowchart string (graph TD) representing the code logic. Use simple A[Name] --> B[Name] syntax>",
      "estimate": {{
        "time": "<estimated development hours, e.g., '2h 15m'>",
        "loc": <number of lines>
      }}
    }}
    
    CRITICAL: The `conversion` field must NOT contain any comments about "What changed" or "Next.js style" notes. Just the {target} code.
    Ensure the JSON is perfectly valid. The `analysis` array should have 3-5 insightful items.
    """
    
    try:
        response = get_bedrock().converse(
            modelId=BEDROCK_MODEL_ID,
            system=[{"text": system_prompt}],
            messages=[
                {
                    "role": "user",
                    "content": [{"text": f"Analyze this {payload.language} code:\n\n{payload.code}?"}]
                }
            ],
            inferenceConfig={
                "maxTokens": 2500,
                "temperature": 0.2
            }
        )
        
        nova_output = response['output']['message']['content'][0]['text']
        
        # Clean up any potential markdown formatting
        clean_json_string = nova_output.replace('```json', '').replace('```', '').strip()
        result_json = json.loads(clean_json_string)
        
        return result_json
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==========================================
# ENDPOINT 1: ANALYZE DEBT
# ==========================================
@app.post("/analyze-debt")
def analyze_technical_debt(payload: CodePayload):
    system_prompt = """
    You are an expert Principal Engineer. Analyze the provided code for technical debt.
    Identify bad practices (like N+1 queries, callback hell, high complexity).
    You MUST respond with a raw JSON object and nothing else. Do not use markdown blocks.
    Format: {"score": <0-100 int>, "dollar_impact": <int>, "critical_issue": "<short string>", "fix_summary": "<string>"}
    """
    
    try:
        response = get_bedrock().converse(
            modelId=BEDROCK_MODEL_ID,
            system=[{"text": system_prompt}],
            messages=[
                {
                    "role": "user",
                    "content": [{"text": f"Analyze this {payload.language} code:\n\n{payload.code}"}]
                }
            ],
            inferenceConfig={
                "maxTokens": 500,
                "temperature": 0.1
            }
        )
        
        # Extract the text from the Converse API response
        nova_output = response['output']['message']['content'][0]['text']
        
        # Clean up any potential markdown formatting Nova might add
        clean_json_string = nova_output.replace('```json', '').replace('```', '').strip()
        result_json = json.loads(clean_json_string)
        
        return result_json
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==========================================
# ENDPOINT 2: EXPLAIN CODE
# ==========================================
@app.post("/explain-code")
def explain_code(payload: CodePayload):
    system_prompt = """
    You are a senior engineer mentoring a junior developer. 
    Explain exactly what the provided code does in plain, easy-to-understand English.
    Keep the explanation under 3 short paragraphs. 
    Do not use overly complex jargon unless you define it.
    """
    
    try:
        response = get_bedrock().converse(
            modelId=BEDROCK_MODEL_ID,
            system=[{"text": system_prompt}],
            messages=[
                {
                    "role": "user",
                    "content": [{"text": f"Explain this {payload.language} code:\n\n{payload.code}"}]
                }
            ],
            inferenceConfig={
                "maxTokens": 500,
                "temperature": 0.4
            }
        )
        
        nova_output = response['output']['message']['content'][0]['text']
        return {"explanation": nova_output}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==========================================
# ENDPOINT 3: MODERNIZE CODE
# ==========================================
@app.post("/modernize-code")
def modernize_code(payload: CodePayload):
    system_prompt = """
    You are an expert developer. Rewrite the provided code to be modern, clean, and efficient.
    Fix technical debt (e.g., convert callbacks to async/await, update deprecated functions).
    CRITICAL: You must return ONLY the raw modernized code. Do not include markdown formatting (like ```javascript), and do not include any explanations. Just the code.
    """

    try:
        response = get_bedrock().converse(
            modelId=BEDROCK_MODEL_ID,
            system=[{"text": system_prompt}],
            messages=[
                {
                    "role": "user",
                    "content": [{"text": f"Modernize this {payload.language} code:\n\n{payload.code}"}]
                }
            ],
            inferenceConfig={
                "maxTokens": 800,
                "temperature": 0.1
            }
        )
        
        nova_output = response['output']['message']['content'][0]['text']
        
        # Strip markdown blocks if Nova stubbornly includes them
        clean_code = nova_output.replace('```javascript', '').replace('```python', '').replace('```', '').strip()
        
        return {"modernized_code": clean_code}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==========================================
# ENDPOINT 4: CONVERT LOGIC (LIGHTWEIGHT)
# ==========================================
@app.post("/convert-logic")
def convert_logic(payload: CodePayload):
    target = payload.targetLanguage if payload.targetLanguage else "Python"
    
    system_prompt = f"""
    You are an expert developer. Convert the provided code from {payload.language} into {target}.
    The conversion MUST be perfectly valid {target} syntax and functionally identical to the source.
    CRITICAL: Respond ONLY with the raw converted code. No markdown, no comments, no intro/outro.
    """
    
    try:
        response = get_bedrock().converse(
            modelId=BEDROCK_MODEL_ID,
            system=[{"text": system_prompt}],
            messages=[
                {
                    "role": "user",
                    "content": [{"text": f"Convert this {payload.language} code to {target}:\n\n{payload.code}"}]
                }
            ],
            inferenceConfig={
                "maxTokens": 2000,
                "temperature": 0.1
            }
        )
        
        nova_output = response['output']['message']['content'][0]['text']
        # Strip markdown if any
        clean_code = nova_output.replace('```', '').strip()
        # Sometimes Nova adds the language name at the start
        if clean_code.lower().startswith(target.lower()):
            clean_code = clean_code[len(target):].strip()
            
        return {"conversion": clean_code}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))