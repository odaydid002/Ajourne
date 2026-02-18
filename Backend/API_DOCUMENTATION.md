# Ajourne Calculator API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Overview
RESTful API for managing calculators, publishers, ratings, and usage tracking.

---

## Endpoints

### 1. DEVICES

#### Create Device
```
POST /devices
Headers: Content-Type: application/json
Body: {
  "name": "Device Name (optional)",
  "age": 25,
  "speciality": "Computer Science",
  "level": "3rd Year",
  "university": "University Name"
}
Response: { success: true, message: "Device created successfully", data: { id, name, age, speciality, level, university, created_at } }
```

#### Get Device
```
GET /devices/:id
Response: { success: true, data: { id, name, age, speciality, level, university, created_at } }
```

#### Get or Create Device
```
POST /devices/or-create
Body: { "device_id": "uuid" }
Response: { success: true, data: { id, name, age, speciality, level, university, created_at } }
```

---

### 2. PUBLISHERS

#### Register Publisher
```
POST /publishers
Body: {
  "name": "Publisher Name",
  "email": "publisher@example.com",
  "device_id": "uuid (optional)",
  "device_name": "Device Name (optional)",
  "device_age": 25,
  "device_speciality": "Computer Science",
  "device_level": "3rd Year",
  "device_university": "University Name"
}
Response: { 
  success: true, 
  message: "Publisher registered successfully", 
  data: { 
    id: "uuid", 
    device_id: "uuid or null", 
    name: "Publisher Name",
    email: "publisher@example.com",
    email_verified: false,
    created_at: "ISO timestamp",
    verified_at: null
  } 
}
Status: 201 Created
Errors:
  - 400: Validation errors (name/email required, email format invalid)
  - 409: Email already registered
```

#### Get All Publishers
```
GET /publishers?limit=10&offset=0
Response: { success: true, data: [...], pagination: {...} }
```

#### Get Publisher by ID
```
GET /publishers/:id
Response: { success: true, data: { id, name, email, email_verified, device_id, created_at, verified_at } }
```

#### Update Publisher
```
PUT /publishers/:id
Body: { "name": "New Name" }
Response: { success: true, message:,
  "speciality": "Computer Science (optional)",
  "level": "3rd Year (optional)",
  "university_name": "University Name (optional)"
}
Response: { 
  success: true, 
  message: "Calculator created successfully", 
  data: { 
    id: "uuid",
    title: "...",
    description: "...",
    type: "simple|advanced",
    device_id: "uuid",
    publisher_id: "uuid or null",
    published: true|false,
    speciality: "...",
    level: "...",
    university_name: "...",
    ratings_count: 0,
    ratings_avg: 0,
    usage_count: 0,
    created_at: "ISO timestamp",
    updated_at: "ISO timestamp"
  }
}
Status: 201 Created
```

#### Get All Published Calculators
```
GET /calculators?limit=20&offset=0
Response: { success: true, data: [...], pagination: { limit, offset } }
```

#### Get Calculator by ID
```
GET /calculators/:id
Response: { success: true, data: { id, title, description, type, published, speciality, level, university_name, ratings_count, ratings_avg, usage_count, created_at, updated_at } }
Status: 404 if not found
```

#### Update Calculator
```
PUT /calculators/:id
Body: {
  "title": "New Title (optional)",
  "description": "New description (optional)",
  "type": "simple" | "advanced",
  "speciality": "New Speciality (optional)",
  "level": "New Level (optional)",
  "university_name": "New University (optional)"
}
Response: { success: true, message: "Calculator updated successfully", data: {...} }
```

#### Delete Calculator (Soft Delete)
```
DELETE /calculators/:id
Response: { success: true, message: "Calculator deleted successfully" }
```

#### Publish Calculator
```
POST /calculators/:id/publish
Body: { "publisher_id": "uuid" }
Response: { success: true, message: "Calculator published successfully", data: {...} }
Status: 
  - 200 OK on success
  - 403 Forbidden if publisher email not verified
  - 404 Not Found if calculator or publisher not found
```

