# FormEasy - AI-Powered Form Builder

A modern, full-stack application that lets users create customized forms in minutes using natural language descriptions powered by Google Gemini AI.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Features Guide](#features-guide)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [API Endpoints](#api-endpoints)

## ✨ Features

### Core Functionality
- 🤖 **AI-Powered Generation** — Describe your form in plain English and AI generates fields
- 📝 **Multiple Field Types** — Support for text, email, password, date, time, file, rating, and more
- ✏️ **Form Editing** — Edit field labels, types, and order before saving
- 💾 **Database Storage** — Save and manage forms with MongoDB Atlas
- 📊 **Form Submissions** — Collect and view form responses
- 📤 **Data Export** — Export submissions as CSV or PDF
- 🔐 **Field Validation** — Enforce required fields and validate inputs
- 🎨 **Modern UI** — Beautiful, responsive interface with Tailwind CSS

### Field Types Supported
- **Input Fields:** text, email, password, number, phone, URL, color
- **Date/Time:** date, time, datetime-local
- **Selection:** select (dropdown), radio, checkbox
- **Text:** textarea
- **Special:** file upload, rating (1-5), range slider
- **More:** Can be easily extended

## 🛠️ Tech Stack

### Frontend
- React 19 with Hooks
- Vite (dev server & build tool)
- React Router (routing)
- Tailwind CSS (styling)
- Google OAuth integration

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- Google Generative AI (Gemini API)
- CORS enabled for frontend

### Database
- MongoDB Atlas (cloud) or local MongoDB
- Collections: Forms, Submissions

## 📦 Prerequisites

### Required
- **Node.js** v16 or higher
- **npm** (comes with Node.js)
- **MongoDB** (local or MongoDB Atlas account)
- **Google Gemini API Key** (free tier available)
- **Google OAuth Client ID** (optional, for authentication)

### Create Accounts
1. **MongoDB Atlas** — https://cloud.mongodb.com/
   - Create a free account
   - Create a cluster (choose FREE tier)
   - Get your connection string

2. **Google Gemini API** — https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Generate new API key
   - Enable Generative Language API in Google Cloud Console

3. **Google OAuth (Optional)** — https://console.cloud.google.com/
   - Create a new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Get your Client ID

## 🚀 Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd form-easy-app
```

### Step 2: Install Dependencies

**Install Backend Dependencies:**
```bash
cd backend
npm install
```

**Install Frontend Dependencies (from root directory):**
```bash
cd ..
npm install
```

### Step 3: Configure Environment Variables

**Create `.env` file in the `backend/` directory:**

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?appName=Cluster0

# Google Gemini API
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Server
PORT=8080
```

**For Frontend (Optional - configure in `src/App.jsx`):**
Update the `GOOGLE_CLIENT_ID` constant with your OAuth Client ID if using Google login.

### Step 4: Start the Application

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm run dev
```
Expected output:
```
Environment check:
- PORT: 8080
- MongoDB URI configured: true
- Gemini API Key configured: true
Connected to MongoDB
Server is listening on http://localhost:8080
```

**Terminal 2 - Start Frontend Server:**
```bash
cd ..
npm run dev
```
Open your browser to: http://localhost:5173

## 📖 Features Guide

### 1. Generate Forms with AI
1. Click "Create Form" on landing page
2. Fill in form title and description (optional)
3. Type what fields you want (e.g., "I need a contact form with name, email, and message")
4. Click "Generate Fields"
5. Review the AI-generated fields

### 2. Edit Forms
1. After generation, click "Edit Fields"
2. Add, remove, or modify fields
3. Change field types, labels, and options
4. Reorder fields with up/down arrows
5. Click "Save Form" when done

### 3. Collect Responses
1. Save your form
2. Share the form URL with respondents
3. They fill out and submit responses
4. Responses save to MongoDB automatically

### 4. View & Analyze Submissions
1. After saving a form, access the "View Submissions" link
2. Search across all responses
3. Click on individual submissions to see details
4. Sort by submission date

### 5. Export Data
1. In submissions view, click "Export"
2. Choose CSV (for spreadsheets) or PDF (for documents)
3. File downloads automatically with all responses

## 🌐 Environment Configuration

### MongoDB Connection String

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/form-easy-app
```

**MongoDB Atlas (Recommended):**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/form-easy-app?retryWrites=true&w=majority
```

Steps to get Atlas connection string:
1. Go to MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials

### Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the generated key (starts with "AIza")
4. Add to your `.env` file

**Troubleshooting API Key Issues:**
- Ensure "Generative Language API" is enabled in Google Cloud Console
- Check that billing is enabled for your Google Cloud project
- If getting 403 errors, try creating an unrestricted API key for testing
- Keys may take a few minutes to activate

## ▶️ Running the Application

### Development Mode
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Production Build
```bash
# Build frontend
npm run build

# Start backend with Node
cd backend
node index.js
```

## 🔧 Troubleshooting

### Backend Issues

**Error: "GEMINI_API_KEY is not configured"**
- Verify `.env` file exists in `backend/` directory
- Check that `.env` contains `GEMINI_API_KEY=AIza...`
- Restart backend after editing `.env`

**Error: "Failed to connect to MongoDB"**
- Check your MongoDB connection string in `.env`
- Verify MongoDB service is running
- For Atlas, ensure your IP is whitelisted (or allow all IPs for testing)
- Test connection manually with MongoDB Compass

**Error: "API key not valid"**
- Get a fresh API key from https://makersuite.google.com/app/apikey
- Ensure Generative Language API is enabled in Google Cloud Console
- Check that billing is enabled

### Frontend Issues

**Error: "Cannot GET /api/generate-fields"**
- Ensure backend is running on port 8080
- Check that backend logs show "Server is listening on http://localhost:8080"
- Verify Vite proxy is set up correctly in `vite.config.js`

**Form not loading (blank page)**
- Open browser DevTools (F12) → Console
- Check for JavaScript errors
- Verify all imports in `App.jsx` are correct

**CORS Errors**
- Backend CORS is already configured
- If issues persist, ensure you're accessing frontend via http://localhost:5173

### Database Issues

**Forms not saving to database**
- Check MongoDB connection is working: `npm run dev` should print "Connected to MongoDB"
- Verify collection exists in MongoDB Atlas
- Check browser console for submission errors

**Submissions showing as empty**
- Verify form submission API endpoint is working
- Check MongoDB Submission collection in Atlas

## 📡 API Endpoints

### Form Management

**Generate Fields**
```
POST /api/generate-fields
Body: { formDescription: string }
Returns: Array of field objects
```

**Save Form**
```
POST /api/forms
Body: { title, description, fields, userId }
Returns: Saved form object with _id
```

**Get Form**
```
GET /api/form/:formId
Returns: Form object with all details
```

**Get All Forms**
```
GET /api/forms/:userId
Returns: Array of user's forms
```

### Submissions

**Submit Form Response**
```
POST /api/submit/:formId
Body: { responses: object, submittedBy: string }
Returns: Submission object
```

**Get Submissions**
```
GET /api/submissions/:formId
Returns: Array of all submissions for a form
```

## 🚀 Deployment

### Deploy to Vercel (Frontend)

1. Push code to GitHub
2. Go to https://vercel.com and sign up
3. Click "New Project" and import your repository
4. Set environment variables in Vercel settings if needed
5. Deploy!

### Deploy to Heroku (Backend)

1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI="your_connection_string"
   heroku config:set GEMINI_API_KEY="your_api_key"
   heroku config:set PORT=3000
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

### Deploy to Railway or Render

These services offer similar deployment workflows to Heroku. Consult their documentation for detailed steps.

### Update API Endpoints

After deployment, update your frontend API calls to point to the deployed backend:

In `src/pages/FieldGenerationPage.jsx`, `FormResponsePage.jsx`, etc.:
```javascript
// Change from:
const response = await fetch('/api/generate-fields', {...})

// No change needed if using Vite proxy!
// The proxy automatically routes /api to your backend
```

## 📝 Environment Variables Summary

| Variable | Description | Example |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| GEMINI_API_KEY | Google Gemini API key | `AIzaSyXXX...` |
| PORT | Backend server port | `8080` |
| GOOGLE_CLIENT_ID | OAuth Client ID (optional) | `xxx-xxx.apps.googleusercontent.com` |

## 🔐 Security Notes

- **Never commit `.env` file** — Add to `.gitignore`
- **Rotate API keys** after testing with real keys
- **Use environment variables** for all secrets
- **Validate inputs** on both frontend and backend
- **Use HTTPS** in production
- **Enable CORS** only for trusted domains in production
- **Rate limit API** calls to prevent abuse

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Google Gemini API](https://ai.google.dev/)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 Support & Issues

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review backend logs for error messages
3. Open browser DevTools (F12) to check for frontend errors
4. Verify all environment variables are set correctly
5. Check MongoDB connection and Gemini API configuration

## 📄 License

This project is open source and available under the MIT License.

---

**Happy form building! 🎉**
