# Flyer App - Proof of Concept

A lightweight proof of concept for uploading, viewing, and sharing flyers between admin and companies.

## Features

✅ **Admin Dashboard**
- Login as admin
- Upload flyers for specific companies
- Select company from dropdown

✅ **Company Dashboard**
- Login as company (companies are users)
- View only their company's flyers
- Download flyers
- Share flyers via WhatsApp

## Tech Stack

**Backend:**
- ASP.NET Core Web API (.NET 9)
- Entity Framework Core
- SQLite Database

**Frontend:**
- React 18
- Vite
- React Router
- Axios

## Getting Started

### Prerequisites

- .NET 9 SDK
- Node.js (v18 or higher)

### Installation & Running

#### 1. Start Backend

```bash
cd backend
dotnet run
```

Backend will run on: `http://localhost:5000`

#### 2. Start Frontend

Open a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Demo Credentials

**Admin Account:**
- Email: `admin@flyer.com`
- Password: `admin123`

**Company Accounts:**
- Company A: `companyA@flyer.com` / `company123`
- Company B: `companyB@flyer.com` / `company123`
- Company C: `companyC@flyer.com` / `company123`

## Testing the Workflow

1. **Admin uploads flyer:**
   - Login as admin (`admin@flyer.com` / `admin123`)
   - Upload a flyer image (PNG/JPG)
   - Enter title
   - Select Company A
   - Click Upload

2. **Company A views flyer:**
   - Logout from admin
   - Login as Company A (`companyA@flyer.com` / `company123`)
   - See the uploaded flyer
   - Click "Download" to download the flyer
   - Click "Share on WhatsApp" to share

3. **Company B sees nothing:**
   - Logout from Company A
   - Login as Company B (`companyB@flyer.com` / `company123`)
   - No flyers visible (cross-company isolation working)

## Important Notes

⚠️ **This is a PoC - NOT production ready!**

- Plain text passwords (no encryption)
- localStorage for authentication (no JWT/sessions)
- No advanced validation
- No analytics or tracking
- Basic error handling only
- Local file storage (no cloud storage)

## Project Structure

```
Flyer-App/
├── backend/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   └── FlyerController.cs
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Company.cs
│   │   ├── Flyer.cs
│   │   └── UserRole.cs
│   ├── Data/
│   │   ├── AppDbContext.cs
│   │   └── DbSeeder.cs
│   ├── wwwroot/uploads/
│   └── Program.cs
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── CompanyDashboard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   └── App.jsx
    └── package.json
```

## Success Criteria

- [x] Admin can upload flyer in < 30 seconds
- [x] Company can view only their own flyers
- [x] Download works on desktop and mobile
- [x] WhatsApp share works with 2 taps
- [x] No cross-company flyer visibility

## License

This is a PoC project for demonstration purposes only.
