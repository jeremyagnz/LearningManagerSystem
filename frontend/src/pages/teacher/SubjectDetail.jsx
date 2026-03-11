import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { subjectAPI, assignmentAPI, materialAPI } from '../../services/api';
import { FiArrowLeft, FiPlus, FiTrash2, FiUsers, FiClipboard, FiBookOpen, FiLink, FiFile } from 'react-icons/fi';

const SubjectDetail = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [tab, setTab] = useState('assignments');
  const [loading, setLoading] = useState(true);

  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', due_date: '' });
  const [savingAssignment, setSavingAssignment] = useState(false);

  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [materialForm, setMaterialForm] = useState({ title: '', content_url: '', material_type: 'link' });
  const [materialFile, setMaterialFile] = useState(null);
  const [savingMaterial, setSavingMaterial] = useState(false);

  const fetchData = async () => {
    try {
      const [subjectRes, studentsRes, assignmentsRes, materialsRes] = await Promise.all([
        subjectAPI.getById(id),
        subjectAPI.getStudents(id),
        assignmentAPI.getBySubject(id),
        materialAPI.getBySubject(id),
      ]);
      setSubject(subjectRes.data);
      setStudents(studentsRes.data);
      setAssignments(assignmentsRes.data);
      setMaterials(materialsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setSavingAssignment(true);
    try {
      await assignmentAPI.create({ ...assignmentForm, subject_id: id });
      setShowAssignmentForm(false);
      setAssignmentForm({ title: '', description: '', due_date: '' });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingAssignment(false);
    }
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    setSavingMaterial(true);
    try {
      const formData = new FormData();
      formData.append('subject_id', id);
      formData.append('title', materialForm.title);
      formData.append('material_type', materialForm.material_type);
      if (materialFile) {
        formData.append('file', materialFile);
      } else {
        formData.append('content_url', materialForm.content_url);
      }
      await materialAPI.create(formData);
      setShowMaterialForm(false);
      setMaterialForm({ title: '', content_url: '', material_type: 'link' });
      setMaterialFile(null);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingMaterial(false);
    }
  };

  const handleDeleteAssignment = async (aId) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      await assignmentAPI.delete(aId);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMaterial = async (mId) => {
    if (!window.confirm('Delete this material?')) return;
    try {
      await materialAPI.delete(mId);
      await fetchData();
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

  if (!subject) return <div>Subject not found</div>;

  return (
    <div>
      <Link to="/teacher/subjects" className="flex items-center text-indigo-600 hover:underline mb-4 text-sm">
        <FiArrowLeft className="h-4 w-4 mr-1" /> Back to Subjects
      </Link>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold mb-1">{subject.title}</h1>
        <p className="text-indigo-100">{subject.description}</p>
        <div className="flex items-center space-x-4 mt-3 text-sm text-indigo-200">
          <span className="flex items-center space-x-1"><FiUsers className="h-4 w-4" /><span>{students.length} students</span></span>
          <span className="flex items-center space-x-1"><FiClipboard className="h-4 w-4" /><span>{assignments.length} assignments</span></span>
          <span className="flex items-center space-x-1"><FiBookOpen className="h-4 w-4" /><span>{materials.length} materials</span></span>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        {['assignments', 'materials', 'students'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              tab === t ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border hover:border-indigo-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'assignments' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Assignments</h2>
            <button
              onClick={() => setShowAssignmentForm(true)}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
            >
              <FiPlus className="h-4 w-4" /><span>Add Assignment</span>
            </button>
          </div>

          {showAssignmentForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-bold mb-4">New Assignment</h3>
                <form onSubmit={handleCreateAssignment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input type="text" required value={assignmentForm.title}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows={3} value={assignmentForm.description}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input type="datetime-local" value={assignmentForm.due_date}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, due_date: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="flex space-x-3">
                    <button type="button" onClick={() => setShowAssignmentForm(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={savingAssignment} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                      {savingAssignment ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {assignments.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No assignments yet</p>
          ) : (
            <div className="space-y-3">
              {assignments.map((a) => (
                <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{a.title}</p>
                    <p className="text-sm text-gray-500">{a.description}</p>
                    {a.due_date && <p className="text-xs text-gray-400 mt-1">Due: {new Date(a.due_date).toLocaleString()}</p>}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Link to={`/teacher/assignments/${a.id}/submissions`} className="text-indigo-600 text-sm hover:underline">
                      View Submissions
                    </Link>
                    <button onClick={() => handleDeleteAssignment(a.id)} className="text-gray-400 hover:text-red-600">
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'materials' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Materials</h2>
            <button
              onClick={() => setShowMaterialForm(true)}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
            >
              <FiPlus className="h-4 w-4" /><span>Add Material</span>
            </button>
          </div>

          {showMaterialForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-bold mb-4">New Material</h3>
                <form onSubmit={handleCreateMaterial} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input type="text" required value={materialForm.title}
                      onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={materialForm.material_type}
                      onChange={(e) => setMaterialForm({ ...materialForm, material_type: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="link">Link</option>
                      <option value="pdf">PDF</option>
                      <option value="video">Video</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {materialForm.material_type === 'link' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                      <input type="url" value={materialForm.content_url}
                        onChange={(e) => setMaterialForm({ ...materialForm, content_url: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="https://" />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                      <input type="file" onChange={(e) => setMaterialFile(e.target.files[0])}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <button type="button" onClick={() => setShowMaterialForm(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={savingMaterial} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                      {savingMaterial ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {materials.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No materials yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.map((m) => (
                <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      {m.material_type === 'link' ? <FiLink className="h-5 w-5 text-indigo-600" /> : <FiFile className="h-5 w-5 text-indigo-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{m.title}</p>
                      <span className="text-xs text-gray-400 capitalize">{m.material_type}</span>
                      {m.content_url && (
                        <a href={m.content_url} target="_blank" rel="noopener noreferrer" className="block text-xs text-indigo-600 hover:underline mt-0.5 truncate max-w-48">
                          {m.content_url}
                        </a>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteMaterial(m.id)} className="text-gray-400 hover:text-red-600">
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'students' && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Enrolled Students ({students.length})</h2>
          {students.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No students enrolled</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Enrolled At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                      <td className="px-6 py-4 text-gray-600">{s.email}</td>
                      <td className="px-6 py-4 text-gray-500">{new Date(s.enrolled_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectDetail;
