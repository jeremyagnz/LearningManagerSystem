const express = require('express');
const router = express.Router();
const { createMaterial, getMaterialsBySubject, deleteMaterial } = require('../controllers/materialController');
const { authMiddleware, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authMiddleware);

router.post('/', requireRole('teacher'), upload.single('file'), createMaterial);
router.get('/subject/:subjectId', getMaterialsBySubject);
router.delete('/:id', requireRole('teacher'), deleteMaterial);

module.exports = router;
