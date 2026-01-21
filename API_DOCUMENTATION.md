# Flyer Management API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Currently, the API uses basic authentication without JWT tokens. Include user credentials in the request body for login.

---

## Auth Endpoints

### Login
**POST** `/auth/login`

Authenticate a user and receive user information.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "admin@flyer.com",
  "role": "Admin",
  "companyId": null,
  "companyName": null
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Invalid email or password"
}
```

---

### Register
**POST** `/auth/register`

Register a new user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "role": "Admin" | "Company",
  "companyId": number | null
}
```

**Response (200 OK):**
```json
{
  "message": "User registered successfully"
}
```

**Response (400 Bad Request):**
```json
{
  "message": "Password must be at least 6 characters, contain at least one letter and one number"
}
```

---

## Company Endpoints

### Get All Companies
**GET** `/company`

Retrieve all active companies.

**Response (200 OK):**
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

---

### Get Company by ID
**GET** `/company/{id}`

Retrieve a specific company.

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Company A",
  "contactEmail": "contact@companya.com",
  "createdAt": "2026-01-20T10:00:00Z"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Company not found"
}
```

---

### Create Company
**POST** `/company`

Create a new company.

**Request Body:**
```json
{
  "name": "string",
  "contactEmail": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "id": 4,
  "name": "New Company",
  "contactEmail": "contact@newcompany.com",
  "createdAt": "2026-01-20T12:00:00Z"
}
```

**Response (400 Bad Request):**
```json
{
  "message": "Company name already exists"
}
```

---

### Update Company
**PUT** `/company/{id}`

Update an existing company.

**Request Body:**
```json
{
  "name": "string",
  "contactEmail": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Updated Company Name",
  "contactEmail": "newemail@company.com",
  "createdAt": "2026-01-20T10:00:00Z"
}
```

---

### Delete Company
**DELETE** `/company/{id}`

Soft delete a company (sets IsActive = false).

**Response (200 OK):**
```json
{
  "message": "Company deleted successfully"
}
```

---

## Flyer Endpoints

### Get All Flyers
**GET** `/flyer`

Retrieve flyers with optional filtering.

**Query Parameters:**
- `companyId` (number, optional): Filter by company
- `year` (number, optional): Filter by year
- `month` (number, optional): Filter by month (1-12)

**Example:**
```
GET /flyer?companyId=1&year=2026&month=1
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Republic Day",
    "imagePath": "/uploads/abc-123.png",
    "companyId": 1,
    "companyName": "Company A",
    "forDate": "2026-01-26",
    "createdAt": "2026-01-20T10:00:00Z"
  }
]
```

---

### Get Flyers by Company
**GET** `/flyer/company/{companyId}`

Retrieve flyers for a specific company.

**Query Parameters:**
- `year` (number, optional): Filter by year
- `month` (number, optional): Filter by month (1-12)

**Example:**
```
GET /flyer/company/1?year=2026&month=1
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Republic Day",
    "imagePath": "/uploads/abc-123.png",
    "companyId": 1,
    "forDate": "2026-01-26",
    "createdAt": "2026-01-20T10:00:00Z"
  }
]
```

---

### Upload Flyer
**POST** `/flyer/upload`

Upload a new flyer.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `title` (string, required): Flyer title
- `forDate` (date, required): Date the flyer is for (YYYY-MM-DD)
- `companyId` (number, required): Company ID
- `file` (file, required): Image file (PNG, JPG, JPEG)

**Response (200 OK):**
```json
{
  "message": "Flyer uploaded successfully",
  "flyer": {
    "id": 5,
    "title": "Valentine's Day",
    "forDate": "2026-02-14",
    "imagePath": "/uploads/guid-here.png",
    "companyId": 1,
    "createdAt": "2026-01-20T15:00:00Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "message": "Only PNG and JPG files are allowed"
}
```

---

### Update Flyer
**PUT** `/flyer/{id}`

Update an existing flyer.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `title` (string, required): Updated title
- `forDate` (date, required): Updated for date (YYYY-MM-DD)
- `file` (file, optional): New image file (PNG, JPG, JPEG)

**Response (200 OK):**
```json
{
  "message": "Flyer updated successfully",
  "flyer": {
    "id": 5,
    "title": "Updated Title",
    "forDate": "2026-02-14",
    "imagePath": "/uploads/new-guid.png",
    "companyId": 1,
    "createdAt": "2026-01-20T15:00:00Z"
  }
}
```

---

### Delete Flyer
**DELETE** `/flyer/{id}`

Soft delete a flyer (sets IsDeleted = true).

**Response (200 OK):**
```json
{
  "message": "Flyer deleted successfully"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Flyer not found"
}
```

---

### Download Flyer
**GET** `/flyer/download/{id}`

Download a flyer image file.

**Response (200 OK):**
Returns the image file with appropriate content-type and disposition headers.

**Response (404 Not Found):**
```json
{
  "message": "Flyer not found"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid credentials |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Predefined Flyer Titles

The following titles are available in the dropdown:
- New Year Celebration
- Republic Day
- Holi Festival
- Good Friday
- Easter
- Independence Day
- Janmashtami
- Ganesh Chaturthi
- Dussehra
- Diwali
- Christmas
- New Year's Eve
- Valentine's Day
- Women's Day
- Mother's Day
- Father's Day
- Raksha Bandhan
- Eid
- Makar Sankranti
- Pongal
- Custom (allows free text input)

---

## File Upload Specifications

- **Allowed Extensions**: .png, .jpg, .jpeg
- **Max File Size**: Unlimited (configure IIS/Kestrel limits as needed)
- **Storage Location**: `backend/wwwroot/uploads/`
- **File Naming**: GUID-based unique names
- **Validation**: MIME type checking on server

---

## Date Handling

- **ForDate**: The date the flyer is intended for (determines which month it appears in)
- **CreatedAt**: Automatically set to current UTC time on upload (hidden from UI)
- **Filtering**: Uses ForDate.Year and ForDate.Month for month-based filtering

---

## Soft Delete Behavior

- **Users**: IsActive flag (false = deleted)
- **Companies**: IsActive flag (false = deleted)
- **Flyers**: IsDeleted flag (true = deleted)
- **Query Filters**: Automatically applied via EF Core global query filters

---

## CORS Configuration

The API allows all origins in development. For production, update CORS policy in `Program.cs`:

```csharp
policy.WithOrigins("https://yourdomain.com")
      .AllowAnyMethod()
      .AllowAnyHeader();
```

---

## Rate Limiting

Currently not implemented. Consider adding for production:
- Login attempts: 5 per minute per IP
- File uploads: 10 per hour per user
- API requests: 100 per minute per user
