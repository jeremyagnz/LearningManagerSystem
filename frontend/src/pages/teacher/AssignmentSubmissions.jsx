import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assignmentAPI, submissionAPI } from '../../services/api';
import { FiArrowLeft, FiStar, FiDownload } from 'react-icons/fi';

const GRADE_THRESHOLDS = { passing: 70, acceptable: 50 };

const AssignmentSubmissions = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(null);
  const [gradeForm, setGradeForm] = useState({ grade: '', feedback: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [assignmentRes, submissionsRes] = await Promise.all([
        assignmentAPI.getById(assignmentId),
        submissionAPI.getByAssignment(assignmentId),
      ]);
      setAssignment(assignmentRes.data);
      setSubmissions(submissionsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [assignmentId]);

  const openGrade = (submission) => {
    setGrading(submission);
    setGradeForm({ grade: submission.grade || '', feedback: submission.feedback || '' });
  };

  const handleGrade = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await submissionAPI.grade(grading.id, gradeForm);
      setGrading(null);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
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
      <Link to="/teacher/assignments" className="flex items-center text-indigo-600 hover:underline mb-4 text-sm">
        <FiArrowLeft className="h-4 w-4 mr-1" /> Back to Assignments
      </Link>

      {assignment && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h1 className="text-xl font-bold text-gray-900">{assignment.title}</h1>
          {assignment.description && <p className="text-gray-500 mt-1">{assignment.description}</p>}
          {assignment.due_date && (
            <p className="text-sm text-gray-400 mt-2">Due: {new Date(assignment.due_date).toLocaleString()}</p>
          )}
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Submissions ({submissions.length})</h2>

      {grading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-1">Grade Submission</h3>
            <p className="text-sm text-gray-500 mb-4">{grading.student_name}</p>
            <form onSubmit={handleGrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade (0-100) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={gradeForm.grade}
                  onChange={(e) => setGradeForm({ ...gradeForm, grade: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                <textarea
                  rows={3}
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Write feedback for the student..."
                />
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setGrading(null)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {submissions.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No submissions yet</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Student</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Submitted</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">File</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Grade</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{s.student_name}</td>
                  <td className="px-6 py-4 text-gray-600">{s.student_email}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(s.submitted_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {s.file_url ? (
                      <a href={s.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-indigo-600 hover:underline">
                        <FiDownload className="h-4 w-4" />
                        <span>Download</span>
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {s.grade !== null ? (
                      <span className={`font-semibold ${s.grade >= GRADE_THRESHOLDS.passing ? 'text-green-600' : s.grade >= GRADE_THRESHOLDS.acceptable ? 'text-yellow-600' : 'text-red-600'}`}>
                        {s.grade}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not graded</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openGrade(s)}
                      className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      <FiStar className="h-4 w-4" />
                      <span>{s.grade !== null ? 'Edit Grade' : 'Grade'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmissions;
