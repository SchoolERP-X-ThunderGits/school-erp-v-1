const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const bodyParser = require('body-parser');


// Create a new router instance
const router = express.Router();


// Route to receive blob and return PDF
router.post('/blob-to-pdf', (req, res) => {
    const { blobBase64 } = req.body;

    if (!blobBase64) {
        return res.status(400).send('No blob data provided');
    }

    // Convert base64 to buffer
    const blobBuffer = Buffer.from(blobBase64, 'base64');

    // Create a PDF document
    const doc = new PDFDocument();
    const filePath = `./output-${Date.now()}.pdf`;
    const output = fs.createWriteStream(filePath);

    doc.pipe(output);
    doc.image(blobBuffer, 50, 50, {width: 150}); // Adjust position and size as needed
    doc.end();

    output.on('finish', () => {
        console.log('PDF generated successfully.');

        // Provide a link to download the PDF
        res.send({ link: `https://backend.vissionclasses.in/api/admrec/download/${filePath.split('/')[1]}` });
    });
});

// Route to download the PDF file
router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = `./${filename}`;

    res.download(filePath, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file: " + err,
            });
        }

        // Optionally delete the file after sending to client
        fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting file:", err);
        });
    });
});


module.exports = router