# Flyer Management App - Setup Guide

This guide will walk you through setting up the Flyer Management Application from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [SQL Server Setup](#sql-server-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [First Run](#first-run)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Node.js (v18 or higher)**
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **.NET SDK 9.0 or higher**
   - Download from: https://dotnet.microsoft.com/download
   - Verify installation: `dotnet --version`

3. **SQL Server**
   - Download SQL Server Express (free): https://www.microsoft.com/en-us/sql-server/sql-server-downloads
   - Or SQL Server Developer Edition (free)
   - Verify installation: Open SQL Server Management Studio (SSMS) and connect

4. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

---

## SQL Server Setup

### Option 1: Using Entity Framework Migrations (Recommended)

The application will automatically create the database when you run migrations. Skip to [Backend Setup](#backend-setup).

### Option 2: Manual Database Creation

If you prefer to create the database manually:

1. Open SQL Server Management Studio (SSMS)
2. Connect to your SQL Server instance
3. Create a new database named `FlyerAppDB`
4. The tables will be created automatically by Entity Framework when you run the application

### Connection String Configuration

Update `backend/appsettings.json` with your SQL Server connection details:

**For Windows Authentication (Default):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=FlyerAppDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

**For SQL Server Authentication:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=FlyerAppDB;User Id=your_username;Password=your_password;TrustServerCertificate=True;MultipleActiveResultSets=true"
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

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
dotnet restore
```

This will install:
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.Tools
- BCrypt.Net-Next
- Microsoft.AspNetCore.OpenApi

### Step 3: Create Database Migrations

```bash
dotnet ef migrations add InitialCreate
```

This creates migration files in the `Migrations` folder.

### Step 4: Apply Migrations to Database

```bash
dotnet ef database update
```

This will:
- Create the FlyerAppDB database
- Create all tables (Users, Companies, Flyers)
- Apply indexes and constraints
- Seed initial data (admin user and 3 companies)

### Step 5: Verify Database

Connect to SQL Server and verify that:
- FlyerAppDB database exists
- Tables: Users, Companies, Flyers, __EFMigrationsHistory
- Seed data is present (run: `SELECT * FROM Users`)

### Step 6: Run the Backend

```bash
dotnet run
```

You should see:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://0.0.0.0:5000
```

Keep this terminal open. The backend is now running.

### Step 7: Test the Backend (Optional)

Open a new terminal and test the API:

```bash
curl http://localhost:5000/api/company
```

You should see a list of companies.

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a NEW terminal (keep backend running) and navigate to frontend:

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React 18
- React Router
- Axios
- Vite
- And other dependencies

### Step 3: Configure API URL (if needed)

The frontend is pre-configured to work with the backend on localhost. If your backend runs on a different port or host, update `frontend/src/services/api.js`.

### Step 4: Run the Frontend

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 5: Open in Browser

Navigate to: http://localhost:5173/

You should see the login page.

---

## First Run

### 1. Login as Admin

Use the default admin credentials:
- **Email**: admin@flyer.com
- **Password**: admin123

### 2. Explore Admin Features

- **Manage Companies**: Add, edit, or delete companies
- **Upload Flyers**: Upload a flyer with title, date, and image
- **Browse by Month**: Use month navigation to view flyers
- **Edit Flyers**: Click "Edit" to modify flyer details
- **Filter**: Select a company from the dropdown to filter

### 3. Login as Company User

Logout and login with a company account:
- **Email**: companyA@flyer.com
- **Password**: company123

### 4. Explore Company Features

- **View Flyers**: See all flyers for your company
- **Month Navigation**: Browse different months
- **Download**: Download flyer images
- **Share**: Share flyers to social media (works best on mobile)

---

## Troubleshooting

### Backend Issues

#### "Unable to connect to SQL Server"
- Ensure SQL Server is running
- Check connection string in `appsettings.json`
- For SQL Express, use `Server=localhost\\SQLEXPRESS`
- Test connection in SSMS first

#### "A network-related error occurred"
- Enable TCP/IP in SQL Server Configuration Manager
- Restart SQL Server service
- Check Windows Firewall settings

#### "BUILD FAILED: CS0117 errors"
- Delete `bin` and `obj` folders
- Run `dotnet clean`
- Run `dotnet restore`
- Run `dotnet build`

#### Port 5000 already in use
- Change port in `Program.cs`: `builder.WebHost.UseUrls("http://0.0.0.0:5001");`
- Update frontend API configuration accordingly

### Frontend Issues

#### "Failed to fetch" or CORS errors
- Ensure backend is running
- Check backend console for CORS errors
- Verify `vite.config.js` proxy configuration

#### Port 5173 already in use
- Vite will automatically try the next available port
- Or specify a port: `npm run dev -- --port 3000`

#### npm install fails
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Database Issues

#### "Database already exists" when running migrations
```bash
dotnet ef database drop --force
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### "No migrations found"
- Ensure you're in the `backend` directory
- Run `dotnet ef migrations add InitialCreate`

#### Seed data not created
- Check DbSeeder.cs
- The seeder only runs if no companies exist
- Manually insert data or drop and recreate database

### General Issues

#### Changes not reflecting
- **Backend**: Stop and restart `dotnet run`
- **Frontend**: Vite has HMR, but sometimes needs `Ctrl+C` and restart
- Clear browser cache or use incognito mode

#### File uploads not working
- Ensure `backend/wwwroot/uploads/` directory exists
- Check file permissions
- Verify file size limits in IIS/Kestrel config

---

## Next Steps

1. **Change Default Passwords**: Update admin and company passwords
2. **Add Real Companies**: Replace seed companies with actual data
3. **Upload Flyers**: Start adding flyers for different months
4. **Test Sharing**: Test share functionality on mobile devices
5. **Customize**: Update branding, colors, and titles as needed

---

## Production Deployment

For production deployment, see:
- Backend: Configure IIS or publish to Azure App Service
- Frontend: Run `npm run build` and serve `dist` folder
- Database: Use full SQL Server, not Express
- Security: Enable HTTPS, implement JWT tokens, add rate limiting

---

## Support

If you encounter issues not covered here:
1. Check the main README.md
2. Review API_DOCUMENTATION.md
3. Check application logs in the console
4. Create an issue in the repository
