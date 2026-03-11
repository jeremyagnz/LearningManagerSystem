const express = require('express');
const router = express.Router();
const {
  createSubject, getSubjects, getAllSubjects, getSubjectById,
  updateSubject, deleteSubject, enrollStudent, unenrollStudent, getSubjectStudents
} = require('../controllers/subjectController');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getSubjects);
router.get('/all', getAllSubjects);
router.post('/', requireRole('teacher'), createSubject);
router.get('/:id', getSubjectById);
router.put('/:id', requireRole('teacher'), updateSubject);
router.delete('/:id', requireRole('teacher'), deleteSubject);
router.post('/:id/enroll', requireRole('student'), enrollStudent);
router.delete('/:id/enroll', requireRole('student'), unenrollStudent);
router.get('/:id/students', requireRole('teacher'), getSubjectStudents);

module.exports = router;
