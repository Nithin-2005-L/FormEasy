# FormEasy - Complete Testing Guide

This guide walks you through testing all features of the FormEasy application end-to-end.

## 📋 Pre-Test Checklist

Before starting tests, ensure:
- ✅ Backend is running on port 8080
- ✅ Frontend is running on port 5173  
- ✅ MongoDB is connected
- ✅ Gemini API key is valid
- ✅ Both servers show successful startup logs

**Check Backend Startup:**
```
Environment check:
- PORT: 8080
- MongoDB URI configured: true
- Gemini API Key configured: true
Connected to MongoDB
Server is listening on http://localhost:8080
```

## 🧪 Test Scenario 1: Basic Form Generation

**Objective:** Test AI-powered form field generation

**Steps:**
1. Open http://localhost:5173 in browser
2. Click "Create Form" button
3. Fill in form details:
   - Title: "Restaurant Feedback Survey"
   - Purpose: "Collect customer feedback on dining experience"
   - Audience: "Customers who dined in last 7 days"
4. Click "Next"
5. On Generate Fields page, describe form:
   - Input: "Create a form with fields for restaurant rating (1-5 stars), food quality feedback, service rating, willingness to recommend, and comments"
6. Click "Generate Fields"

**Expected Results:**
- ✅ Fields generate within 3-5 seconds
- ✅ Generated fields include: rating, select/radio, text area, etc.
- ✅ Each field shows: label, name, type, required status
- ✅ No errors in browser console
- ✅ Backend logs show: "Step 1: Received request", "Step 5: Finalized fields"

**Troubleshooting:**
- If generation fails, check backend logs for API key errors
- Verify MongoDB connection is working
- Check browser DevTools → Network tab for 500 errors

---

## 🧪 Test Scenario 2: Form Editing

**Objective:** Test ability to edit generated fields before saving

**Steps:**
1. After fields generate (from Scenario 1), click "Edit Fields"
2. You should see form editor with generated fields
3. Edit the rating field:
   - Click "Edit" on the rating field
   - Change label to "Overall Satisfaction"
   - Confirm field type is "rating"
   - Click "Save Field"
4. Add a new field:
   - Click "+ Add Field"
   - Set name: "visit_frequency"
   - Set label: "How often do you visit?"
   - Set type: "select"
   - Add options: "First time, Regular, Very frequent"
   - Click "Save Field"
5. Reorder fields:
   - Use ↑ and ↓ buttons to reorder

**Expected Results:**
- ✅ Editing dialog opens with current field values
- ✅ Can change field properties
- ✅ New fields can be added with proper validation
- ✅ Fields reorder with arrow buttons
- ✅ Delete buttons remove fields
- ✅ Save Field updates the field in the list

---

## 🧪 Test Scenario 3: Save Form

**Objective:** Test saving form to database

**Steps:**
1. In Form Editor with your edited fields
2. Set form title: "Restaurant Feedback 2024"
3. Set description: "Comprehensive feedback collection form"
4. Click "Save Form"
5. Wait for success message
6. You should be redirected to the form response page

**Expected Results:**
- ✅ Success message appears: "Form saved successfully!"
- ✅ Redirects to form response page with URL: /form/{formId}
- ✅ Form title displays correctly
- ✅ All your edited fields are displayed

**Verify in MongoDB:**
```bash
# Connect to MongoDB Atlas
# Database: form-easy-app
# Collection: forms
# Document should contain all fields with your edits
```

---

## 🧪 Test Scenario 4: Fill & Submit Form

**Objective:** Test form submission with various field types

**Steps:**
1. On the form response page (after saving from Scenario 3)
2. Fill in all fields:
   - Rating: Click on "⭐ 5" 
   - Overall Satisfaction: Click on "⭐ 4"
   - Visit Frequency: Select "Regular"
   - Food Quality: Type feedback text
   - Comments: Type additional comments
3. Leave one required field empty (if any)
4. Click "Submit Response" 
5. Verify validation error appears
6. Fill the missing field
7. Click "Submit Response" again

**Expected Results:**
- ✅ All field types render correctly
- ✅ Required field validation works
- ✅ Error message shows for missing required fields
- ✅ Radio/checkbox selections work
- ✅ File input displays (if file field exists)
- ✅ Success message: "✓ Form Submitted Successfully!"
- ✅ Redirects to home page after 2 seconds

**Verify in MongoDB:**
```bash
# Connect to MongoDB Atlas
# Collection: submissions
# Document should contain:
#  - formId: {your form ID}
#  - responses: {all your answers}
#  - submittedAt: timestamp
#  - submittedBy: "Anonymous"
```

---

## 🧪 Test Scenario 5: Submit Multiple Responses

**Objective:** Test collecting multiple form responses

**Steps:**
1. From home page, navigate back to your form (save the form URL)
2. Fill and submit the form again with different answers
3. Repeat 2-3 more times with different responses
4. Each time verify success message

**Expected Results:**
- ✅ Each submission saves separately
- ✅ All submissions have same formId
- ✅ Different responses are recorded
- ✅ Timestamps are different

---

## 🧪 Test Scenario 6: View Submissions

**Objective:** Test submissions viewing and filtering

**Steps:**
1. After submitting multiple responses (from Scenario 5)
2. Navigate to: http://localhost:5173/submissions/{formId}
   (Replace {formId} with your actual form ID from the URL)
3. You should see a list of all submissions
4. Click on a submission to view details
5. Verify all fields and responses display correctly
6. Go back to submission list
7. Test search:
   - Type a word from a response in search box
   - Verify submissions filter

