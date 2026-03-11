const pool = require('../config/database');

const submitAssignment = async (req, res) => {
  const { assignment_id } = req.body;
  if (!assignment_id) return res.status(400).json({ message: 'assignment_id is required' });

  const file_url = req.file ? `/uploads/${req.file.filename}` : req.body.file_url || null;

  try {
    const check = await pool.query(
      `SELECT a.* FROM assignments a
       JOIN subjects s ON a.subject_id = s.id
       JOIN enrollments e ON e.subject_id = s.id
       WHERE a.id = $1 AND e.student_id = $2`,
      [assignment_id, req.user.id]
    );
    if (check.rows.length === 0) {
      return res.status(403).json({ message: 'Not enrolled in this subject' });
    }

    const result = await pool.query(
      `INSERT INTO submissions (assignment_id, student_id, file_url)
       VALUES ($1, $2, $3)
       ON CONFLICT (assignment_id, student_id)
       DO UPDATE SET file_url = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [assignment_id, req.user.id, file_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSubmissionsByAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const check = await pool.query(
      `SELECT a.* FROM assignments a
       JOIN subjects s ON a.subject_id = s.id
       WHERE a.id = $1 AND s.teacher_id = $2`,
      [assignmentId, req.user.id]
    );
    if (check.rows.length === 0) return res.status(403).json({ message: 'Forbidden' });

    const result = await pool.query(
      `SELECT sub.*, u.name as student_name, u.email as student_email
       FROM submissions sub
       JOIN users u ON sub.student_id = u.id
       WHERE sub.assignment_id = $1
       ORDER BY sub.submitted_at DESC`,
      [assignmentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentSubmissions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sub.*, a.title as assignment_title, s.title as subject_title
       FROM submissions sub
       JOIN assignments a ON sub.assignment_id = a.id
       JOIN subjects s ON a.subject_id = s.id
       WHERE sub.student_id = $1
       ORDER BY sub.submitted_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const gradeSubmission = async (req, res) => {
  const { id } = req.params;
  const { grade, feedback } = req.body;

  if (grade === undefined || grade === null) {
    return res.status(400).json({ message: 'Grade is required' });
  }

  try {
    const check = await pool.query(
      `SELECT sub.* FROM submissions sub
       JOIN assignments a ON sub.assignment_id = a.id
       JOIN subjects s ON a.subject_id = s.id
       WHERE sub.id = $1 AND s.teacher_id = $2`,
      [id, req.user.id]
    );
    if (check.rows.length === 0) return res.status(403).json({ message: 'Forbidden' });

    const result = await pool.query(
      'UPDATE submissions SET grade = $1, feedback = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [grade, feedback || null, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitAssignment, getSubmissionsByAssignment, getStudentSubmissions, gradeSubmission };
