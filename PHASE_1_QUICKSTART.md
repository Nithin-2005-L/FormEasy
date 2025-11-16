# 🚀 Quick Start - Phase 1 Implementation

## ⚡ 5-Minute Setup

### Step 1: Environment Setup (2 min)

**Update `backend/.env`:**

```env
MONGODB_URI=mongodb+srv://your-user:your-pass@cluster.mongodb.net/form-easy-app
GEMINI_API_KEY=your-gemini-key
PORT=8080

# ADD THESE (NEW)
JWT_SECRET=my-super-secret-key-change-this
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d
```

### Step 2: Start Servers (2 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Should see: "Server is listening on http://localhost:8080"

**Terminal 2 - Frontend:**
```bash
cd .. (back to root)
npm run dev
```
✅ Should see: "ready in ... ms"

### Step 3: Test (1 min)

1. Open http://localhost:5173/login
2. Click "Sign Up"
3. Create account:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm: `password123`
4. Click "Create Account"
5. ✅ See success message
6. Use login form to test login

---

## 📊 What You Can Do Now

### ✅ Working Features
- Register with email/password
- Login with saved credentials
- Google OAuth sign-in
- Session persistence (auto-login on refresh)
- Theme selection (5 themes)
- Secure token storage

### 🔄 Under Construction
- Dashboard page (shows 404)
- Form builder UI (needs new routes)
- Analytics & submissions
- Form publishing

---

## 🧪 Quick Tests

### Test 1: Email Signup
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "fullName": "Test User"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "user1@example.com",
      "fullName": "Test User",
      ...
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

### Test 2: Email Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "password123"
  }'
```

### Test 3: Get Current User
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🎨 Themes Available

Switch themes in code:
```javascript
import { useTheme } from '../hooks/useTheme';

function MyComponent() {
  const { switchTheme } = useTheme();
  
  return (
    <div>
      <button onClick={() => switchTheme('dark')}>Dark</button>
      <button onClick={() => switchTheme('minimal')}>Minimal</button>
      <button onClick={() => switchTheme('vibrant')}>Vibrant</button>
      <button onClick={() => switchTheme('corporate')}>Corporate</button>
    </div>
  );
}
```

**Themes:**
1. **default** - Blue & Purple
2. **dark** - Green & Amber
3. **minimal** - Black & White
4. **vibrant** - Pink & Cyan
5. **corporate** - Dark Blue & Green

---

## 🐛 Troubleshooting

### "Cannot find module 'User'"
```bash
# Make sure backend starts successfully
cd backend
node index.js
```

### "JWT_SECRET is not configured"
```bash
# Add to backend/.env
JWT_SECRET=your-random-string
```

### "Cannot POST /api/auth/register"
```bash
# Make sure backend is running (Terminal 1)
# Check server logs for errors
```

### "404 Dashboard"
```bash
# Expected - Dashboard page created in Phase 2
# Auth system is working fine
```

### Tokens not saving
```bash
# Check browser console for errors
# F12 → Console tab
# Look for fetch errors or JS errors
```

---

## 📁 Key Files to Know

```
Core Files:
├── backend/models/User.js              ← User schema
├── backend/controllers/authController.js ← Auth logic
├── backend/routes/authRoutes.js        ← API endpoints
├── src/context/AuthContext.jsx         ← Auth state
├── src/pages/LoginPage.jsx             ← Login UI
└── src/config/themes.js                ← Theme definitions
```

---

## 🔐 Security Notes

✅ Passwords hashed before storage  
✅ Tokens verified on every request  
✅ Protected routes with middleware  
✅ CORS configured  
✅ Error messages don't leak info  

⚠️ For Production:
- Change JWT_SECRET to long random string
- Use httpOnly cookies instead of localStorage
- Enable HTTPS
- Add rate limiting
- Set up email verification

---

## 📈 Next Steps

**This Week:**
1. ✅ Test current implementation
2. Create Dashboard page
3. Enhance Landing page with animations
4. Add theme switcher to navbar

**Next Week:**
5. Form preview page
6. Theme selection in form editor
7. URL generation & sharing
8. QR code generation

---

## 💡 Tips

**Check if user is logged in:**
```javascript
const { isAuthenticated, user } = useAuth();
if (isAuthenticated) {
  console.log(`Welcome ${user.fullName}`);
}
```

**Make authenticated API calls:**
```javascript
const token = localStorage.getItem('accessToken');
fetch('/api/forms', {
  headers: { Authorization: `Bearer ${token}` }
});
```

**Switch theme:**
```javascript
const { switchTheme } = useTheme();
switchTheme('dark'); // Updates globally
```

**Redirect if not logged in:**
```javascript
useEffect(() => {
  if (!isAuthenticated) {
    navigate('/login');
  }
}, [isAuthenticated, navigate]);
```

---

## ✅ Success Indicators

When everything is working:
- ✅ Signup page has no errors
- ✅ Account created successfully
- ✅ Login works with new credentials
- ✅ Tokens visible in DevTools
- ✅ Auto-login on page refresh
- ✅ No 404 errors in console

---

## 📞 Getting Help

1. **Check logs:**
   - Backend: Terminal where `npm run dev` is running
   - Frontend: Browser DevTools → Console

2. **Read documentation:**
   - `PHASE_1_COMPLETE.md` - Full details
   - `REFINED_REQUIREMENTS_IMPLEMENTATION.md` - Roadmap

3. **Verify setup:**
   - MongoDB connected? Check `Connection: Connected`
   - .env loaded? Check backend logs
   - Ports open? (8080 for backend, 5173 for frontend)

---

**You're all set!** 🎉

Start with the 5-minute setup above. If you hit issues, check Troubleshooting section.

**Status:** ✅ Phase 1 Complete - Authentication System Ready!  
**Last Updated:** November 15, 2025
