from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    department: str

class RegisterResponse(BaseModel):
    status: int
    detail: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str
    username: str
    user_id: int
    department: str
    status: int

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str
    status: int
    
class RefreshToken(BaseModel):
    refresh_token: str
    
class EmailSchema(BaseModel):
    email: EmailStr
    
class ResetPassword(BaseModel):
    token: str
    new_password: str