#### Search Calculators
```
GET /calculators/search?q=query&limit=20&offset=0
Body: Query parameter "q" is required
Response: { success: true, data: [...], pagination: { limit, offset } }
```

#### Get Calculators by Publisher
```
GET /publishers/:publisherId/calculators?limit=20&offset=0
Response: { success: true, data: [...], pagination: { limit, offset } }
```

#### Get Calculators by Device
```
GET /devices/:deviceId/calculators?limit=20&offset=0
Response: { success: true, data: [...], pagination: { limit, offset } }
```

#### Create Calculator with Full Structure (All-in-One)
```
POST /publishers/:publisherId/calculators/all-in-one
Body: {
  "title": "Calculator Title",
  "description": "Optional description",
  "type": "simple" | "advanced",
  "device_id": "uuid (optional)",
  "speciality": "Computer Science (optional)",
  "level": "3rd Year (optional)",
  "university_name": "University Name (optional)",
  "structure": [
    // For simple calculators - array of modules
    {
      "id": "uuid (optional)",
      "semester": "s1" | "s2",
      "name": "Module Name",
      "coeff": 3,
      "hasTd": true,
      "hasTp": false,
      "credit": 3
    }
  ]
  // OR for advanced calculators
  "structure": [
    {
      "id": "uuid (optional)",
      "semester": "s1" | "s2",
      "title": "Unit Title",
      "modules": [
        {
          "id": "uuid (optional)",
          "name": "Module Name",
          "coeff": 2,
          "hasTd": true,
          "hasTp": true,
          "credit": 3,
          "weight_exam": 60,
          "weight_td": 20,
          "weight_tp": 20
        }
      ]
    }
  ]
}
Response: { 
  success: true, 
  data: { 
    calculator: { id, title, type, published: true, ...all_calculator_fields }
  }
}
Status: 201 Created
Notes: 
  - Creates calculator (required)",
  "unit_id": "uuid (optional, for advanced calculators only)",
  "name": "Module Name (required)",
  "coeff": 1 (required, default 1, min 0),
  "has_td": false (optional, default false),
  "has_tp": false (optional, default false),
  "credit": 3 (optional),
  "weight_exam": 60 (optional, for advanced calculators - percentage),
  "weight_td": 20 (optional, for advanced calculators - percentage),
  "weight_tp": 20 (optional, for advanced calculators - percentage)
}
Response: { 
  success: true, 
  message: "Module created successfully", 
  data: { 
    id: "uuid",
    semester_id: "uuid",
    unit_id: "uuid or null",
    name: "Module Name",
    coeff: 1,
    has_td: false,
    has_tp: false,
    credit: 3,
    weight_exam: 60,
    weight_td: 20,
    weight_tp: 20,
    created_at: "ISO timestamp",
    updated_at: "ISO timestamp"
  }
}
Status: 201 Created
Notes:
  - weight_* fields only meaningful for advanced calculators
  - coeff >= 0
Response: { success: true, data: [...], pagination: {...} }
```

#### Get Calculators by Publisher
```
GET /publishers/:publisherId/calculators?limit=20&offset=0
Response: { success: true, data: [...], pagination: {...} }
```

#### Get Calculators by Device
```
GET /devices/:deviceId/calculators?limit=20&offset=0
Response: { success: true, data: [...], pagination: {...} }
```

---

### 4. SEMESTERS

#### Create Semester
```
POST /semesters
Body: {
  "calculator_id":  (optional)",
  "coeff": 2,
  "has_td": true,
  "has_tp": false,
  "credit": 4,
  "weight_exam": 50,
  "weight_td": 25,
  "weight_tp": 25
}
Response: { success: true, message: "Module updated successfully", data: { ...updated_module_fields 
```

#### Get Semesters by Calculator
```
GET /calculators/:calculatorId/semesters
Response: { success: true, data: [...] }
```

