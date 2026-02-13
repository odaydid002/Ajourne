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
Headers: None required
Body: {}
Response: { success: true, message: "Device created successfully", data: { id, created_at, updated_at } }
```

#### Get Device
```
GET /devices/:id
Response: { success: true, data: { id, created_at, updated_at } }
```

#### Get or Create Device
```
POST /devices/or-create
Body: { "device_id": "uuid" }
Response: { success: true, data: { id, created_at, updated_at } }
```

---

### 2. PUBLISHERS

#### Register Publisher
```
POST /publishers
Body: {
  "name": "Publisher Name",
  "email": "publisher@example.com",
  "device_id": "uuid"
}
Response: { success: true, message: "Publisher registered successfully", data: { ... } }
```

#### Get All Publishers
```
GET /publishers?limit=10&offset=0
Response: { success: true, data: [...], pagination: {...} }
```

#### Get Publisher by ID
```
GET /publishers/:id
Response: { success: true, data: { ...publisher, published_calculators_count: 5 } }
```

#### Update Publisher
```
PUT /publishers/:id
Body: { "name": "New Name" }
Response: { success: true, message: "Publisher updated successfully", data: {...} }
```

#### Verify Publisher Email
```
POST /publishers/:id/verify-email
Response: { success: true, message: "Email verified successfully", data: {...} }
```

---

### 3. CALCULATORS

#### Create Calculator
```
POST /calculators
Body: {
  "title": "Calculator Title",
  "description": "Optional description",
  "type": "simple" | "advanced",
  "device_id": "uuid",
  "publisher_id": "uuid (optional)"
}
Response: { success: true, message: "Calculator created successfully", data: {...} }
```

#### Get All Published Calculators
```
GET /calculators?limit=20&offset=0&search=query
Response: { success: true, data: [...], pagination: {...} }
```

#### Get Calculator by ID
```
GET /calculators/:id
Response: { success: true, data: {...} }
```

#### Update Calculator
```
PUT /calculators/:id
Body: {
  "title": "New Title",
  "description": "New description",
  "type": "simple" | "advanced"
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
```

#### Search Calculators
```
GET /calculators/search?q=query&limit=20&offset=0
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
  "calculator_id": "uuid",
  "name": "s1" | "s2"
}
Response: { success: true, message: "Semester created successfully", data: {...} }
```

#### Get Semester by ID
```
GET /semesters/:id
Response: { success: true, data: {...} }
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
GET /calculators/:calculatorId/usage?limit=50&offset=0
Response: { success: true, data: [...], stats: { total_users }, pagination: {...} }
```

#### Get Usage Statistics
```
GET /calculators/:calculatorId/usage/stats
Response: { success: true, data: { total_users } }
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message"
}
```

For validation errors:
```json
{
  "success": false,
  "errors": {
    "field_name": "Error message for field"
  }
}
```

---

## Common Status Codes

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
