import React from 'react';
import { useAuthStore } from '@hooks/useAuth';
import { Navigate } from 'react-router-dom';

function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-neon bg-clip-text text-transparent">
          Meu Perfil
        </h1>

        {/* Profile Card */}
        <div className="card mb-8">
          <div className="flex items-center gap-6 mb-8">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-24 h-24 rounded-full border-2 border-neon-blue"
            />
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-gray-400">{user.email}</p>
              <div className="flex gap-4 mt-4">
                <div>
                  <p className="text-neon-blue font-bold text-xl">{user.level}</p>
                  <p className="text-gray-400 text-sm">Nível</p>
                </div>
                <div>
                  <p className="text-neon-blue font-bold text-xl">{user.xp}</p>
                  <p className="text-gray-400 text-sm">XP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
