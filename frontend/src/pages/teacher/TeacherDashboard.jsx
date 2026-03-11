import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { subjectAPI, assignmentAPI } from '../../services/api';
import { FiBook, FiClipboard, FiUsers, FiCheckCircle } from 'react-icons/fi';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subjectAPI.getMySubjects()
      .then((res) => setSubjects(res.data))
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

  const totalStudents = subjects.reduce((sum, s) => sum + parseInt(s.student_count || 0), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FiBook className="h-6 w-6 text-indigo-600" />} label="My Subjects" value={subjects.length} color="bg-indigo-50" />
        <StatCard icon={<FiUsers className="h-6 w-6 text-green-600" />} label="Total Students" value={totalStudents} color="bg-green-50" />
        <StatCard icon={<FiCheckCircle className="h-6 w-6 text-purple-600" />} label="Active Courses" value={subjects.length} color="bg-purple-50" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">My Subjects</h2>
          <Link to="/teacher/subjects" className="text-indigo-600 text-sm hover:underline">Manage all</Link>
        </div>
        {subjects.length === 0 ? (
          <div className="text-center py-10">
            <FiBook className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No subjects created yet.</p>
            <Link to="/teacher/subjects" className="mt-3 inline-block text-indigo-600 font-medium hover:underline">
              Create your first subject
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.slice(0, 4).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{s.title}</p>
                  <p className="text-sm text-gray-500">{s.student_count} students</p>
                </div>
                <Link
                  to={`/teacher/subjects/${s.id}`}
                  className="text-indigo-600 text-sm hover:underline"
                >
                  View
                </Link>
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

export default TeacherDashboard;