#### Update Semester
```
PUT /semesters/:id
Body: { "name": "s1" | "s2" }
Response: { success: true, message: "Semester updated successfully", data: {...} }
```

#### Delete Semester (Soft Delete)
```
DELETE /semesters/:id
Response: { success: true, message: "Semester deleted successfully" }
```

---

### 5. UNITS (for Advanced Calculators)

#### Create Unit
```
POST /units
Body: {
  "semester_id": "uuid",
  "title": "Unit Title"
}
Response: { success: true, message: "Unit created successfully", data: {...} }
```

#### Get Unit by ID
```
GET /units/:id
Response: { success: true, data: {...} }
```

#### Get Units by Semester
```
GET /semesters/:semesterId/units
Response: { success: true, data: [...] }
```

#### Update Unit
```
PUT /units/:id
Body: { "title": "New Title" }
Response: { success: true, message: "Unit updated successfully", data: {...} }
```

#### Delete Unit (Soft Delete)
```
DELETE /units/:id
Response: { success: true, message: "Unit deleted successfully" }
```

---

### 6. MODULES

#### Create Module
```
POST /modules
Body: {
  "semester_id": "uuid",
  "unit_id": "uuid (optional for advanced)",
  "name": "Module Name",
  "coeff": 1,
  "has_td": false,
  "has_tp": false,
  "credit": 3 (optional),
  "weight_exam": 60 (optional, advanced only),
  "weight_td": 20 (optional, advanced only),
  "weight_tp": 20 (optional, advanced only)
}
Response: { success: true, message: "Module created successfully", data: {...} }
```

#### Get Module by ID
```
GET /modules/:id
Response: { success: true, data: {...} }
```

#### Get Modules by Semester
```
GET /semesters/:semesterId/modules
Response: { success: true, data: [...] }
```

#### Get Modules by Unit
```
GET /units/:unitId/modules
Response: { success: true, data: [...] }
```

#### Update Module
```
PUT /modules/:id
Body: {
  "name": "New Name",
  "coeff": 2,
  "has_td": true,
  "has_tp": false,
  "credit": 4,
  "weight_exam": 50,
  "weight_td": 25,
  "weight_tp": 25
}
Response: { success: true, message: "Module updated successfully", data: {...} }
```

#### Delete Module (Soft Delete)
```
DELETE /modules/:id
Response: { success: true, message: "Module deleted successfully" }
```

---

### 7. RATINGS

#### Rate Calculator
```
POST /ratings
Body: {
  "calculator_id": "uuid",
  "device_id": "uuid",
  "rating": 1-5
}
Response: { success: true, message: "Rating recorded successfully", data: {...} }
```

#### Get Rating by ID
```
GET /ratings/:id
Response: { success: true, data: {...} }
```

#### Get Ratings by Calculator
```
GET /calculators/:calculatorId/ratings?limit=50&offset=0
Response: { success: true, data: [...], stats: { count, average }, pagination: {...} }
```

#### Get Rating Statistics
```
GET /calculators/:calculatorId/ratings/stats
Response: { success: true, data: { count, average } }
```

#### Delete Rating by ID
```
DELETE /ratings/:id
Response: { success: true, message: "Rating deleted successfully" }
```

#### Delete Rating by Device
```
DELETE /calculators/:calculatorId/device/:deviceId/ratings
Response: { success: true, message: "Rating deleted successfully" }
```

---

### 8. USAGE

#### Track Usage
```
POST /usage
Body: {
  "calculator_id": "uuid",
  "device_id": "uuid"
}
Response: { success: true, message: "Usage tracked successfully", data: {...} }
```

