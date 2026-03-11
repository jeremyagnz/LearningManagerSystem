const express = require('express');
const router = express.Router();
const {
  createAssignment, getAssignmentsBySubject, getAssignmentById,
  updateAssignment, deleteAssignment, getStudentAssignments
} = require('../controllers/assignmentController');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/my', requireRole('student'), getStudentAssignments);
router.post('/', requireRole('teacher'), createAssignment);
router.get('/subject/:subjectId', getAssignmentsBySubject);
router.get('/:id', getAssignmentById);
router.put('/:id', requireRole('teacher'), updateAssignment);
router.delete('/:id', requireRole('teacher'), deleteAssignment);

module.exports = router;
