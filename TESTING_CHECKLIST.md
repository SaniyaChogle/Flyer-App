# Testing Checklist - Flyer Management Application

This checklist helps verify all features are working correctly.

## Prerequisites
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] SQL Server database created and seeded
- [ ] Browser console open for debugging

---

## 1. Authentication Testing

### Admin Login
- [ ] Navigate to http://localhost:5173
- [ ] Login with: admin@flyer.com / admin123
- [ ] Verify redirect to Admin Dashboard
- [ ] Check user info is stored in localStorage

### Company Login
- [ ] Logout from admin
- [ ] Login with: companyA@flyer.com / company123
- [ ] Verify redirect to Company Dashboard
- [ ] Verify company name displayed in header

### Invalid Login
- [ ] Try invalid credentials
- [ ] Verify error message shown
- [ ] Verify no redirect occurs

---

## 2. Admin Dashboard - Company Management

### View Companies
- [ ] Login as admin
- [ ] Verify "Manage Companies" section visible
- [ ] Verify seed companies displayed (Company A, B, C)

### Add Company
- [ ] Click "+ Add Company" button
- [ ] Enter company name: "Test Company"
- [ ] Enter email: "test@company.com"
- [ ] Click "Add"
- [ ] Verify success message
- [ ] Verify company appears in list

### Delete Company
- [ ] Click "Delete" on Test Company
- [ ] Confirm deletion in popup
- [ ] Verify success message
- [ ] Verify company removed from list

---

## 3. Admin Dashboard - Flyer Upload

### Upload with Predefined Title
- [ ] Select "Choose from list" radio button
- [ ] Select title: "Republic Day"
- [ ] Select For Date: 2026-01-26
- [ ] Select Company: Company A
- [ ] Upload a test image (PNG or JPG)
- [ ] Click "Upload Flyer"
- [ ] Verify success message
- [ ] Verify flyer appears in list below

### Upload with Custom Title
- [ ] Select "Custom title" radio button
- [ ] Enter custom title: "Test Custom Flyer"
- [ ] Select For Date: current month
- [ ] Select Company: Company B
- [ ] Upload another test image
- [ ] Click "Upload Flyer"
- [ ] Verify upload successful

### Validation Testing
- [ ] Try uploading without selecting file - verify error
- [ ] Try uploading invalid file type (e.g., .txt) - verify error
- [ ] Try uploading without title - verify error
- [ ] Try uploading without date - verify error

---

## 4. Admin Dashboard - Month Navigation

### Current Month
- [ ] Verify month navigator shows current month
- [ ] Verify flyers for current month displayed

### Previous Month
- [ ] Click "◀ Previous" button
- [ ] Verify month changes to previous month
- [ ] Verify flyer list updates
- [ ] Verify year decrements when crossing January

### Next Month
- [ ] Click "Next ▶" button
- [ ] Verify month changes to next month
- [ ] Verify flyer list updates
- [ ] Verify year increments when crossing December

### Navigate to Empty Month
- [ ] Navigate to a future month with no flyers
- [ ] Verify "No flyers for this month yet" message

---

## 5. Admin Dashboard - Company Filter

### Filter by Company
- [ ] Select "Company A" from company filter dropdown
- [ ] Verify only Company A flyers shown
- [ ] Verify company badge shows "Company A"

### All Companies
- [ ] Select "All Companies"
- [ ] Verify all flyers from all companies shown
- [ ] Verify different company badges visible

### Filter + Month Navigation
- [ ] Filter by Company B
- [ ] Change month using navigation
- [ ] Verify filter persists across month changes
- [ ] Verify only Company B flyers for selected month shown

---

## 6. Admin Dashboard - Edit Flyer

### Edit Title and Date
- [ ] Click "Edit" button on a flyer
- [ ] Modal should open
- [ ] Change title to "Updated Title"
- [ ] Change for date to different date
- [ ] Click "Update"
- [ ] Verify success message
- [ ] Verify flyer updates in list
- [ ] Verify flyer moves to new month if date changed

### Replace Image
- [ ] Click "Edit" on another flyer
- [ ] Keep title and date same
- [ ] Select "Replace Image"
- [ ] Upload a different image
- [ ] Click "Update"
- [ ] Verify new image displayed

### Cancel Edit
- [ ] Click "Edit" on a flyer
- [ ] Make changes
- [ ] Click "Cancel" or "×" button
- [ ] Verify modal closes
- [ ] Verify no changes saved

---

## 7. Admin Dashboard - Delete Flyer

### Delete Flyer
- [ ] Click "Delete" button on a flyer
- [ ] Verify confirmation dialog appears
- [ ] Confirm deletion
- [ ] Verify success message
- [ ] Verify flyer removed from list

### Cancel Delete
- [ ] Click "Delete" button
- [ ] Cancel in confirmation dialog
- [ ] Verify flyer NOT deleted

---

## 8. Admin Dashboard - Image Modal

### View Image
- [ ] Click on any flyer thumbnail
- [ ] Verify modal opens with large image
- [ ] Verify flyer title displayed
- [ ] Verify company name displayed

### Close Image Modal
- [ ] Press ESC key - verify modal closes
- [ ] Open again and click "×" button - verify closes
- [ ] Open again and click outside image - verify closes

---

## 9. Company Dashboard - View Flyers

### Access Dashboard
- [ ] Logout from admin
- [ ] Login as companyA@flyer.com
- [ ] Verify Company Dashboard loads
- [ ] Verify company name in header

