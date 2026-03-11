const pool = require('../config/database');

const createMaterial = async (req, res) => {
  const { subject_id, title, content_url, material_type } = req.body;
  if (!subject_id || !title) return res.status(400).json({ message: 'subject_id and title are required' });

  const fileUrl = req.file ? `/uploads/${req.file.filename}` : content_url || null;

  try {
    const check = await pool.query('SELECT * FROM subjects WHERE id = $1 AND teacher_id = $2', [subject_id, req.user.id]);
    if (check.rows.length === 0) return res.status(403).json({ message: 'Forbidden' });

    const result = await pool.query(
      'INSERT INTO materials (subject_id, title, content_url, material_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [subject_id, title, fileUrl, material_type || 'other']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMaterialsBySubject = async (req, res) => {
  const { subjectId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM materials WHERE subject_id = $1 ORDER BY created_at DESC',
      [subjectId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteMaterial = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query(
      `SELECT m.* FROM materials m
       JOIN subjects s ON m.subject_id = s.id
       WHERE m.id = $1 AND s.teacher_id = $2`,
      [id, req.user.id]
    );
    if (check.rows.length === 0) return res.status(403).json({ message: 'Forbidden' });

    await pool.query('DELETE FROM materials WHERE id = $1', [id]);
    res.json({ message: 'Material deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createMaterial, getMaterialsBySubject, deleteMaterial };
