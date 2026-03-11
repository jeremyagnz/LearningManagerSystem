const pool = require('../config/database');

const createSubject = async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const result = await pool.query(
      'INSERT INTO subjects (title, description, teacher_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSubjects = async (req, res) => {
  try {
    let result;
    if (req.user.role === 'teacher') {
      result = await pool.query(
        `SELECT s.*, u.name as teacher_name,
          (SELECT COUNT(*) FROM enrollments e WHERE e.subject_id = s.id) as student_count
         FROM subjects s
         JOIN users u ON s.teacher_id = u.id
         WHERE s.teacher_id = $1
         ORDER BY s.created_at DESC`,
        [req.user.id]
      );
    } else {
      result = await pool.query(
        `SELECT s.*, u.name as teacher_name
         FROM subjects s
         JOIN users u ON s.teacher_id = u.id
         JOIN enrollments e ON e.subject_id = s.id
         WHERE e.student_id = $1
         ORDER BY s.created_at DESC`,
        [req.user.id]
      );
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllSubjects = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.name as teacher_name,
        (SELECT COUNT(*) FROM enrollments e WHERE e.subject_id = s.id) as student_count
       FROM subjects s
       JOIN users u ON s.teacher_id = u.id
       ORDER BY s.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSubjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT s.*, u.name as teacher_name FROM subjects s
       JOIN users u ON s.teacher_id = u.id WHERE s.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Subject not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const check = await pool.query('SELECT * FROM subjects WHERE id = $1 AND teacher_id = $2', [id, req.user.id]);
    if (check.rows.length === 0) return res.status(403).json({ message: 'Forbidden' });

    const result = await pool.query(
      'UPDATE subjects SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query('SELECT * FROM subjects WHERE id = $1 AND teacher_id = $2', [id, req.user.id]);
    if (check.rows.length === 0) return res.status(403).json({ message: 'Forbidden' });

    await pool.query('DELETE FROM subjects WHERE id = $1', [id]);
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const enrollStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await pool.query('SELECT * FROM subjects WHERE id = $1', [id]);
    if (subject.rows.length === 0) return res.status(404).json({ message: 'Subject not found' });

    await pool.query(
      'INSERT INTO enrollments (student_id, subject_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, id]
    );
    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const unenrollStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM enrollments WHERE student_id = $1 AND subject_id = $2', [req.user.id, id]);
    res.json({ message: 'Unenrolled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSubjectStudents = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query('SELECT * FROM subjects WHERE id = $1 AND teacher_id = $2', [id, req.user.id]);
    if (check.rows.length === 0) return res.status(403).json({ message: 'Forbidden' });

    const result = await pool.query(
      `SELECT u.id, u.name, u.email, e.enrolled_at FROM users u
       JOIN enrollments e ON e.student_id = u.id
       WHERE e.subject_id = $1 ORDER BY u.name`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createSubject, getSubjects, getAllSubjects, getSubjectById,
  updateSubject, deleteSubject, enrollStudent, unenrollStudent, getSubjectStudents
};
