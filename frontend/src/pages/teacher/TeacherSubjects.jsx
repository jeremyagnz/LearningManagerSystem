import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subjectAPI } from '../../services/api';
import { FiBook, FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';

const TeacherSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editSubject, setEditSubject] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchSubjects = async () => {
    try {
      const res = await subjectAPI.getMySubjects();
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const openCreate = () => {
    setEditSubject(null);
    setForm({ title: '', description: '' });
    setShowForm(true);
    setError('');
  };

  const openEdit = (subject) => {
    setEditSubject(subject);
    setForm({ title: subject.title, description: subject.description || '' });
    setShowForm(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editSubject) {
        await subjectAPI.update(editSubject.id, form);
      } else {
        await subjectAPI.create(form);
      }
      setShowForm(false);
      await fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject? All assignments and materials will be deleted.')) return;
    try {
      await subjectAPI.delete(id);
      await fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Subjects</h1>
        <button
          onClick={openCreate}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FiPlus className="h-4 w-4" />
          <span>New Subject</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4">{editSubject ? 'Edit Subject' : 'Create Subject'}</h2>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Subject title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="Subject description"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editSubject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {subjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <FiBook className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No subjects created yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((s) => (
            <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <FiBook className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => openEdit(s)} className="text-gray-400 hover:text-indigo-600 p-1">
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="text-gray-400 hover:text-red-600 p-1">
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-1">{s.title}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{s.description || 'No description'}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-gray-500 space-x-1">
                  <FiUsers className="h-4 w-4" />
                  <span>{s.student_count} students</span>
                </span>
                <Link
                  to={`/teacher/subjects/${s.id}`}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  Manage →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherSubjects;
