import boto3
from loguru import logger
import os
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()

AWS_BUCKET = os.getenv("AWS_BUCKET")

# ✅ Use boto3.client instead of boto3.resource
s3 = boto3.resource(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

bucket = s3.Bucket(AWS_BUCKET)

async def s3_upload(contents: bytes, key: str):
    try:
        bucket.put_object( 
            Bucket=AWS_BUCKET,
            Key=key,
            Body=contents,
            ContentType="application/pdf",  # Ensures browser renders PDF
            ContentDisposition="inline"  # Forces display instead of download
        )
        return f"https://{AWS_BUCKET}.s3.amazonaws.com/{key}"
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        return None


async def s3_delete(key: str):
    
    key = "/".join(key.split("/")[3:])
    
    try:
        bucket.delete_objects(
            Delete={
                'Objects': [
                    {
                        'Key': key
                    }
                ]
            }
        )
    except ClientError as e:
        logger.error(f"Error deleting file: {e}")