# Backend Authentication Service (Node.js + Express + MongoDB)

This backend service handles user registration (**Sign Up**) and login (**Sign In**) using **MongoDB**, **Mongoose**, **bcrypt password encryption**, and **JSON Web Tokens (JWT)**.

---

## 🗄️ What You Need to Do in MongoDB (Step-by-Step)

You can choose either **MongoDB Atlas (Free Cloud Database - Recommended)** or **MongoDB Local (Community Server / Compass)**.

### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create an Account:**
   - Go to [mongodb.com](https://www.mongodb.com/) and click **Try Free** / Sign up.
2. **Create a Free Cluster:**
   - Choose the **M0 Free** tier.
   - Select your preferred cloud provider (AWS / Google Cloud) and region closest to you.
   - Click **Create Deployment**.
3. **Set Up Database User & Password:**
   - In **Security > Database Access**:
   - Click **Add New Database User**.
   - Choose **Password** authentication.
   - Set a username (e.g. `admin`) and a secure password.
   - Set privileges to **Read and write to any database**.
   - Click **Add User**. *(Remember your password!)*
4. **Configure Network Access (Whitelist IP):**
   - In **Security > Network Access**:
   - Click **Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`) or add your current IP address.
   - Click **Confirm**.
5. **Get Your Connection String:**
   - Go to **Database > Clusters** and click **Connect**.
   - Select **Drivers** (Node.js).
   - Copy the connection URI string. It looks like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
6. **Paste into `backend/.env`:**
   - Open `backend/.env`.
   - Update `MONGO_URI`:
     ```env
     MONGO_URI=mongodb+srv://admin:your_password@cluster0.xxxxx.mongodb.net/gal_auth_db?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with the database credentials created in step 3.

---

### Option B: Local MongoDB (Compass / Service)

If you have MongoDB installed locally on your computer:
1. Ensure the MongoDB service is running (Port `27017`).
2. Set your `backend/.env`:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/gal_auth_db
   ```

---

## 🚀 How to Run the Backend

1. Open your terminal in the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. You will see:
   ```
   🚀 Server running in development mode on http://localhost:5000
   ✅ MongoDB Connected: cluster0-shard-00-00.mongodb.net
   ```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Public / Private |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | Register new user with `{ name, email, password }` | Public |
| **POST** | `/api/auth/signin` | Login user with `{ email, password }` | Public |
| **GET** | `/api/auth/me` | Fetch currently authenticated user | Private (`Bearer <token>`) |
