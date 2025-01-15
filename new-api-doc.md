Certainly! Below is the documentation for the API endpoints you've created. This document provides details on each endpoint, including expected inputs and outputs.

---

## **API Documentation**

### **1. Subject API**

#### **POST `/api/subjects`** - **Create a New Subject**

- **Description**: This endpoint creates a new subject.
- **Request Body**:
  ```json
  {
    "name": "Mathematics"
  }
  ```
- **Response**:
  - **Success** (201):
    ```json
    {
      "_id": "605c72ef153207001f5b99e",
      "name": "Mathematics"
    }
    ```
  - **Failure** (400):
    ```json
    {
      "error": "Name is required"
    }
    ```

#### **GET `/api/subjects`** - **Get All Subjects**

- **Description**: Fetch all subjects.
- **Response**:
  - **Success** (200):
    ```json
    [
      {
        "_id": "605c72ef153207001f5b99e",
        "name": "Mathematics"
      },
      {
        "_id": "605c72ef153207001f5b99f",
        "name": "Science"
      }
    ]
    ```

#### **GET `/api/subjects/:id`** - **Get a Single Subject by ID**

- **Description**: Fetch a specific subject by ID.
- **Response**:
  - **Success** (200):
    ```json
    {
      "_id": "605c72ef153207001f5b99e",
      "name": "Mathematics"
    }
    ```
  - **Failure** (404):
    ```json
    {
      "error": "Subject not found"
    }
    ```

#### **PUT `/api/subjects/:id`** - **Update a Subject by ID**

- **Description**: Update an existing subject.
- **Request Body**:
  ```json
  {
    "name": "Advanced Mathematics"
  }
  ```
- **Response**:
  - **Success** (200):
    ```json
    {
      "_id": "605c72ef153207001f5b99e",
      "name": "Advanced Mathematics"
    }
    ```

#### **DELETE `/api/subjects/:id`** - **Delete a Subject by ID**

- **Description**: Delete a subject by ID.
- **Response**:
  - **Success** (200):
    ```json
    {
      "message": "Subject deleted successfully"
    }
    ```
  - **Failure** (404):
    ```json
    {
      "error": "Subject not found"
    }
    ```

---

### **2. Class API**

#### **POST `/api/classes`** - **Create a New Class**

- **Description**: This endpoint creates a new class.
- **Request Body**:
  ```json
  {
    "name": "10th Grade",
    "sections": ["A", "B"]
  }
  ```
- **Response**:
  - **Success** (201):
    ```json
    {
      "_id": "605c72ef153207001f5b99f",
      "name": "10th Grade",
      "sections": ["A", "B"]
    }
    ```

#### **GET `/api/classes`** - **Get All Classes**

- **Description**: Fetch all classes.
- **Response**:
  - **Success** (200):
    ```json
    [
      {
        "_id": "605c72ef153207001f5b99f",
        "name": "10th Grade",
        "sections": ["A", "B"]
      }
    ]
    ```

#### **GET `/api/classes/:id`** - **Get a Single Class by ID**

- **Description**: Fetch a specific class by ID.
- **Response**:
  - **Success** (200):
    ```json
    {
      "_id": "605c72ef153207001f5b99f",
      "name": "10th Grade",
      "sections": ["A", "B"]
    }
    ```

#### **PUT `/api/classes/:id`** - **Update a Class by ID**

- **Description**: Update an existing class.
- **Request Body**:
  ```json
  {
    "name": "10th Grade",
    "sections": ["A", "B", "C"]
  }
  ```
- **Response**:
  - **Success** (200):
    ```json
    {
      "_id": "605c72ef153207001f5b99f",
      "name": "10th Grade",
      "sections": ["A", "B", "C"]
    }
    ```

#### **DELETE `/api/classes/:id`** - **Delete a Class by ID**

- **Description**: Delete a class by ID.
- **Response**:
  - **Success** (200):
    ```json
    {
      "message": "Class deleted successfully"
    }
    ```

---

### **3. Subject-Class Mapping API**

#### **POST `/api/subject-class-mappings`** - **Create a Subject-Class Mapping**

- **Description**: This endpoint creates a mapping between subjects and classes.
- **Request Body**:
  ```json
  {
    "classId": "605c72ef153207001f5b99f",
    "subjects": ["605c72ef153207001f5b99e", "605c72ef153207001f5b99d"]
  }
  ```
