import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Corresponds to Step 2 in the Process Flow PDF.
 * Generates an initial list of form fields.
 */
export const generateFormFields = async (userPrompt) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured. Please check your .env file.");
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
    const instruction = `Based on the user request "${userPrompt}", generate a JSON array of form fields. Each object must have "fieldName", "fieldLabel", "fieldType", "fieldRequired" (boolean), and "fieldOptions" (an array, empty if not applicable). Your entire response must be only the raw JSON array.`;

    const result = await model.generateContent(instruction);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating form fields:", error.message);
    throw new Error(`Failed to generate form fields: ${error.message}`);
  }
};

/**
 * Corresponds to Step 5 in the Process Flow PDF.
 * Determines the best HTML input type for a field.
 */
export const getHtmlInputType = async (field) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
    const prompt = `Given a form field with label "${field.fieldLabel}" and type "${field.fieldType}", what is the most appropriate HTML tag or input type? Choose one from: "input-text", "input-email", "input-password", "input-number", "input-date", "textarea", "select", "input-radio", "input-checkbox". Respond with ONLY ONE value from the list.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error getting HTML input type:", error.message);
    return "input-text"; // Fallback to text input
  }
};