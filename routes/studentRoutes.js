const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {
    addStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    getStudentsByClass,
    getStudentsByClassAndSection,
    getStudentsByQuery,
    getStudentsByClassOrSection,
    getLastGeneratedAdmissionNumber,
    bulkAddStudents
} = require("../controllers/studentController");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

// CRUD operations for students
router.post('/addStudent', authMiddleware(["admin", "moderator"]), addStudent);
router.get('/getStudents', authMiddleware(["admin", "moderator"]), getStudents);
router.get('/getStudent/:id', getStudentById);
router.get('/getStudent/:id', authMiddleware(["admin", "moderator"]), getStudentById);
router.put('/updateStudent/:id', authMiddleware(["admin", "moderator"]), updateStudent);
router.delete('/deleteStudent/:id', authMiddleware(["admin", "moderator"]), deleteStudent);


// Assuming you're using Express.js
router.post('/bulkAddStudents', authMiddleware(["admin", "moderator"]), upload.single('file'), (req, res) => {
    const { classId, section } = req.body; // These are text fields submitted along with the file
    bulkAddStudents(req, res, classId, section);
});


// Additional routes for querying students
router.get('/byClass/:classId', authMiddleware(["admin", "moderator"]), getStudentsByClass);
router.get('/byClassAndSection/:classId/:section', authMiddleware(["admin", "moderator"]), getStudentsByClassAndSection);
router.get('/students/query', authMiddleware(["admin", "moderator"]), getStudentsByQuery);
router.get('/byClassOrSection/:classId/:section?', authMiddleware(["admin", "moderator"]), getStudentsByClassOrSection);
router.get('/getLastAdmissionNumber', authMiddleware(["admin", "moderator"]), getLastGeneratedAdmissionNumber);


module.exports = router;
