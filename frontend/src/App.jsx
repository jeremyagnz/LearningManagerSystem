import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentSubjects from './pages/student/StudentSubjects';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentGrades from './pages/student/StudentGrades';
import Profile from './pages/student/Profile';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherSubjects from './pages/teacher/TeacherSubjects';
import SubjectDetail from './pages/teacher/SubjectDetail';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import AssignmentSubmissions from './pages/teacher/AssignmentSubmissions';

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
  if (user) return <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-600 p-3 rounded-full">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Learning Manager System</h1>
        <p className="text-gray-500 mb-8">Selecciona tu rol para continuar</p>
        <div className="space-y-4">
          <Link
            to="/teacher"
            className="block w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Acceder como Profesor
          </Link>
          <Link
            to="/student"
            className="block w-full py-3 px-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Acceder como Estudiante
          </Link>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student Routes */}
            <Route element={<ProtectedRoute role="student"><Layout /></ProtectedRoute>}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/subjects" element={<StudentSubjects />} />
              <Route path="/student/assignments" element={<StudentAssignments />} />
              <Route path="/student/grades" element={<StudentGrades />} />
              <Route path="/student/profile" element={<Profile />} />
            </Route>

            {/* Teacher Routes */}
            <Route element={<ProtectedRoute role="teacher"><Layout /></ProtectedRoute>}>
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/subjects" element={<TeacherSubjects />} />
              <Route path="/teacher/subjects/:id" element={<SubjectDetail />} />
              <Route path="/teacher/assignments" element={<TeacherAssignments />} />
              <Route path="/teacher/assignments/:assignmentId/submissions" element={<AssignmentSubmissions />} />
              <Route path="/teacher/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
