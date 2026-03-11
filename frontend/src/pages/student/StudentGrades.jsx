import { useState, useEffect } from 'react';
import { submissionAPI } from '../../services/api';
import { FiStar, FiMessageSquare } from 'react-icons/fi';

const GRADE_THRESHOLDS = { passing: 70, acceptable: 50 };

const StudentGrades = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    submissionAPI.getMySubmissions()
      .then((res) => setSubmissions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const graded = submissions.filter((s) => s.grade !== null);
  const avgGrade = graded.length > 0
    ? (graded.reduce((sum, s) => sum + parseFloat(s.grade), 0) / graded.length).toFixed(2)
    : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Grades</h1>

      {avgGrade && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 mb-6 flex items-center justify-between">
          <div>
            <p className="text-indigo-100">Average Grade</p>
            <p className="text-5xl font-bold mt-1">{avgGrade}</p>
          </div>
          <FiStar className="h-16 w-16 text-white/30" />
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <FiStar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No submissions yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Assignment</th>
                <th className="px-6 py-3 text-left font-semibold">Subject</th>
                <th className="px-6 py-3 text-left font-semibold">Submitted</th>
                <th className="px-6 py-3 text-left font-semibold">Grade</th>
                <th className="px-6 py-3 text-left font-semibold">Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{s.assignment_title}</td>
                  <td className="px-6 py-4 text-gray-600">{s.subject_title}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(s.submitted_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {s.grade !== null ? (
                      <span className={`font-semibold ${s.grade >= GRADE_THRESHOLDS.passing ? 'text-green-600' : s.grade >= GRADE_THRESHOLDS.acceptable ? 'text-yellow-600' : 'text-red-600'}`}>
                        {s.grade}
                      </span>
                    ) : (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                    {s.feedback ? (
                      <span className="flex items-center space-x-1">
                        <FiMessageSquare className="h-3 w-3 flex-shrink-0" />
                        <span>{s.feedback}</span>
                      </span>
                    ) : '-'}
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

export default StudentGrades;
