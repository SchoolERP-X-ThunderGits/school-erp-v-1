const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Set up multer for file handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save to 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, `pdf-${Date.now()}${path.extname(file.originalname)}`); // Use dynamic filename
    }
});

const upload = multer({ storage: storage });

// Create a new router instance
const router = express.Router();

// Handle file upload and PDF conversion
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    // Assume the uploaded file might not be a PDF and we convert it to PDF
    const inputFilePath = req.file.path;
    const outputFilePath = `uploads/output-${Date.now()}.pdf`;
    const output = fs.createWriteStream(outputFilePath);
    const doc = new PDFDocument();

    doc.pipe(output);
    doc.image(inputFilePath, 50, 50, {width: 150}); // Adjust position and size as needed
    doc.end();

    output.on('finish', () => {
        // Provide a link to download the PDF
        res.json({ link: `https://backend.vissionclasses.in/api/admrec/download/${outputFilePath.split('/')[1]}` });
    });

    // Clean up the uploaded file
    fs.unlink(inputFilePath, err => {
        if (err) console.error("Error deleting file:", err);
    });
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