- **Response**:
  - **Success** (201):
    ```json
    {
      "_id": "605d1e123a4c12345678abcdef",
      "class": "605c72ef153207001f5b99f",
      "subjects": ["605c72ef153207001f5b99e", "605c72ef153207001f5b99d"]
    }
    ```

#### **GET `/api/subject-class-mappings`** - **Get All Subject-Class Mappings**

- **Description**: Fetch all subject-class mappings.
- **Response**:
  - **Success** (200):
    ```json
    [
      {
        "_id": "605d1e123a4c12345678abcdef",
        "class": "605c72ef153207001f5b99f",
        "subjects": ["605c72ef153207001f5b99e", "605c72ef153207001f5b99d"]
      }
    ]
    ```

#### **GET `/api/subject-class-mappings/:id`** - **Get a Single Subject-Class Mapping by ID**

- **Description**: Fetch a specific subject-class mapping by ID.
- **Response**:
  - **Success** (200):
    ```json
    {
      "_id": "605d1e123a4c12345678abcdef",
      "class": "605c72ef153207001f5b99f",
      "subjects": ["605c72ef153207001f5b99e", "605c72ef153207001f5b99d"]
    }
    ```

#### **PUT `/api/subject-class-mappings/:id`** - **Update a Subject-Class Mapping by ID**

- **Description**: Update a subject-class mapping.
- **Request Body**:
  ```json
  {
    "classId": "605c72ef153207001f5b99f",
    "subjects": ["605c72ef153207001f5b99e", "605c72ef153207001f5b99d", "605c72ef153207001f5b99f"]
  }
  ```
- **Response**:
  - **Success** (200):
    ```json
    {
      "_id": "605d1e123a4c12345678abcdef",
      "class": "605c72ef153207001f5b99f",
      "subjects": ["605c72ef153207001f5b99e", "605c72ef153207001f5b99d", "605c72ef153207001f5b99f"]
    }
    ```

#### **DELETE `/api/subject-class-mappings/:id`** - **Delete a Subject-Class Mapping by ID**

- **Description**: Delete a subject-class mapping by ID.
- **Response**:
  - **Success** (200):
    ```json
    {
      "message": "Subject-Class Mapping deleted successfully"
    }
    ```

---

Here’s an updated API documentation for the new Exam Schedule system, reflecting the changes made to include the `date` field and other updated models. This document includes the endpoints, expected inputs, and responses.

---

## **API Documentation: Exam Schedule System**

### **1. Create a New Exam Schedule**
- **Endpoint**: `POST /api/exam-schedule`
- **Description**: Creates a new exam schedule entry.
  
#### **Request Body**:
```json
{
  "examNameId": "string",   // ObjectId of the Exam Name
  "subjectId": "string",    // ObjectId of the Subject
  "classId": "string",      // ObjectId of the Class
  "date": "YYYY-MM-DD",     // Date of the exam (e.g. "2024-12-01")
  "startTime": "ISO8601",   // Start time of the exam (e.g. "2024-12-01T10:00:00Z")
  "endTime": "ISO8601"      // End time of the exam (e.g. "2024-12-01T12:00:00Z")
}
```

