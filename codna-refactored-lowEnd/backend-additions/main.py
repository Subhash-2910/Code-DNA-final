from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import boto3
import json
import os
import traceback
from dotenv import load_dotenv

# Load AWS keys from .env
load_dotenv('.env')

# Initialize FastAPI
app = FastAPI(title="CO-DNA Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AWS Bedrock Client Safely
try:
    bedrock_client = boto3.client(
        service_name='bedrock-runtime',
        region_name='us-east-1', 
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )
except Exception as e:
    print(f"Failed to connect to AWS: {e}")

# Using the Free Amazon Nova Model
BEDROCK_MODEL_ID = 'amazon.nova-lite-v1:0'

from typing import Optional

class CodePayload(BaseModel):
    code: str
    language: str = "javascript"
    target_language: Optional[str] = "Python"

@app.get("/")
def health_check():
    return {"status": "CO-DNA Engine is ALIVE!"}


# ==========================================
# ENDPOINT 0: FULL ANALYSIS FOR FRONTEND
# ==========================================
@app.post("/analyze-full")
def analyze_full(payload: CodePayload):
    target = payload.target_language if payload.target_language else "Python"
    
    system_prompt = f"""
    You are an expert Principal Engineer. Analyze the provided code.
    You MUST respond with a raw JSON object and nothing else. Do not use markdown blocks like ```json.
    
    The JSON object must have the exact following structure:
    {{
      "analysis": [
        {{ "type": "warn" | "info" | "check", "title": "<short title>", "desc": "<description>" }}
      ],
      "conversion": "<The provided code converted/modernized to {target}>",
      "flowchart": "<A valid Mermaid flowchart string (graph TD) representing the code logic. Use simple A[Name] --> B[Name] syntax>",
      "estimate": {{
        "time": "<estimated development hours, e.g., '2h 15m'>",
        "loc": <number of lines>
      }}
    }}
    
    Ensure the JSON is perfectly valid. The `analysis` array should have 3-5 insightful items.
    """
    
    try:
        response = bedrock_client.converse(
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
        
        try:
            # Clean up any potential markdown formatting
            clean_json_string = nova_output.replace('```json', '').replace('```', '').strip()
            result_json = json.loads(clean_json_string)
            return result_json
        except Exception as json_err:
            print("--- NOVA OUTPUT (JSON ERROR) ---")
            print(nova_output)
            print("--- END OUTPUT ---")
            raise json_err
        
    except Exception as e:
        print("--- EXCEPTION IN /analyze-full ---")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ==========================================
# ENDPOINT 1: ANALYZE DEBT
# ==========================================
@app.post("/analyze-debt")
def analyze_technical_debt(payload: CodePayload):
    system_prompt = """
    You are an expert Principal Engineer. Analyze the provided code for technical debt, security issues, and complexity.
    You MUST respond with a raw JSON object and nothing else. Do not use markdown blocks like ```json.
    
    The JSON object must have EXACTLY this structure:
    {
      "spaghetti_score": <0-100 int>,
      "security_score": <0-100 int>,
      "complexity_score": <0-100 int>,
      "risk_level": "<LOW|MEDIUM|HIGH|CRITICAL>",
      "business_impact": {
        "estimated_effort_hours": <int>,
        "estimated_cost": <int>,
        "severity": "<Low|Medium|High|Critical>"
      },
      "issues": [
        { "severity": "<low|medium|high|critical>", "title": "<string>", "details": "<string>", "location": "<string>" }
      ],
      "security_issues": [
        { "type": "<string>", "details": "<string>" }
      ],
      "refactor_plan": [
        { "step": "<short string>", "why": "<string>", "example_change": "<string code snippet>" }
      ],
      "logic_flow_diagram": "<A valid Mermaid flowchart string (graph TD) representing the code logic. Use simple A[Name] --> B[Name]>",
      "architecture_diagram": "<A valid Mermaid flowchart string (graph TD) representing the architecture>",
      "function_flow_diagram": "<A valid Mermaid flowchart string (graph TD) representing function calls>"
    }
    """
    
    try:
        response = bedrock_client.converse(
            modelId=BEDROCK_MODEL_ID,
            system=[{"text": system_prompt}],
            messages=[
                {
                    "role": "user",
                    "content": [{"text": f"Analyze this {payload.language} code:\n\n{payload.code}"}]
                }
            ],
            inferenceConfig={
                "maxTokens": 4000,
                "temperature": 0.1
            }
        )
        
        # Extract the text from the Converse API response
        nova_output = response['output']['message']['content'][0]['text']
        
        try:
            # Clean up any potential markdown formatting Nova might add
            clean_json_string = nova_output.replace('```json', '').replace('```', '').strip()
            result_json = json.loads(clean_json_string)
            return result_json
        except Exception as json_err:
            print("--- NOVA OUTPUT (JSON ERROR) ---")
            print(nova_output)
            print("--- END OUTPUT ---")
            raise json_err
        
    except Exception as e:
        print("--- EXCEPTION IN /analyze-debt ---")
        print(traceback.format_exc())
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
    You MUST respond with a raw JSON object and nothing else. Do not use markdown blocks like ```json.

    The JSON object must have EXACTLY this structure:
    {
      "explanation": "<Your 3 paragraph explanation>",
      "logic_flow_diagram": "<A valid Mermaid flowchart string (graph TD) representing the code logic. Use simple A[Name] --> B[Name]>",
      "architecture_diagram": "<A valid Mermaid flowchart string (graph TD) representing the architecture>",
      "function_flow_diagram": "<A valid Mermaid flowchart string (graph TD) representing function calls>"
    }
    """
    
    try:
        response = bedrock_client.converse(
            modelId=BEDROCK_MODEL_ID,
            system=[{"text": system_prompt}],
            messages=[
                {
                    "role": "user",
                    "content": [{"text": f"Explain this {payload.language} code:\n\n{payload.code}"}]
                }
            ],
            inferenceConfig={
                "maxTokens": 4000,
                "temperature": 0.4
            }
        )
        
        nova_output = response['output']['message']['content'][0]['text']
        
        try:
            # Clean up any potential markdown formatting Nova might add
            clean_json_string = nova_output.replace('```json', '').replace('```', '').strip()
            result_json = json.loads(clean_json_string)
            return result_json
        except Exception as json_err:
            print("--- NOVA OUTPUT (JSON ERROR) ---")
            print(nova_output)
            print("--- END OUTPUT ---")
            raise json_err
        
    except Exception as e:
        print("--- EXCEPTION IN /explain-code ---")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ==========================================
# ENDPOINT 3: MODERNIZE CODE
# ==========================================
@app.post("/translate-code")
def translate_code(payload: CodePayload):
    target = payload.targetLanguage if payload.targetLanguage else "Python"
    system_prompt = f"""
    You are an expert developer. Translate/modernize the provided code to be modern, clean, and efficient in the target language: {target}.
    Fix technical debt (e.g., convert callbacks to async/await, update deprecated functions).
    CRITICAL: You must return ONLY the raw modernized code. Do not include markdown formatting (like ```javascript), and do not include any explanations. Just the code.
    """

    try:
        response = bedrock_client.converse(
            modelId=BEDROCK_MODEL_ID,
            system=[{"text": system_prompt}],
            messages=[
                {
                    "role": "user",
                    "content": [{"text": f"Modernize this {payload.language} code:\n\n{payload.code}"}]
                }
            ],
            inferenceConfig={
                "maxTokens": 4000,
                "temperature": 0.1
            }
        )
        
        nova_output = response['output']['message']['content'][0]['text']
        
        # Strip markdown blocks if Nova stubbornly includes them
        clean_code = nova_output.replace(f'```{target.lower()}', '').replace('```javascript', '').replace('```python', '').replace('```', '').strip()
        
        return {"rewritten_code": clean_code}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))