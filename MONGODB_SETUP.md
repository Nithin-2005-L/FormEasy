# MongoDB Setup - 5 Minutes ⏱️

## Option 1: MongoDB Atlas (Cloud) - RECOMMENDED ⭐

### Step 1: Create Free Account
1. Go to: **https://cloud.mongodb.com/**
2. Click **"Try Free"**
3. Sign up with Google (easiest!)

### Step 2: Create Free Cluster
1. Click **"Build a Database"**
2. Choose **"M0 FREE"** cluster (Free forever!)
3. Select closest region to you
4. Click **"Create"**

### Step 3: Create Database User
1. Username: `formeasy` (or any you like)
2. Password: **Generate secure password** (SAVE THIS!)
3. Click **"Create Database User"**

### Step 4: Network Access
1. Click **"Add My Current IP Address"**
2. Click **"Finish and Close"** (2-3 minutes to deploy)

### Step 5: Get Connection String
1. Click **"Connect"** button
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://formeasy:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. **IMPORTANT:** Replace `<password>` with your actual password!

### Step 6: Update .env File

Paste your connection string here: (leave blank if you want to keep local)

After you paste it, I'll update the backend/.env file for you automatically!

---

## ⚠️ Quick Alternative: MongoDB Local Install

If you prefer local MongoDB:
1. Download: https://www.mongodb.com/try/download/community
2. Install it
3. It starts automatically
4. Keep using: `mongodb://localhost:27017/form-easy-app`

---

## After Setup

Once you have the Atlas connection string, just tell me and I'll update your .env file immediately!

**Example:** "mongodb+srv://formeasy:mypassword123@cluster0.abc123.mongodb.net/form-easy-app"

