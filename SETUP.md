# Quick Setup Guide

Follow these steps to get FormEasy running on your machine.

## Step-by-Step Setup

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### 2. Set Up MongoDB

Choose one of the following options:

#### Option A: Local MongoDB (Recommended for Development)

1. Download and install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service on your system
3. MongoDB will run on `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud - Free)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (select FREE tier)
4. Create a database user
5. Add your IP address to the whitelist (for testing, you can use 0.0.0.0/0)
6. Click "Connect" → "Connect your application"
7. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

### 3. Create Backend Environment File

Create a `.env` file in the `backend` directory:

```bash
cd backend
```

Create the `.env` file with this content:

```env
# MongoDB Connection URI
MONGODB_URI=mongodb://localhost:27017/form-easy-app

# OR use MongoDB Atlas (replace with your actual connection string):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/form-easy-app

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port (optional)
PORT=8080
```

### 4. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Paste it in your `backend/.env` file

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
Connected to MongoDB
Server is listening on http://localhost:8080
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 6. Open in Browser

Navigate to: `http://localhost:5173`

## Troubleshooting

### MongoDB Connection Issues

- **Error**: "Cannot connect to MongoDB"
- **Solution**: 
  - Ensure MongoDB is running (if using local)
  - Check your `MONGODB_URI` in `.env` file
  - If using Atlas, verify your IP is whitelisted

### Gemini API Issues

- **Error**: "API key not valid"
- **Solution**:
  - Verify your API key in `.env`
  - Check API key at [AI Studio](https://makersuite.google.com/app/apikey)
  - Ensure you haven't exceeded rate limits

### Port Already in Use

- **Error**: "Port 8080 already in use"
- **Solution**:
  - Change the `PORT` in `.env` file
  - Or stop the application using port 8080

### Module Not Found

- **Error**: "Cannot find module..."
- **Solution**:
  ```bash
  # Delete node_modules and reinstall
  rm -rf node_modules
  rm package-lock.json
  npm install
  
  # For backend
  cd backend
  rm -rf node_modules
  rm package-lock.json
  npm install
  ```

## Testing the Application

1. Go to the landing page
2. Click "Get Started"
3. Sign in with Google
4. Fill out the form context (optional, you can skip)
5. Describe your form (e.g., "A customer feedback form")
6. Click "Generate Fields"
7. Enter a form title
8. Click "Save Form"
9. You should see a success message!

## Next Steps

- Customize the Google OAuth client ID in `src/App.jsx`
- Add more form templates
- Implement form sharing
- Add form analytics
- Create a dashboard to manage forms

## Need Help?

Check the main README.md for more information about the project structure and API endpoints.

