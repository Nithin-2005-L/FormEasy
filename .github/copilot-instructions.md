# FormEasy AI Agent Instructions

This document provides essential knowledge for AI agents working in the FormEasy codebase.

## Project Architecture

### Frontend (React + Vite)
- `src/pages/`: Page components with routing logic
  - `FieldGenerationPage.jsx`: AI-powered form field generation
  - `FormInputPage.jsx`: Dynamic form rendering and submission
  - `LandingPage.jsx`: Main entry point
- `src/components/`: Reusable UI components organized by domain
  - `auth/`: Authentication components
  - `common/`: Shared UI elements
  - `layout/`: Page layout components

### Backend (Node.js + Express)
- `backend/controllers/`: Request handlers (e.g., `formController.js`)
- `backend/models/`: MongoDB schemas (`Form.js`, `Submission.js`)
- `backend/routes/`: API route definitions
- `backend/services/`: Business logic and external integrations
  - `geminiService.js`: Google Gemini AI integration

## Key Workflows

### Development
```bash
# Frontend (Port 5173)
npm install
npm run dev

# Backend (Port 3000)
cd backend
npm install
npm run dev
```

### Environment Setup
1. Frontend: No env vars required
2. Backend: `.env` file in `backend/` directory:
   ```
   MONGODB_URI=<connection-string>
   GEMINI_API_KEY=<api-key>
   PORT=3000
   ```

## Project-Specific Patterns

### Form Generation Flow
1. Natural language description → `geminiService.js` → AI generates form structure
2. Generated structure validated and transformed in `formController.js`
3. Frontend renders dynamic form using generated schema

### Data Models
- Form: Stores form structure, fields, and metadata
- Submission: Captures form responses with validation

### Cross-Component Communication
- Backend: RESTful API endpoints in `formRoutes.js`
- Frontend: Service layer in `src/services/` for API interactions

## Key Files for Common Tasks
- Add new form field type: `backend/models/Form.js`, `src/components/common/FormFields/`
- Modify AI generation: `backend/services/geminiService.js`
- Update form validation: `backend/controllers/formController.js`
- Add new API endpoint: `backend/routes/formRoutes.js`

## Project Conventions
1. File StructureThere was an error generating the form fields. Please check the console for details.  
   - Backend follows MVC pattern with clear separation of concerns
   - Frontend components are grouped by domain/feature
2. Naming
   - React components: PascalCase
   - API endpoints: camelCase
   - Database models: PascalCase, singular form

## Integration Points
1. Google Gemini AI: Form field generation
2. MongoDB: Data persistence
3. React Router: Frontend routing
4. Tailwind CSS: Styling system