**Expected Results:**
- ✅ Submissions page loads
- ✅ Total count displays (e.g., "Total: 3 responses")
- ✅ List shows all submissions
- ✅ Click to view detailed response
- ✅ Detail view shows all field responses
- ✅ Search filters submissions correctly
- ✅ Date sorting works

---

## 🧪 Test Scenario 7: Export Data

**Objective:** Test data export to CSV and PDF

**Steps:**
1. On submissions page with multiple responses
2. Click "CSV" export button
3. Verify file downloads: `{form-title}_submissions.csv`
4. Open CSV in Excel or text editor
5. Verify:
   - First row: field labels as headers
   - Subsequent rows: response data
   - All submissions included
6. Go back to submissions page
7. Click "PDF" export button
8. Verify text file downloads: `{form-title}_submissions.txt`
9. Open and verify formatted export

**Expected Results:**
- ✅ CSV file downloads with correct name
- ✅ CSV has proper structure (headers + data rows)
- ✅ All field labels are columns
- ✅ All response data is included
- ✅ PDF/Text file downloads
- ✅ File contains readable submission data

**Note:** Current implementation exports to text format. For production PDF, consider adding jsPDF or react-pdf library.

---

## 🧪 Test Scenario 8: All Field Types

**Objective:** Test all supported field types

**Steps:**
1. Create a new form with description: "Create a form with all field types: text input, email, password, number, date, time, textarea, select dropdown, radio buttons, checkboxes, file upload, URL, phone number, color picker, range slider, and rating"
2. Generate fields
3. Review that Gemini generates all field types
4. Fill in all fields:
   - Text: Enter name
   - Email: Enter email@example.com
   - Password: Enter secret123
   - Number: Enter 42
   - Date: Select date from picker
   - Time: Select time from picker
   - Textarea: Type long text
   - Select: Choose from dropdown
   - Radio: Select one option
   - Checkbox: Select multiple options
   - File: Click to upload (or just select)
   - URL: Enter https://example.com
   - Phone: Enter +1-555-0123
   - Color: Click color picker
   - Range: Drag slider
   - Rating: Click star rating

**Expected Results:**
- ✅ Gemini generates diverse field types
- ✅ All field renderings work correctly
- ✅ Submission accepts all types
- ✅ Data saves properly to MongoDB
- ✅ Export includes all field data

---

## 🧪 Test Scenario 9: Error Handling

**Objective:** Test error handling and edge cases

**Test Cases:**

**Case A: Empty Form Description**
- Don't enter description
- Click "Generate Fields"
- Expected: Alert shows "Please describe the form"

**Case B: Save Without Fields**
- Clear all fields somehow (manual DB edit)
- Try to save
- Expected: Error message

**Case C: Submit Without Required Fields**
- Mark field as required
- Don't fill it
- Click submit
- Expected: Validation error for that field

**Case D: MongoDB Connection Loss**
- Stop MongoDB
- Try to save form
- Expected: Error message, no crash

---

## 🧪 Test Scenario 10: Performance & Limits

**Objective:** Test application with large datasets

**Steps:**
1. Submit 50+ responses to same form
2. Open submissions page
3. Load should complete in < 2 seconds
4. Search should filter quickly
5. Export 50+ submissions should complete

**Expected Results:**
- ✅ Page loads without hanging
- ✅ Search is responsive
- ✅ Export completes and downloads

---

## 📊 Test Results Template

Use this template to document your test results:

```
Test Date: ___________
Tester: ___________

Scenario 1: Form Generation _____ PASS / FAIL
Issues: 

Scenario 2: Form Editing _____ PASS / FAIL
Issues:

Scenario 3: Save Form _____ PASS / FAIL
Issues:

Scenario 4: Submit Form _____ PASS / FAIL
Issues:

Scenario 5: Multiple Submissions _____ PASS / FAIL
Issues:

Scenario 6: View Submissions _____ PASS / FAIL
Issues:

Scenario 7: Export Data _____ PASS / FAIL
Issues:

Scenario 8: All Field Types _____ PASS / FAIL
Issues:

Scenario 9: Error Handling _____ PASS / FAIL
Issues:

Scenario 10: Performance _____ PASS / FAIL
Issues:

Overall Status: _____ ALL PASS / SOME FAILURES

Notes:
```

---

## 🔍 Debug Commands

### Check Backend Health
```bash
curl http://localhost:8080/health
# Expected: {"status":"ok","database":"connected"}
```

### Check API Endpoint
```bash
curl -X POST http://localhost:8080/api/generate-fields \
  -H "Content-Type: application/json" \
  -d '{"formDescription":"test form"}'
```

### Monitor Backend Logs
Look for these log messages:
- `Step 1: Received request:` — Form generation started
- `Step 3: Received initial fields from LLM.` — AI response received
- `Step 5: Finalized fields with HTML types.` — Processing complete
- Errors like `API key not valid` or MongoDB connection issues

### MongoDB Verification
```bash
# Connect to MongoDB Atlas
# Check collections exist:
# - forms (should have your test form)
# - submissions (should have your test responses)
```

---

## ✅ Sign-Off

When all tests pass:
- ✅ Form generation works consistently
- ✅ All field types render and submit
- ✅ Data persists in MongoDB
- ✅ Export functions work
- ✅ No console errors
- ✅ Error handling works
- ✅ Performance is acceptable

**Application is ready for deployment! 🚀**

---

## 📞 Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Forms won't generate | Check Gemini API key in `.env`, verify billing enabled |
| Submissions not saving | Verify MongoDB connection, check backend logs |
| Fields not displaying | Clear browser cache (Ctrl+Shift+Delete), restart Vite |
| Export not working | Ensure submissions exist, check browser pop-up blocker |
| Redirect loops | Check React Router setup in App.jsx |
| CORS errors | Verify backend CORS middleware, check port numbers |

