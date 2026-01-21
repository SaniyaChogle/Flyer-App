# Quick Start Guide - Flyer Management App

Get the application running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js installed (`node --version`)
- ✅ .NET SDK 9.0+ installed (`dotnet --version`)
- ✅ SQL Server running (Express, Developer, or Full)

## Step 1: Clone & Setup (1 minute)

```bash
# Navigate to project directory
cd Flyer-App

# Install backend dependencies
cd backend
dotnet restore

# Install frontend dependencies (in new terminal)
cd frontend
npm install
```

## Step 2: Configure Database (30 seconds)

Edit `backend/appsettings.json`:

**For Windows Authentication (Default):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=FlyerAppDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

**For SQL Server Express:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=FlyerAppDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

## Step 3: Create Database (1 minute)

```bash
# From backend directory
dotnet ef migrations add InitialCreate
dotnet ef database update
```

This creates the database, tables, and seeds test data.

## Step 4: Run the Application (30 seconds)

**Terminal 1 - Backend:**
```bash
cd backend
dotnet run
```

Wait for: `Now listening on: http://0.0.0.0:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Wait for: `Local: http://localhost:5173/`

## Step 5: Login & Test (1 minute)

Open browser: http://localhost:5173/

**Admin Login:**
- Email: `admin@flyer.com`
- Password: `admin123`

**Company Login:**
- Email: `companyA@flyer.com`
- Password: `company123`

---

## 🎉 You're Done!

The app is now running. Try:
1. **As Admin**: Add a company, upload a flyer
2. **As Company**: View flyers, share or download them

---

## Troubleshooting

### "Cannot connect to SQL Server"
- Check SQL Server is running
- For SQL Express, add `\\SQLEXPRESS` to server name
- Test connection in SQL Server Management Studio first

### "Port already in use"
- **Backend**: Change port in `Program.cs`
- **Frontend**: Vite will auto-select next port

### "Build errors"
```bash
cd backend
dotnet clean
dotnet restore
dotnet build
```

---

## Next Steps

- 📖 Read [README.md](README.md) for full documentation
- 🔧 See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
- 📚 Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
- ✅ Use [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) for testing

---

## Features Overview

### Admin Can:
- Manage companies (add, edit, delete)
- Upload flyers with custom or predefined titles
- Set "For Date" to organize flyers by month
- Edit flyer details and images
- Navigate through months
- Filter by company

### Company Can:
- View their flyers
- Navigate through months
- Download flyers
- Share to WhatsApp, Facebook, Instagram, LinkedIn
- **Cannot** edit or delete flyers

---

## Default Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@flyer.com | admin123 | Admin |
| companyA@flyer.com | company123 | Company A |
| companyB@flyer.com | company123 | Company B |
| companyC@flyer.com | company123 | Company C |

**Important**: Change these passwords in production!

---

Need help? Check the documentation files or create an issue.
