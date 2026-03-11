import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subjectAPI, assignmentAPI } from '../../services/api';
import { FiClipboard, FiCalendar, FiUsers, FiDownload } from 'react-icons/fi';

const TeacherAssignments = () => {
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    subjectAPI.getMySubjects()
      .then((res) => {
        setSubjects(res.data);
        if (res.data.length > 0) setSelected(res.data[0].id);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    assignmentAPI.getBySubject(selected)
      .then((res) => setAssignments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Assignments</h1>

      {subjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <FiClipboard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No subjects yet. Create a subject first.</p>
          <Link to="/teacher/subjects" className="mt-3 inline-block text-indigo-600 hover:underline">Go to Subjects</Link>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              {assignments.length} Assignment{assignments.length !== 1 ? 's' : ''}
            </h2>
            {selected && (
              <Link
                to={`/teacher/subjects/${selected}`}
                className="text-indigo-600 text-sm hover:underline"
              >
                Manage in Subject →
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : assignments.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No assignments for this subject</p>
          ) : (
            <div className="space-y-3">
              {assignments.map((a) => (
                <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{a.title}</p>
                    {a.description && <p className="text-sm text-gray-500 mt-0.5">{a.description}</p>}
                    {a.due_date && (
                      <span className="flex items-center text-xs text-gray-400 mt-1 space-x-1">
                        <FiCalendar className="h-3 w-3" />
                        <span>Due: {new Date(a.due_date).toLocaleString()}</span>
                      </span>
                    )}
                    {a.file_url && (
                      <a href={a.file_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-xs text-indigo-600 hover:underline mt-1">
                        <FiDownload className="h-3 w-3" /><span>Attachment</span>
                      </a>
                    )}
                  </div>
                  <Link
                    to={`/teacher/assignments/${a.id}/submissions`}
                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    <FiUsers className="h-4 w-4" />
                    <span>Submissions</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherAssignments;
