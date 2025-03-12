const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
// Create a new router instance
const router = express.Router();


// Set up multer for file handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save to 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, `id-card-${Date.now()}.pdf`); // give a unique filename
    }
});

const upload = multer({ storage: storage });


// Handle file upload and PDF conversion
router.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file); // Corrected to log the actual file object from multer

    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    // Generate URL for the uploaded file
    const fileUrl = `https://backend.vissionclasses.in/uploads/${req.file.filename}`;

    // Send back the URL of the uploaded PDF
    res.json({ pdfUrl: fileUrl });
});


// Route to download the PDF file
router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = `./uploads/${filename}`;

    res.download(filePath, err => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file: " + err,
            });
        }

        // Delete the file after sending to client
        fs.unlink(filePath, err => {
            if (err) console.error("Error deleting file:", err);
        });
    });
});

module.exports = router;