#### **Response**:
- **Status**: `201 Created`
- **Body**:
```json
{
  "_id": "examScheduleId",
  "examName": { 
    "_id": "examNameId", 
    "name": "Exam Name"
  },
  "subject": { 
    "_id": "subjectId", 
    "name": "Subject Name"
  },
  "class": { 
    "_id": "classId", 
    "name": "Class Name",
    "sections": ["A", "B"]
  },
  "date": "2024-12-01",
  "startTime": "2024-12-01T10:00:00Z",
  "endTime": "2024-12-01T12:00:00Z",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

#### **Error Response**:
- **Status**: `400 Bad Request`
- **Body**:
```json
{
  "error": "Invalid exam name, subject, or class"
}
```

---

### **2. Get All Exam Schedules**
- **Endpoint**: `GET /api/exam-schedule`
- **Description**: Fetches all exam schedules.

#### **Response**:
- **Status**: `200 OK`
- **Body**:
```json
[
  {
    "_id": "examScheduleId",
    "examName": { "_id": "examNameId", "name": "Exam Name" },
    "subject": { "_id": "subjectId", "name": "Subject Name" },
    "class": { "_id": "classId", "name": "Class Name" },
    "date": "2024-12-01",
    "startTime": "2024-12-01T10:00:00Z",
    "endTime": "2024-12-01T12:00:00Z",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
]
```

---

### **3. Get Exam Schedule by ID**
- **Endpoint**: `GET /api/exam-schedule/:id`
- **Description**: Fetches a specific exam schedule by its ID.

#### **Response**:
- **Status**: `200 OK`
- **Body**:
```json
{
  "_id": "examScheduleId",
  "examName": { "_id": "examNameId", "name": "Exam Name" },
  "subject": { "_id": "subjectId", "name": "Subject Name" },
  "class": { "_id": "classId", "name": "Class Name" },
  "date": "2024-12-01",
  "startTime": "2024-12-01T10:00:00Z",
  "endTime": "2024-12-01T12:00:00Z",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

#### **Error Response**:
- **Status**: `404 Not Found`
- **Body**:
```json
{
  "error": "Exam schedule not found"
}
```

---

### **4. Update an Exam Schedule by ID**
- **Endpoint**: `PUT /api/exam-schedule/:id`
- **Description**: Updates an existing exam schedule.

#### **Request Body**:
```json
{
  "examNameId": "string",   // ObjectId of the Exam Name
  "subjectId": "string",    // ObjectId of the Subject
  "classId": "string",      // ObjectId of the Class
  "date": "YYYY-MM-DD",     // Date of the exam (e.g. "2024-12-01")
  "startTime": "ISO8601",   // Start time of the exam (e.g. "2024-12-01T10:00:00Z")
  "endTime": "ISO8601"      // End time of the exam (e.g. "2024-12-01T12:00:00Z")
}
```

#### **Response**:
- **Status**: `200 OK`
- **Body**:
```json
{
  "_id": "examScheduleId",
  "examName": { "_id": "examNameId", "name": "Exam Name" },
  "subject": { "_id": "subjectId", "name": "Subject Name" },
  "class": { "_id": "classId", "name": "Class Name" },
  "date": "2024-12-01",
  "startTime": "2024-12-01T10:00:00Z",
  "endTime": "2024-12-01T12:00:00Z",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

#### **Error Response**:
- **Status**: `400 Bad Request`
- **Body**:
```json
{
  "error": "Invalid exam name, subject, or class"
}
```

---

### **5. Delete an Exam Schedule by ID**
- **Endpoint**: `DELETE /api/exam-schedule/:id`
- **Description**: Deletes an exam schedule by its ID.

#### **Response**:
- **Status**: `200 OK`
- **Body**:
```json
{
  "message": "Exam schedule deleted successfully"
}
```

#### **Error Response**:
- **Status**: `404 Not Found`
- **Body**:
```json
{
  "error": "Exam schedule not found"
}
```

---

### **6. Get Exam Schedules by Class and Exam Name**
- **Endpoint**: `GET /api/exam-schedule/by-class-and-exam`
- **Description**: Fetches exam schedules based on `classId` and `examNameId`.

#### **Query Parameters**:
- `classId`: The `ObjectId` of the class (e.g., `605c72ef1532071c4e99c507`)
- `examNameId`: The `ObjectId` of the exam name (e.g., `605c72ef1532071c4e99c509`)

#### **Response**:
- **Status**: `200 OK`
- **Body**:
```json
[
  {
    "_id": "examScheduleId",
    "examName": { "_id": "examNameId", "name": "Exam Name" },
    "subject": { "_id": "subjectId", "name": "Subject Name" },
    "class": { "_id": "classId", "name": "Class Name" },
    "date": "2024-12-01",
    "startTime": "2024-12-01T10:00:00Z",
    "endTime": "2024-12-01T12:00:00Z",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
]
```

#### **Error Response**:
- **Status**: `404 Not Found`
- **Body**:
```json
{
  "message": "No exam schedules found for the specified class and exam name"
}
```

#### **Error Response (Invalid Parameters)**:
- **Status**: `400 Bad Request`
- **Body**:
```json
{
  "error": "Invalid class ID"
}
```

---

### **Notes**:
- **Date**: The date should be in the `YYYY-MM-DD` format.
- **Start/End Time**: The times should be in the **ISO8601** format (`YYYY-MM-DDTHH:mm:ssZ`).
- **Populate**: All `GET` responses with an exam schedule will populate the `examName`, `subject`, and `class` fields to return human-readable information instead of just IDs.

---

This document covers the key API endpoints, expected request bodies, and response formats for your **exam schedule management system**. Let me know if you need further adjustments or additions!