# 📌 React + TypeScript + Vite + FastAPI

This repository contains a **React + TypeScript + Vite** frontend and a **FastAPI + PostgreSQL** backend.  
It provides an exam paper management system where users can **upload, bookmark, and view question papers**.


**🛠 Tech Stack**
-----------------

*   **Frontend:** React, Vite, TypeScript, Tailwind CSS
    
*   **Backend:** FastAPI, PostgreSQL
    
*   **Database:** PostgreSQL (Hosted on Render)
    
*   **Storage:** AWS S3 (For PDFs and files)
    
*   **Authentication:** JWT (JSON Web Token)
    
*   **State Management:** React Context API
    
*   **Deployment:** Render (Backend), Vercel (Frontend)
    

**🚀 Features**
---------------

✅ Upload and view exam question papers✅ Bookmark and manage favorite papers✅ Role-based access (Students & Admins)✅ Secure authentication using JWT✅ PDF storage and retrieval via AWS S3

**📥 Clone & Run the Project**
------------------------------

### **1️⃣ Clone the Repository**

```sh
git clone [https://github.com/durgavarapraveen/Qpaper.git](https://github.com/durgavarapraveen/Qpaper.git) 
cd Qpaper
 ```

### **2️⃣ Setup the Backend (FastAPI)**

#### **🔹 Install dependencies**

  ```sh
cd server  pip install -r requirements.txt   
  ```

#### **🔹 Set up environment variables (.env)**

Create a .env file inside the server folder:

```sh  
DATABASE_URL=postgresql://your_db_user:your_db_password@your_db_host/your_db_name  SECRET_KEY=your_jwt_secret  AWS_ACCESS_KEY_ID=your_access_key  AWS_SECRET_ACCESS_KEY=your_secret_key
```

#### **🔹 Run FastAPI Backend**

```   
uvicorn main:app --reload
```

API will be live at: **http://127.0.0.1:8000**

### **3️⃣ Setup the Frontend (React)**

#### **🔹 Install dependencies**
```
cd client
npm install
```

#### **🔹 Set up environment variables (.env)**

Create a .env file inside the client folder:

```
VITE_BACKEND_URL=http://127.0.0.1:8000
```

#### **🔹 Run React App**

``` 
npm run dev
```

Frontend will be live at: **http://localhost:5173**



**🌍 Deployment**
-----------------

*   **Frontend:** Deployed on **Vercel**
    
*   **Backend:** Hosted on **Render**
    
*   **Database:** PostgreSQL on **Render**
    
*   **Storage:** AWS S3 for PDFs
    

**🙌 Contributing**
-------------------

1.  **Fork** the repository
    
2.  **Create a branch** (git checkout -b feature-branch)
    
3.  **Commit changes** (git commit -m "Add new feature")
    
4.  **Push to GitHub** (git push origin feature-branch)
    
5.  **Create a Pull Request**
    

**📄 License**
--------------

This project is licensed under the **MIT License**.
