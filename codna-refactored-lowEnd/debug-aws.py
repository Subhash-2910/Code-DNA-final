import boto3
import os
from dotenv import load_dotenv

load_dotenv('backend-additions/.env')

print("AWS_ACCESS_KEY_ID:", os.getenv('AWS_ACCESS_KEY_ID'))
print("AWS_DEFAULT_REGION:", os.getenv('AWS_DEFAULT_REGION'))

try:
    client = boto3.client(
        service_name='bedrock-runtime',
        region_name='us-east-1',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )
    
    # Try a simple listing or converse
    print("Testing connection to Bedrock (Nova Lite)...")
    response = client.converse(
        modelId='amazon.nova-lite-v1:0',
        messages=[{"role": "user", "content": [{"text": "Hello"}]}]
    )
    print("Success! Response from Nova:")
    print(response['output']['message']['content'][0]['text'])
except Exception as e:
    print("\n!!! CONNECTION FAILED !!!")
    print(e)