### View Flyers
- [ ] Verify flyers for Company A displayed
- [ ] Verify flyers for OTHER companies NOT shown
- [ ] Verify current month selected by default

### Month Navigation
- [ ] Click "◀ Previous" button
- [ ] Verify previous month shown
- [ ] Verify only Company A flyers displayed
- [ ] Click "Next ▶" button multiple times
- [ ] Verify month updates correctly

---

## 10. Company Dashboard - Download

### Download Flyer
- [ ] Click "⬇️ Download" button on a flyer
- [ ] Verify file download starts
- [ ] Check Downloads folder
- [ ] Verify image file downloaded
- [ ] Verify image opens correctly

---

## 11. Company Dashboard - Share (Desktop)

### Share Functionality
- [ ] Click "📤 Share" button
- [ ] On desktop, Web Share API may not work
- [ ] If not supported, verify download fallback occurs
- [ ] Verify helpful message displayed

---

## 12. Company Dashboard - Share (Mobile)

### Share to Social Media (Test on Mobile Device)
- [ ] Open app on mobile browser
- [ ] Login as company user
- [ ] Click "📤 Share" button
- [ ] Verify share sheet appears
- [ ] Verify WhatsApp, Facebook, Instagram, LinkedIn options
- [ ] Try sharing to WhatsApp
- [ ] Verify image and title shared correctly

---

## 13. Company Dashboard - Restrictions

### No Edit/Delete
- [ ] Verify NO "Edit" button on flyers
- [ ] Verify NO "Delete" button on flyers
- [ ] Verify only "Share" and "Download" buttons

### Image View
- [ ] Click on flyer thumbnail
- [ ] Verify image modal opens
- [ ] Verify can close modal
- [ ] Verify no edit options in modal

---

## 14. Cross-User Testing

### Data Isolation
- [ ] Login as Company A user
- [ ] Note the flyers visible
- [ ] Logout and login as Company B user
- [ ] Verify DIFFERENT flyers shown
- [ ] Verify Company A flyers NOT visible

### Admin sees All
- [ ] Login as admin
- [ ] Verify can see flyers from ALL companies
- [ ] Filter by Company A
- [ ] Verify only Company A flyers shown
- [ ] Select "All Companies"
- [ ] Verify flyers from A, B, C all visible

---

## 15. Edge Cases & Error Handling

### Empty States
- [ ] Login as new company with no flyers
- [ ] Verify "No flyers available yet" message

### Large Files
- [ ] Try uploading very large image (10MB+)
- [ ] Verify upload completes or appropriate error

### Special Characters
- [ ] Upload flyer with title containing special chars: "Test & Special <Title>"
- [ ] Verify title saved correctly
- [ ] Verify displays correctly in UI

### Date Edge Cases
- [ ] Upload flyer with For Date = December 31
- [ ] Navigate to December that year
- [ ] Verify flyer appears
- [ ] Navigate to January next year
- [ ] Verify flyer NOT in January

---

## 16. Browser Compatibility

### Desktop Browsers
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Edge
- [ ] Test in Safari (if on Mac)

### Mobile Browsers
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test share functionality on each

---

## 17. Performance Testing

### Load Time
- [ ] Clear cache
- [ ] Load admin dashboard
- [ ] Verify loads in < 3 seconds

### Large Dataset
- [ ] Upload 20+ flyers for same company
- [ ] Navigate through months
- [ ] Verify performance acceptable

---

## 18. Security Testing

### SQL Injection
- [ ] Try login with: admin@flyer.com' OR '1'='1
- [ ] Verify login fails

### XSS Testing
- [ ] Upload flyer with title: `<script>alert('XSS')</script>`
- [ ] View flyer in list
- [ ] Verify script NOT executed (displayed as text)

### Direct URL Access
- [ ] Logout
- [ ] Try accessing http://localhost:5173/ (dashboard)
- [ ] Verify redirected to login

---

## 19. Logout Testing

### Admin Logout
- [ ] Login as admin
- [ ] Click "Logout" button
- [ ] Verify redirected to login page
- [ ] Verify localStorage cleared
- [ ] Try browser back button
- [ ] Verify cannot access dashboard

### Company Logout
- [ ] Login as company
- [ ] Logout
- [ ] Verify same behavior as admin logout

---

## 20. Persistence Testing

### Refresh Page
- [ ] Login as admin
- [ ] Refresh page (F5)
- [ ] Verify still logged in
- [ ] Verify dashboard loads correctly

### Browser Restart
- [ ] Login
- [ ] Close browser completely
- [ ] Reopen and navigate to app
- [ ] Verify still logged in (localStorage persists)

---

## Bug Reporting Template

If you find a bug, report it using this format:

```
**Title**: Brief description

**Steps to Reproduce**:
1. Step one
2. Step two
3. etc.

**Expected Result**: What should happen

**Actual Result**: What actually happened

**Environment**:
- Browser: Chrome/Firefox/etc. version
- OS: Windows/Mac/Linux
- User Role: Admin/Company

**Screenshots**: (if applicable)

**Console Errors**: (if any)
```

---

## Test Summary

After completing all tests, fill out:

- **Total Tests**: ___
- **Passed**: ___
- **Failed**: ___
- **Blocked**: ___

**Critical Issues Found**:
1. 
2. 
3. 

**Minor Issues Found**:
1. 
2. 
3. 

**Recommendations**:
1. 
2. 
3.
