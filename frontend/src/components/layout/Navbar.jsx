import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBook, FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { to: '/student', label: 'Dashboard' },
    { to: '/student/subjects', label: 'Subjects' },
    { to: '/student/assignments', label: 'Assignments' },
    { to: '/student/grades', label: 'Grades' },
  ];

  const teacherLinks = [
    { to: '/teacher', label: 'Dashboard' },
    { to: '/teacher/subjects', label: 'Subjects' },
    { to: '/teacher/assignments', label: 'Assignments' },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <FiBook className="h-6 w-6" />
            <span className="text-xl font-bold">LMS</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium hover:text-indigo-200 transition-colors ${
                  location.pathname === link.to ? 'text-white border-b-2 border-white' : 'text-indigo-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={user?.role === 'teacher' ? '/teacher/profile' : '/student/profile'}
              className="flex items-center space-x-1 text-indigo-100 hover:text-white"
            >
              <FiUser className="h-4 w-4" />
              <span className="text-sm">{user?.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-indigo-100 hover:text-white"
            >
              <FiLogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-indigo-700 px-4 pb-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-indigo-100 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="block py-2 text-indigo-100 hover:text-white">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
