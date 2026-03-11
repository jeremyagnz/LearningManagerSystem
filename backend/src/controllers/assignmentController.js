const pool = require('../config/database');

const createAssignment = async (req, res) => {
  const { subject_id, title, description, due_date } = req.body;
  if (!subject_id || !title) return res.status(400).json({ message: 'subject_id and title are required' });

  const file_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const check = await pool.query('SELECT * FROM subjects WHERE id = $1 AND teacher_id = $2', [subject_id, req.user.id]);
    if (check.rows.length === 0) return res.status(403).json({ message: 'Forbidden' });

    const result = await pool.query(
      'INSERT INTO assignments (subject_id, title, description, file_url, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [subject_id, title, description, file_url, due_date || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAssignmentsBySubject = async (req, res) => {
  const { subjectId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM assignments WHERE subject_id = $1 ORDER BY due_date ASC NULLS LAST',
      [subjectId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAssignmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM assignments WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Assignment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date } = req.body;
  if (!title) return res.status(400).json({ message: 'title is required' });
  const file_url = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const check = await pool.query(
      `SELECT a.* FROM assignments a
       JOIN subjects s ON a.subject_id = s.id
       WHERE a.id = $1 AND s.teacher_id = $2`,
      [id, req.user.id]
    );
    if (check.rows.length === 0) return res.status(403).json({ message: 'Forbidden' });

    const result = await pool.query(
      `UPDATE assignments SET title = $1, description = $2, due_date = $3,
        file_url = COALESCE($4, file_url), updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [title, description, due_date || null, file_url ?? null, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query(
      `SELECT a.* FROM assignments a
       JOIN subjects s ON a.subject_id = s.id
       WHERE a.id = $1 AND s.teacher_id = $2`,
      [id, req.user.id]
    );
    if (check.rows.length === 0) return res.status(403).json({ message: 'Forbidden' });

    await pool.query('DELETE FROM assignments WHERE id = $1', [id]);
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentAssignments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.subject_id, a.title, a.description, a.file_url as assignment_file_url,
        a.due_date, a.created_at, s.title as subject_title,
        sub.id as submission_id, sub.file_url as submission_file_url,
        sub.grade, sub.submitted_at
       FROM assignments a
       JOIN subjects s ON a.subject_id = s.id
       JOIN enrollments e ON e.subject_id = s.id
       LEFT JOIN submissions sub ON sub.assignment_id = a.id AND sub.student_id = $1
       WHERE e.student_id = $1
       ORDER BY a.due_date ASC NULLS LAST`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAssignment, getAssignmentsBySubject, getAssignmentById,
  updateAssignment, deleteAssignment, getStudentAssignments
};
