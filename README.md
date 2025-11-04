# FormEasy - AI-Powered Form Builder

A modern, AI-powered form builder that lets you create customized forms in minutes using natural language descriptions.

## Features

- 🤖 **AI-Powered Generation**: Describe your form in plain English and let AI generate the fields
- 💾 **Database Storage**: Save and manage your forms with MongoDB
- 📝 **Dynamic Form Builder**: Create forms with various field types
- 🎨 **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- 🔗 **RESTful API**: Complete backend API for form management
- 📊 **Form Submissions**: Collect and view form submissions

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Tailwind CSS
- Google OAuth

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Google Gemini AI

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Gemini API Key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd form-easy-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection URI
MONGODB_URI=mongodb://localhost:27017/form-easy-app

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port
PORT=8080
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal and navigate to the project root:

```bash
npm install
npm run dev
```

### 4. MongoDB Setup

#### Option A: Local MongoDB

1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use `mongodb://localhost:27017/form-easy-app` in your `.env`

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string and update `MONGODB_URI` in `.env`

### 5. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to your `.env` file

## Running the Application

1. **Start MongoDB** (if using local)
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Frontend**: `npm run dev`
4. Open browser: `http://localhost:5173`

## Usage

1. **Landing Page**: Welcome screen
2. **Login**: Sign in with Google
3. **Create Form**: Provide form context (optional)
4. **Generate Fields**: Describe your form and let AI generate fields
5. **Save Form**: Save your generated form to the database
6. **View Forms**: Access your saved forms

## API Endpoints

- `POST /api/generate-fields` - Generate form fields using AI
- `POST /api/forms` - Save a new form
- `GET /api/forms/:userId` - Get all forms for a user
- `GET /api/form/:formId` - Get a specific form
- `POST /api/submit/:formId` - Submit a form
- `GET /api/submissions/:formId` - Get submissions for a form
- `GET /health` - Health check

## Project Structure

```
form-easy-app/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic (AI integration)
│   └── index.js         # Server entry point
├── src/
│   ├── pages/           # React pages
│   ├── components/      # Reusable components
│   ├── services/        # Frontend services
│   └── store/           # State management
└── public/              # Static assets
```

## Environment Variables

Create a `.env` file in the `backend` directory with:

- `MONGODB_URI`: MongoDB connection string
- `GEMINI_API_KEY`: Google Gemini API key
- `PORT`: Server port (optional, defaults to 8080)

## Development

- Frontend runs on: `http://localhost:5173`
- Backend runs on: `http://localhost:8080`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
