import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
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
  // TODO: Re-enable role-based redirect before production deployment.
  // Auth temporarily disabled — always redirect to /student.
  // const { user, loading } = useAuth();
  // if (loading) return null;
  // if (!user) return <Navigate to="/login" replace />;
  // return <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />;
  return <Navigate to="/student" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
