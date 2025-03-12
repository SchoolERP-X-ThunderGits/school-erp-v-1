const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Add this import
const app = express();

// Enable CORS for frontend at localhost:5173
app.use(cors({
    origin: 'http://localhost:5173', // Allow only your frontend to make requests
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Set up multer for file handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // save to 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, `id-card-${Date.now()}.pdf`); // give a unique filename
    }
});

const upload = multer({ storage: storage });

// Handle file upload
app.post('/upload-pdf', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    // Generate URL for the uploaded file
    const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    
    // Send back the URL of the uploaded PDF
    res.json({ pdfUrl: fileUrl });
});

// Serve the uploaded files via static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
