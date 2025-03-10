### API Documentation

#### Base URL
The base URL for all API requests is:
```
https://backend.vissionclasses.in/api/admrec
```

#### Endpoints

---

### 1. Upload and Convert File to PDF

**POST** `/upload`

This endpoint accepts a file upload, converts it to a PDF (if not already in PDF format), and returns a link to download the generated PDF.

**Request:**

Content-Type: `multipart/form-data`

**Body:**

- `file`: The file to be uploaded and converted to PDF.

**Response:**

- **Status Code:** 200 OK on success, 400 Bad Request if no file is provided.
- **Content-Type:** `application/json`
- **Body:**
  ```json
  {
    "link": "URL to download the generated PDF"
  }
  ```

**Example cURL Request:**
```bash
curl -X POST https://backend.vissionclasses.in/api/admrec/upload \
  -F "file=@path_to_your_file" \
  -H "Content-Type: multipart/form-data"
```

---

### 2. Download PDF

**GET** `/download/:filename`

Downloads the PDF file specified by the filename.

**Path Parameters:**

- `filename`: The name of the file to download.

**Response:**

- **Status Code:** 200 OK on successful download, 500 Internal Server Error if any error occurs.
- **Content:** PDF file streamed in response.

**Example cURL Request:**
```bash
curl -X GET https://backend.vissionclasses.in/api/admrec/download/pdf-1234567890.pdf \
  -o local_filename.pdf
```

---

### Error Handling

Errors are returned as standard HTTP response codes. Responses may include an error message in the body to assist in debugging.

- **400 Bad Request:** Input or request data is incorrect or incomplete.
- **500 Internal Server Error:** Server-side error, such as a failure during file processing or a file system operation.

### Security Considerations

- **Authentication:** (Specify if any authentication is required, e.g., API keys, OAuth tokens.)
- **Permissions:** Make sure the file paths and operations are secure to prevent unauthorized access or directory traversal attacks.

### Usage Notes

- Ensure that file sizes do not exceed the limits set by the server configuration.
- The uploaded files are automatically deleted after processing to maintain server cleanliness and efficiency.