#### Get Usage by Calculator
```
### Tables

**Devices**
- Anonymous users/clients
- Fields: id (UUID, PK), name, age, speciality, level, university, created_at
- Used for anonymous tracking and publisher registration

**Publishers**
- Verified device users who can publish calculators
- Fields: id (UUID, PK), device_id (FK), name, email (UNIQUE), email_verified, created_at, verified_at
- Email must be verified before publishing

**Calculators**
- Private (device_id only) or published (publisher_id + published=true)
- Fields: id (UUID, PK), publisher_id (FK, nullable), device_id (FK), type ENUM(simple|advanced), title, description, published, speciality, level, university_name, ratings_count, ratings_avg, usage_count, created_at, updated_at, deleted_at (soft delete)
- Rating averages cached in ratings_avg field
- Usage count tracked in usage_count field

**Semesters**
- S1 or S2, belongs to a calculator
- Fields: id (UUID, PK), calculator_id (FK), name CHECK(name IN ('s1','s2')), created_at, updated_at, deleted_at
- Unique constraint: (calculator_id, name)

**Units**
- Part of semesters (advanced calculators only)
- Fields: id (UUID, PK), semester_id (FK), title, created_at, updated_at, deleted_at
- Used to organize modules within semesters

**Modules**
- Courses/subjects with weights and coefficients
- Fields: id (UUID, PK), semester_id (FK), unit_id (FK, nullable), name, coeff (INTEGER >= 0), has_td, has_tp, credit, weight_exam, weight_td, weight_tp, created_at, updated_at, deleted_at
- Weights are optional and primary use for advanced calculators
- Coefficient used for weighted average calculations

**Calculator_Ratings**
- User ratings (1-5 stars)
- Fields: id (UUID, PK), calculator_id (FK), device_id (FK), rating (INT 1-5), created_at, updated_at
- Unique constraint: (calculator_id, device_id) - one rating per device per calculator

**Calculator_Usage**
- Tr1. Register a Publisher
```bash
curl -X POST http://localhost:3000/api/v1/publishers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed El-Mansouri",
    "email": "ahmed.mansouri@gmail.com",
    "device_name": "iPhone 14",
    "device_age": 25,
    "device_speciality": "Computer Science",
    "device_level": "3rd Year",
    "device_university": "Algiers University"
  }'
```
Response: 201 Created with publisher object (email_verified: false initially)

### 2. Verify Publisher Email (Admin Action)
```bash
curl -X POST http://localhost:3000/api/v1/publishers/{publisher-id}/verify-email \
  -H "Content-Type: application/json"
```
Response: 200 OK with updated publisher (email_verified: true)

### 3. Create & Publish Calculator (All-in-One) - Simple Type
```bash
curl -X POST http://localhost:3000/api/v1/publishers/{publisher-id}/calculators/all-in-one \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Algorithms & Data Structures",
    "description": "First year computer science",
    "type": "simple",
    "speciality": "Computer Science",
    "level": "1st Year",
    "university_name": "Algiers University",
    "structure": [
      {
        "semester": "s1",
        "name": "Introduction to Algorithms",
        "coeff": 3,
        "hasTd": true,
        "hasTp": true,
        "credit": 4
      },
      {
        "semester": "s1",
        "name": "Data Structures",
        "coeff": 2,
        "hasTd": true,
        "hasTp": false,
        "credit": 3
      },
      {
        "semester": "s2",
        "name": "Advanced Algorithms",
        "coeff": 3,
        "hasTd": true,
        "hasTp": true,
        "credit": 4
      }
    ]
  }'
```
Response: 201 Created with complete calculator structure

### 4. Create & Publish Calculator (All-in-One) - Advanced Type
```bash
curl -X POST http://localhost:3000/api/v1/publishers/{publisher-id}/calculators/all-in-one \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Linear Algebra & Calculus",
    "type": "advanced",
    "speciality": "Mathematics",
    "level": "1st Year",
    "university_name": "Algiers University",
    "structure": [
      {
        "semester": "s1",
        "title": "Linear Algebra Unit",
        "modules": [
          {
            "name": "Matrices & Systems",
            "coeff": 2,
            "hasTd": true,
            "hasTp": false,
            "credit": 3,
            "weight_exam": 60,
            "weight_td": 40,
            "weight_tp": 0
          },
          {
            "name": "Vector Spaces",
            "coeff": 2,
            "hasTd": true,
            "hasTp": true,
            "credit": 3,
            "weight_exam": 50,
            "weight_td": 25,
            "weight_tp": 25
          }
        ]
      },
      {
        "semester": "s1",
        "title": "Calculus Unit",
        "modules": [
          {
            "name": "Differential Calculus",
            "coeff": 3,
            "hasTd": true,
            "hasTp": true,
            "credit": 4,
            "weight_exam": 60,
            "weight_td": 20,
            "weight_tp": 20
          }
        ]
      }
    ]
  }'
