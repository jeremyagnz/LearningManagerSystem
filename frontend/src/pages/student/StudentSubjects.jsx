import { useState, useEffect } from 'react';
import { subjectAPI } from '../../services/api';
import { FiBook, FiUser, FiUsers, FiPlusCircle, FiMinusCircle } from 'react-icons/fi';

const StudentSubjects = () => {
  const [enrolled, setEnrolled] = useState([]);
  const [available, setAvailable] = useState([]);
  const [tab, setTab] = useState('enrolled');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = async () => {
    try {
      const [enrolledRes, allRes] = await Promise.all([
        subjectAPI.getMySubjects(),
        subjectAPI.getAllSubjects(),
      ]);
      const enrolledIds = new Set(enrolledRes.data.map((s) => s.id));
      setEnrolled(enrolledRes.data);
      setAvailable(allRes.data.filter((s) => !enrolledIds.has(s.id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (id) => {
    setActionLoading(id);
    try {
      await subjectAPI.enroll(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnenroll = async (id) => {
    setActionLoading(id);
    try {
      await subjectAPI.unenroll(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const subjects = tab === 'enrolled' ? enrolled : available;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Subjects</h1>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setTab('enrolled')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            tab === 'enrolled' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border hover:border-indigo-300'
          }`}
        >
          Enrolled ({enrolled.length})
        </button>
        <button
          onClick={() => setTab('available')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            tab === 'available' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border hover:border-indigo-300'
          }`}
        >
          Available ({available.length})
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <FiBook className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {tab === 'enrolled' ? 'Not enrolled in any subjects yet' : 'No available subjects'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <FiBook className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-1">{subject.title}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{subject.description || 'No description'}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500 space-x-3">
                  <span className="flex items-center space-x-1">
                    <FiUser className="h-4 w-4" aria-hidden="true" />
                    <span aria-label={`Instructor: ${subject.teacher_name}`}>{subject.teacher_name}</span>
                  </span>
                </div>
                {tab === 'enrolled' ? (
                  <button
                    onClick={() => handleUnenroll(subject.id)}
                    disabled={actionLoading === subject.id}
                    className="flex items-center space-x-1 text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    <FiMinusCircle className="h-4 w-4" />
                    <span>{actionLoading === subject.id ? '...' : 'Unenroll'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(subject.id)}
                    disabled={actionLoading === subject.id}
                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    <FiPlusCircle className="h-4 w-4" />
                    <span>{actionLoading === subject.id ? '...' : 'Enroll'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSubjects;
