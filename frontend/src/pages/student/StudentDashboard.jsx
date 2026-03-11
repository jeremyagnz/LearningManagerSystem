import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { subjectAPI, assignmentAPI, submissionAPI } from '../../services/api';
import { FiBook, FiClipboard, FiCheckCircle, FiStar } from 'react-icons/fi';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ subjects: 0, pending: 0, submitted: 0, graded: 0 });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, assignmentsRes, submissionsRes] = await Promise.all([
          subjectAPI.getMySubjects(),
          assignmentAPI.getMyAssignments(),
          submissionAPI.getMySubmissions(),
        ]);

        const assignments = assignmentsRes.data;
        const submissions = submissionsRes.data;

        const submitted = submissions.length;
        const graded = submissions.filter((s) => s.grade !== null).length;
        const pending = assignments.filter((a) => !a.submission_id).length;

        setStats({
          subjects: subjectsRes.data.length,
          pending,
          submitted,
          graded,
        });

        setRecentAssignments(assignments.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-500 mt-1">Here's your learning overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FiBook className="h-6 w-6 text-indigo-600" />} label="Enrolled Subjects" value={stats.subjects} color="bg-indigo-50" />
        <StatCard icon={<FiClipboard className="h-6 w-6 text-yellow-600" />} label="Pending Assignments" value={stats.pending} color="bg-yellow-50" />
        <StatCard icon={<FiCheckCircle className="h-6 w-6 text-green-600" />} label="Submitted" value={stats.submitted} color="bg-green-50" />
        <StatCard icon={<FiStar className="h-6 w-6 text-purple-600" />} label="Graded" value={stats.graded} color="bg-purple-50" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Assignments</h2>
          <Link to="/student/assignments" className="text-indigo-600 text-sm hover:underline">View all</Link>
        </div>
        {recentAssignments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No assignments yet</p>
        ) : (
          <div className="space-y-3">
            {recentAssignments.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{a.title}</p>
                  <p className="text-sm text-gray-500">{a.subject_title}</p>
                </div>
                <div className="text-right">
                  {a.submission_id ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Submitted</span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Pending</span>
                  )}
                  {a.due_date && (
                    <p className="text-xs text-gray-400 mt-1">
                      Due: {new Date(a.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className={`${color} rounded-xl p-5 flex items-center space-x-4`}>
    <div className="p-3 bg-white rounded-lg shadow-sm">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  </div>
);

export default StudentDashboard;
