import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = "AIzaSyAH58t0IB4KHKnXaEguQA5wSRgvHQbOBIw";
console.log('Testing with provided API key...');

const modelsToTest = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-pro",
  "gemini-pro-latest",
  "gemini-1.0-pro-latest"
];

const genAI = new GoogleGenerativeAI(API_KEY);

for (const modelName of modelsToTest) {
  try {
    console.log(`\nTesting: ${modelName}`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Say hello in one word");
    console.log(`✅ SUCCESS! Response: ${result.response.text()}`);
    process.exit(0);
  } catch (err) {
    if (err.message.includes('404')) {
      console.log(`❌ 404 - Model not found`);
    } else if (err.message.includes('403')) {
      console.log(`❌ 403 - Permission denied`);
    } else {
      console.log(`❌ Error: ${err.message}`);
    }
  }
}

console.log('\n❌ All models failed. API key may not have access to Gemini models.');
process.exit(1);

