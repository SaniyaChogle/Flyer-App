# Flyer Management Application

A full-stack web application for managing and sharing company flyers with role-based access control.

## Features

### Admin Features
- **Company Management**: Create, edit, and delete companies
- **Flyer Upload**: Upload flyers with title, date, and image
- **Month-based Organization**: Flyers organized by "For Date" (not upload date)
- **Title Management**: Choose from predefined titles or enter custom text
- **Edit Flyers**: Update title, for date, and replace images
- **Soft Delete**: Flyers are soft-deleted for data integrity
- **Filtering**: View flyers by company and month

### Company Features
- **View Flyers**: Browse flyers assigned to the company
- **Month Navigation**: Navigate through different months
- **Download**: Download flyer images
- **Share**: Share flyers to WhatsApp, Instagram, LinkedIn, Facebook (using Web Share API)
- **Read-Only**: Cannot delete or edit flyers

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: .NET Core 9.0 Web API
- **Database**: SQL Server
- **Authentication**: BCrypt password hashing
- **File Storage**: Local file system (`wwwroot/uploads`)

## Prerequisites

- Node.js (v18 or higher)
- .NET SDK 9.0 or higher
- SQL Server (Express, Developer, or full version)
- Git

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Flyer-App
```

### 2. Database Setup

1. Make sure SQL Server is installed and running
2. Update connection string in `backend/appsettings.json` if needed:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=FlyerAppDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

**Note**: If using SQL Server authentication instead of Windows authentication, use:
```json
"DefaultConnection": "Server=localhost;Database=FlyerAppDB;User Id=your_username;Password=your_password;TrustServerCertificate=True;MultipleActiveResultSets=true"
```

### 3. Backend Setup

```bash
cd backend

# Restore NuGet packages
dotnet restore

# Create database and apply migrations
dotnet ef database update

# Run the backend
dotnet run
```

The backend will start on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Default Credentials

After database seeding, the following user is created:

### Admin User
- **Email**: admin@flyer.com
- **Password**: admin123

### Company Registration
- **Self-service**: Companies register themselves via `/register`
- **Registration fields**: Company name, email, password
- **Automatic**: Company created in database during registration
- **Access**: Each registered company gets their own account

### Demo Flow
1. Admin logs in: `admin@flyer.com` / `admin123`
2. Companies register via: http://localhost:5173/register
3. Companies login with their registered credentials
4. Admin can upload flyers for any registered company

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "admin@flyer.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "admin@flyer.com",
  "role": "Admin",
  "companyId": null,
  "companyName": null
}
```

#### POST /api/auth/register
Register a new user (Admin only).

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "role": "Company",
  "companyId": 1
}
```

### Company Endpoints

#### GET /api/company
Get all companies.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Company A",
    "contactEmail": "contact@companya.com",
    "createdAt": "2026-01-20T10:00:00Z"
  }
]
```

#### POST /api/company
Create a new company.

**Request Body:**
```json
{
  "name": "New Company",
  "contactEmail": "contact@newcompany.com"
}
```

#### PUT /api/company/{id}
Update a company.

#### DELETE /api/company/{id}
Soft delete a company.

### Flyer Endpoints

#### GET /api/flyer
Get all flyers with optional filters.

**Query Parameters:**
- `companyId` (optional): Filter by company
- `year` (optional): Filter by year
- `month` (optional): Filter by month (1-12)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Republic Day",
    "imagePath": "/uploads/abc123.png",
    "companyId": 1,
    "companyName": "Company A",
    "forDate": "2026-01-26",
    "createdAt": "2026-01-20T10:00:00Z"
  }
]
```

#### GET /api/flyer/company/{companyId}
Get flyers for a specific company.

**Query Parameters:**
- `year` (optional): Filter by year
- `month` (optional): Filter by month

#### POST /api/flyer/upload
Upload a new flyer.

**Request (multipart/form-data):**
- `title`: Flyer title
- `forDate`: Date the flyer is for (YYYY-MM-DD)
- `companyId`: Company ID
- `file`: Image file (PNG/JPG)

#### PUT /api/flyer/{id}
Update a flyer.

**Request (multipart/form-data):**
- `title`: Updated title
- `forDate`: Updated for date
- `file` (optional): New image file

#### DELETE /api/flyer/{id}
Soft delete a flyer.

#### GET /api/flyer/download/{id}
Download a flyer image.

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| Id | INT | Primary key |
| Email | NVARCHAR(255) | Unique email |
| PasswordHash | NVARCHAR(500) | BCrypt hashed password |
| Role | NVARCHAR(50) | 'Admin' or 'Company' |
| CompanyId | INT | FK to Companies (NULL for Admin) |
| CreatedAt | DATETIME2 | Creation timestamp |
| IsActive | BIT | Soft delete flag |

### Companies Table
| Column | Type | Description |
|--------|------|-------------|
| Id | INT | Primary key |
| Name | NVARCHAR(200) | Unique company name |
| ContactEmail | NVARCHAR(255) | Contact email |
| CreatedAt | DATETIME2 | Creation timestamp |
| IsActive | BIT | Soft delete flag |

### Flyers Table
| Column | Type | Description |
|--------|------|-------------|
| Id | INT | Primary key |
| Title | NVARCHAR(500) | Flyer title |
| ForDate | DATE | Date flyer is for (determines month) |
| CreatedAt | DATETIME2 | Upload timestamp |
| ImagePath | NVARCHAR(500) | Path to image file |
| CompanyId | INT | FK to Companies |
| IsDeleted | BIT | Soft delete flag |

## Password Requirements

- Minimum 6 characters
- At least one letter
- At least one number
- No special characters required

## File Upload

- **Allowed Formats**: PNG, JPG, JPEG
- **Storage Location**: `backend/wwwroot/uploads/`
- **File Naming**: GUID-based unique names

## Development Notes

### Migrations

To create a new migration:
```bash
cd backend
dotnet ef migrations add MigrationName
dotnet ef database update
```

### Building for Production

**Backend:**
```bash
cd backend
dotnet publish -c Release
```

**Frontend:**
```bash
cd frontend
npm run build
```

## Troubleshooting

### Backend won't start
- Ensure SQL Server is running
- Check connection string in `appsettings.json`
- Verify .NET SDK is installed: `dotnet --version`

### Database errors
- Delete migrations folder and database, then recreate:
```bash
cd backend
dotnet ef database drop
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in `Program.cs`
- Verify Vite proxy configuration in `vite.config.js`

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
