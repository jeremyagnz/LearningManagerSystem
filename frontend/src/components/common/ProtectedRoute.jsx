// TODO: Re-enable authentication checks before production deployment.
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// eslint-disable-next-line no-unused-vars
const ProtectedRoute = ({ children, role }) => {
  // Auth temporarily disabled — all routes are accessible without login.
  // const { user, loading } = useAuth();

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  //     </div>
  //   );
  // }

  // if (!user) return <Navigate to="/login" replace />;
  // if (role && user.role !== role) {
  //   return <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />;
  // }

  return children;
};

export default ProtectedRoute;
