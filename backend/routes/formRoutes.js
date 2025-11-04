import express from 'express';
import { 
  orchestrateFieldGeneration,
  saveForm,
  getForms,
  getFormById,
  submitForm,
  getSubmissions
} from '../controllers/formController.js';

const router = express.Router();

// Generate form fields using AI
router.post('/generate-fields', orchestrateFieldGeneration);

// Save a form
router.post('/forms', saveForm);

// Get all forms for a user
router.get('/forms/:userId', getForms);

// Get a specific form by ID
router.get('/form/:formId', getFormById);

// Submit a form (public endpoint)
router.post('/submit/:formId', submitForm);

// Get submissions for a form
router.get('/submissions/:formId', getSubmissions);

export default router;