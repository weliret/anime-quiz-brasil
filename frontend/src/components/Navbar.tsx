import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@hooks/useAuth';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent"
            >
              🎌 Anime Quiz
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/quizzes" className="text-gray-300 hover:text-neon-blue transition">
              Quizzes
            </Link>
            <Link to="/ranking" className="text-gray-300 hover:text-neon-blue transition">
              Ranking
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="text-gray-300 hover:text-neon-blue transition">
                  Perfil
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-300 hover:text-neon-blue transition">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Cadastro
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 space-y-2"
          >
            <Link to="/quizzes" className="block px-4 py-2 text-gray-300 hover:text-neon-blue">
              Quizzes
            </Link>
            <Link to="/ranking" className="block px-4 py-2 text-gray-300 hover:text-neon-blue">
              Ranking
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="block px-4 py-2 text-gray-300 hover:text-neon-blue">
                  Perfil
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2 text-gray-300 hover:text-neon-blue">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-neon-blue"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-gray-300 hover:text-neon-blue">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-2 text-gray-300 hover:text-neon-blue">
                  Cadastro
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
