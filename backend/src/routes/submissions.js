const express = require('express');
const router = express.Router();
const {
  submitAssignment, getSubmissionsByAssignment, getStudentSubmissions, gradeSubmission
} = require('../controllers/submissionController');
const { authMiddleware, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authMiddleware);

router.get('/my', requireRole('student'), getStudentSubmissions);
router.post('/', requireRole('student'), upload.single('file'), submitAssignment);
router.get('/assignment/:assignmentId', requireRole('teacher'), getSubmissionsByAssignment);
router.put('/:id/grade', requireRole('teacher'), gradeSubmission);

module.exports = router;
