import { generateFormFields, getHtmlInputType } from '../services/geminiService.js';
import Form from '../models/Form.js';
import Submission from '../models/Submission.js';

export const orchestrateFieldGeneration = async (req, res) => {
  try {
    const { formDescription } = req.body;
    if (!formDescription) {
      return res.status(400).json({ error: "formDescription is required." });
    }

    console.log("Step 1: Received request:", formDescription);
    console.log("prateek");

    // Step 2 & 3: Get initial fields from LLM
    const initialFields = await generateFormFields(formDescription);
    console.log("Step 3: Received initial fields from LLM.");

    // Step 5: Get HTML type for each field from LLM
    const finalizedFieldsPromises = initialFields.map(async (field) => {
      const htmlType = await getHtmlInputType(field);
      return { ...field, htmlType };
    });

    const finalizedFields = await Promise.all(finalizedFieldsPromises);
    console.log("Step 5: Finalized fields with HTML types.");

    res.status(200).json(finalizedFields);
  } catch (error) {
    console.error("Error in orchestrator:", error);
    console.error("Error details:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ 
      error: "An internal server error occurred.",
      details: error.message 
    });
  }
};

// Save a form to the database
export const saveForm = async (req, res) => {
  try {
    const { title, purpose, audience, description, fields, userId } = req.body;
    
    if (!title || !description || !fields || !userId) {
      return res.status(400).json({ error: "Missing required fields: title, description, fields, userId" });
    }

    const form = new Form({
      title,
      purpose: purpose || '',
      audience: audience || '',
      description,
      fields,
      userId,
      updatedAt: Date.now()
    });

    const savedForm = await form.save();
    res.status(201).json(savedForm);
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

// Get all forms for a user
export const getForms = async (req, res) => {
  try {
    const { userId } = req.params;
    const forms = await Form.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

// Get a specific form by ID
export const getFormById = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId);
    
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    
    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

// Submit a form
export const submitForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const { responses, submittedBy } = req.body;
    
    if (!responses) {
      return res.status(400).json({ error: "responses are required" });
    }

    // Verify form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const submission = new Submission({
      formId,
      responses,
      submittedBy: submittedBy || 'Anonymous'
    });

    const savedSubmission = await submission.save();
    res.status(201).json(savedSubmission);
  } catch (error) {
    console.error("Error saving submission:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

// Get submissions for a form
export const getSubmissions = async (req, res) => {
  try {
    const { formId } = req.params;
    const submissions = await Submission.find({ formId }).sort({ submittedAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};