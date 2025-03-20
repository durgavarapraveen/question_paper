from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
import os
from dotenv import load_dotenv
from database import get_db
from sqlalchemy.orm import Session
from Model import Users as User
from typing import Optional

load_dotenv()


SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    
    if not token:
        raise HTTPException(status_code=401, detail="Authentication token is required")

    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")  # Extract email from token
        
        if not email:
            raise HTTPException(status_code=401, detail="Invalid authentication token")

        # Query the user
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return user  # You can return a dict or Pydantic model instead

    except:  
        raise HTTPException(status_code=401, detail="Invalid token")

