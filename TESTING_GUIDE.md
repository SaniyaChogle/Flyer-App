# Testing Guide - Flyer App PoC

## Quick Start

### Step 1: Start Backend
Open Terminal 1 and run:
```bash
cd backend
dotnet run
```
Wait for: `Now listening on: http://localhost:5000`

### Step 2: Start Frontend
Open Terminal 2 and run:
```bash
cd frontend
npm run dev
```
Wait for: `Local: http://localhost:5173/`

### Step 3: Open Browser
Navigate to: `http://localhost:5173`

---

## Test Scenarios

### 🧪 Test 1: Admin Upload Flow

**Expected Time:** < 30 seconds

1. Login as Admin:
   - Email: `admin@flyer.com`
   - Password: `admin123`
   - Click "Login"

2. Upload Flyer:
   - Enter Title: "Summer Sale 2026"
   - Select Company: "Company A"
   - Choose an image file (PNG or JPG)
   - Click "Upload Flyer"

3. Verify Success:
   - ✅ Success message appears
   - ✅ Form resets
   - ✅ Total time < 30 seconds

---

### 🧪 Test 2: Company View & Download

1. Logout from Admin
   - Click "Logout" button

2. Login as Company A:
   - Email: `companyA@flyer.com`
   - Password: `company123`
   - Click "Login"

3. View Flyers:
   - ✅ See "Summer Sale 2026" flyer
   - ✅ Flyer image displays correctly

4. Download Flyer:
   - Click "Download" button
   - ✅ File downloads successfully
   - ✅ Works on both desktop and mobile

---

### 🧪 Test 3: WhatsApp Share

**Expected:** < 2 taps/clicks

1. On Company Dashboard:
   - Click "Share on WhatsApp" button

2. On Mobile:
   - ✅ Native share dialog opens
   - ✅ Can select WhatsApp
   - ✅ Message includes flyer title and link

3. On Desktop:
   - ✅ Opens WhatsApp Web in new tab
   - ✅ Message pre-filled with flyer details

---

### 🧪 Test 4: Cross-Company Isolation

**Critical Security Test**

1. Still logged in as Company A:
   - Note the flyer(s) visible

2. Logout and Login as Company B:
   - Email: `companyB@flyer.com`
   - Password: `company123`

3. Verify Isolation:
   - ✅ Company A's flyers NOT visible
   - ✅ Message shows "No flyers available yet"

4. Upload Flyer for Company B:
   - Logout, login as Admin
   - Upload new flyer for "Company B"

5. Verify Company B Access:
   - Logout, login as Company B
   - ✅ Can see their own flyer
   - ✅ Still cannot see Company A's flyers

---

### 🧪 Test 5: Multiple File Types

1. Login as Admin

2. Test PNG Upload:
   - Upload a PNG file
   - ✅ Upload succeeds

3. Test JPG Upload:
   - Upload a JPG/JPEG file
   - ✅ Upload succeeds

4. Test Invalid File Type:
   - Try uploading a PDF or TXT file
   - ✅ Error message displays
   - ✅ Upload rejected

---

### 🧪 Test 6: Authentication & Authorization

1. Direct URL Access (Not Logged In):
   - Navigate to `http://localhost:5173/admin`
   - ✅ Redirects to login

2. Role-Based Access:
   - Login as Company A
   - Try accessing `/admin` in URL
   - ✅ Stays on company dashboard (or redirects)

3. Wrong Credentials:
   - Enter invalid email/password
   - ✅ Error message: "Invalid email or password"

---

## Success Criteria Checklist

After completing all tests, verify:

- [ ] Admin can upload flyer in < 30 seconds ⏱️
- [ ] Company can view only their own flyers 🔒
- [ ] Download works on both desktop and mobile 📥
- [ ] WhatsApp share works with 2 taps/clicks 💬
- [ ] No cross-company flyer visibility 🚫

---

## Troubleshooting

### Backend Issues

**Problem:** Backend won't start
- Check .NET 9 is installed: `dotnet --version`
- Delete `bin/` and `obj/` folders, rebuild

**Problem:** Database errors
- Delete `flyerapp.db` file
- Restart backend (database recreates automatically)

### Frontend Issues

**Problem:** Frontend won't start
- Check Node.js version: `node --version` (should be v18+)
- Delete `node_modules/` and run `npm install` again

**Problem:** CORS errors
- Ensure backend is running on port 5000
- Check CORS configuration in `Program.cs`

**Problem:** Images not loading
- Check `wwwroot/uploads/` directory exists
- Verify image files are in the directory
- Check browser console for 404 errors

---

## API Testing (Optional)

You can also test the API directly using tools like Postman or curl:

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flyer.com","password":"admin123"}'
```

### Get Companies
```bash
curl http://localhost:5000/api/flyer/companies
```

### Get Flyers for Company
```bash
curl http://localhost:5000/api/flyer/company/1
```

---

## Known Limitations (PoC)

⚠️ **Security:**
- Plain text passwords
- No session management
- No HTTPS enforcement

⚠️ **Functionality:**
- No flyer editing/deletion
- No pagination for large flyer lists
- No image compression
- No file size validation beyond browser limits

⚠️ **UI/UX:**
- Basic styling only
- No loading skeletons
- Minimal error handling
- No confirmation dialogs

---

**All tests passing?** ✅ PoC is complete and ready for demo!