```
Response: 201 Created with units and modules

### 5. Search Published Calculators
```bash
curl "http://localhost:3000/api/v1/calculators/search?q=algorithms&limit=10&offset=0"
```
Response: 200 OK with matching calculators

### 6. Get Calculators by Publisher
```bash
curl "http://localhost:3000/api/v1/publishers/{publisher-id}/calculators?limit=20&offset=0"
```
Response: 200 OK with publisher's calculators

### 7. Rate a Calculator
```bash
curl -X POST http://localhost:3000/api/v1/ratings \
  -H "Content-Type: application/json" \
  -d '{
    "calculator_id": "calc-uuid",
    "device_id": "device-uuid",
    "rating": 5
  }'
```
Response: 201 Created (or updated if device already rated)

### 8. Track Calculator Usage
```bash
curl -X POST http://localhost:3000/api/v1/usage \
  -H "Content-Type: application/json" \
  -d '{
    "calculator_id": "calc-uuid",
    "device_id": "device-uuid"
  }'
```
Response: 201 Created or 200 OK if already tracked

### 9. Get Calculator Detail (with all nested data)
```bash
curl "http://localhost:3000/api/v1/calculators/{calc-id}"
```
Response: 200 OK with calculator including ratings_count, ratings_avg, usage_count

### 10. Create Private Calculator for Device
```bash
curl -X POST http://localhost:3000/api/v1/calculators \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Personal Study Calculator",
    "description": "For my studies",
    "type": "simple",
    "device_id": "device-uuid-here"
  }'
```
Response: 201 Created with published: falseCommon Status Codes

- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation errors
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate email/resource
- `500 Internal Server Error` - Server error

---

## Running the Server

```bash
# Development
npm run dev

# Production
npm start

# Test API
curl http://localhost:3000/health
```

---

## Real-World Examples

### Create a Private Calculator
```bash
curl -X POST http://localhost:3000/api/v1/calculators \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Personal Calculator",
    "description": "For my studies",
    "type": "simple",
    "device_id": "device-uuid-here",
    "publisher_id": null
  }'
```

### Publish a Private Calculator
```bash
curl -X POST http://localhost:3000/api/v1/calculators/calc-id/publish \
  -H "Content-Type: application/json" \
  -d '{
    "publisher_id": "publisher-uuid-here"
  }'
```

### Search Published Calculators
```bash
curl "http://localhost:3000/api/v1/calculators/search?q=mathematics&limit=10&offset=0"
```

### Rate a Calculator
```bash
curl -X POST http://localhost:3000/api/v1/ratings \
  -H "Content-Type: application/json" \
  -d '{
    "calculator_id": "calc-uuid",
    "device_id": "device-uuid",
    "rating": 5
  }'
```

### Track Calculator Usage
```bash
curl -X POST http://localhost:3000/api/v1/usage \
  -H "Content-Type: application/json" \
  -d '{
    "calculator_id": "calc-uuid",
    "device_id": "device-uuid"
  }'
```

---

## Database Schema Overview

- **Devices**: Anonymous users/clients
- **Publishers**: Verified device users (email verified)
- **Calculators**: Can be private (device_id only) or published (publisher_id + published=true)
- **Semesters**: S1 or S2, belongs to a calculator
- **Units**: Part of semesters (advanced calculators)
- **Modules**: Courses/subjects with weights, coefficients
- **Ratings**: User ratings (1-5 stars)
- **Usage**: Track which devices have used which calculators
