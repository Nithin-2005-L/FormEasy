import { GoogleGenerativeAI } from "@google/generative-ai";

// Trim and validate the API key at module load so we catch formatting issues early
const API_KEY = (process.env.GEMINI_API_KEY || '').trim();
// Log masked info so we can confirm the key is being picked up (don't print the full key)
console.log('[Gemini] API key present:', !!API_KEY, 'length:', API_KEY.length);
// Initialize client with API key — this matches the official SDK signature
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Corresponds to Step 2 in the Process Flow PDF.
 * Generates an initial list of form fields.
 */
export const generateFormFields = async (userPrompt, title = '', purpose = '', audience = '') => {
  try {
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured. Please check your .env file.");
    }
    
    console.log('[Gemini] Calling generateFormFields with context:', {
      hasTitle: !!title,
      hasPurpose: !!purpose,
      hasAudience: !!audience,
      descriptionPreview: userPrompt?.slice(0, 80) || ''
    });

    // Use a stable Gemini model that is available on v1beta
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Build a comprehensive context from all available information
    const contextParts = [];
    if (title) contextParts.push(`Form Title: ${title}`);
    if (purpose) contextParts.push(`Purpose: ${purpose}`);
    if (audience) contextParts.push(`Target Audience: ${audience}`);
    contextParts.push(`Description: ${userPrompt}`);
    const fullContext = contextParts.join('\n');
    
    const instruction = `You are an expert form designer. Based on the following context (FORM TITLE, PURPOSE, TARGET AUDIENCE, and DESCRIPTION), generate a comprehensive and well-structured JSON array of form fields that are clearly and directly related to this specific form.

${fullContext}

CRITICAL REQUIREMENTS:
1. Generate AT LEAST 8 fields (minimum 8 fields required - do not generate less than 8)
2. Preferably generate 10-15 fields for a complete form
3. Every field MUST be meaningfully related to the form's title, purpose, target audience, and description (no generic or off-topic questions)
4. Each field MUST have: "fieldName", "fieldLabel", "fieldType", "fieldRequired" (boolean), and "fieldOptions" (array)
5. Make fieldNames camelCase (e.g., "firstName", "emailAddress", "companyName")
6. Make fieldLabels user-friendly with proper capitalization
7. Use appropriate fieldTypes for context (don't just use 'text' for everything)
8. ENSURE THE TOTAL NUMBER OF FIELDS IS AT LEAST 8

AVAILABLE FIELD TYPES:
text, email, password, number, date, time, datetime-local, textarea, select, radio, checkbox, file, url, phone, color, range, rating

EXAMPLES FOR REFERENCE:
- Rating field: {"fieldName": "satisfactionRating", "fieldLabel": "Overall Satisfaction", "fieldType": "rating", "fieldRequired": true, "fieldOptions": ["1", "2", "3", "4", "5"]}
- Select field: {"fieldName": "department", "fieldLabel": "Department", "fieldType": "select", "fieldRequired": true, "fieldOptions": ["Sales", "Engineering", "Marketing", "HR"]}
- Checkbox: {"fieldName": "agreeToTerms", "fieldLabel": "I agree to terms", "fieldType": "checkbox", "fieldRequired": true, "fieldOptions": []}
- Textarea: {"fieldName": "additionalComments", "fieldLabel": "Additional Comments", "fieldType": "textarea", "fieldRequired": false, "fieldOptions": []}
- File: {"fieldName": "attachment", "fieldLabel": "Attachment", "fieldType": "file", "fieldRequired": false, "fieldOptions": []}
- Phone: {"fieldName": "phoneNumber", "fieldLabel": "Phone Number", "fieldType": "phone", "fieldRequired": true, "fieldOptions": []}
- URL: {"fieldName": "website", "fieldLabel": "Website URL", "fieldType": "url", "fieldRequired": false, "fieldOptions": []}
- Date: {"fieldName": "startDate", "fieldLabel": "Start Date", "fieldType": "date", "fieldRequired": true, "fieldOptions": []}

Your entire response must be ONLY the raw JSON array with no markdown formatting, no backticks, and no additional text. The array must contain at least 8 field objects.`;

    const result = await model.generateContent(instruction);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedFields = JSON.parse(text);
    
    // Validate that we got at least 8 fields
    if (!Array.isArray(parsedFields)) {
      throw new Error("LLM did not return an array of fields");
    }
    
    console.log(`✅ Generated ${parsedFields.length} fields from LLM`);
    
    if (parsedFields.length < 8) {
      console.warn(`⚠️ WARNING: Only ${parsedFields.length} fields generated, but minimum 8 required. Attempting to generate more...`);
      
      // If less than 8 fields, add some common fields to reach the minimum
      const commonFields = [
        { fieldName: 'additionalInfo', fieldLabel: 'Additional Information', fieldType: 'textarea', fieldRequired: false, fieldOptions: [] },
        { fieldName: 'contactPreference', fieldLabel: 'Contact Preference', fieldType: 'select', fieldRequired: false, fieldOptions: ['Email', 'Phone', 'SMS'] },
        { fieldName: 'agreeToTerms', fieldLabel: 'I agree to the terms', fieldType: 'checkbox', fieldRequired: true, fieldOptions: [] },
        { fieldName: 'followUp', fieldLabel: 'Follow up with me', fieldType: 'checkbox', fieldRequired: false, fieldOptions: [] }
      ];
      
      const missingCount = 8 - parsedFields.length;
      const additionalFields = commonFields.slice(0, missingCount);
      const result = [...parsedFields, ...additionalFields];
      console.log(`✅ Added ${additionalFields.length} common fields. Total now: ${result.length}`);
      return result;
    }
    
    return parsedFields;
  } catch (error) {
    // Log the full error object for debugging (but avoid printing secrets)
    console.error("Error generating form fields:", error);
    const msg = error?.message || String(error);

    // If the LLM call fails due to API key / auth / network / model issues, return a safe fallback
    // so the frontend can continue to function while the API is fixed.
    // IMPORTANT: still guarantee AT LEAST 8 fields.
    const fallbackFields = [
      { fieldName: 'fullName', fieldLabel: 'Full Name', fieldType: 'text', fieldRequired: true, fieldOptions: [] },
      { fieldName: 'email', fieldLabel: 'Email Address', fieldType: 'email', fieldRequired: true, fieldOptions: [] },
      { fieldName: 'phoneNumber', fieldLabel: 'Phone Number', fieldType: 'phone', fieldRequired: false, fieldOptions: [] },
      { fieldName: 'age', fieldLabel: 'Age', fieldType: 'number', fieldRequired: false, fieldOptions: [] },
      { fieldName: 'preferredContactMethod', fieldLabel: 'Preferred Contact Method', fieldType: 'select', fieldRequired: false, fieldOptions: ['Email', 'Phone', 'SMS'] },
      { fieldName: 'satisfactionRating', fieldLabel: 'Overall Satisfaction', fieldType: 'rating', fieldRequired: false, fieldOptions: ['1', '2', '3', '4', '5'] },
      { fieldName: 'agreeToTerms', fieldLabel: 'I agree to the terms and conditions', fieldType: 'checkbox', fieldRequired: true, fieldOptions: [] },
      { fieldName: 'comments', fieldLabel: 'Additional Comments', fieldType: 'textarea', fieldRequired: false, fieldOptions: [] }
    ];

    // If error appears to be an auth/API-key/model problem, return fallback and surface details in logs
    if (/API key|API_KEY_INVALID|403|Forbidden|unregistered callers|404 Not Found|models\/.*not found/i.test(msg)) {
      console.warn('Returning fallback fields due to LLM API/model error. Fix GEMINI_API_KEY, enabled APIs, or model name to restore full functionality.');
      return fallbackFields;
    }

    throw new Error(`Failed to generate form fields: ${msg}`);
  }
};

/**
 * Corresponds to Step 5 in the Process Flow PDF.
 * Determines the best HTML input type for a field.
 */
export const getHtmlInputType = async (field) => {
  try {
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    
    // Match the same base model as above for consistency
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const prompt = `Given a form field with label "${field.fieldLabel}" and type "${field.fieldType}", what is the most appropriate HTML tag or input type? Choose one from: "input-text", "input-email", "input-password", "input-number", "input-date", "input-time", "input-datetime-local", "textarea", "select", "input-radio", "input-checkbox", "input-file", "input-url", "input-phone", "input-color", "input-range", "rating". Respond with ONLY ONE value from the list.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error getting HTML input type:", error);
    return "input-text"; // Fallback to text input
  }
};