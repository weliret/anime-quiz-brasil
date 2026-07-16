import React from 'react';
import { useAuthStore } from '@hooks/useAuth';
import { Navigate } from 'react-router-dom';

function AdminPage() {
  const { user } = useAuthStore();

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-neon bg-clip-text text-transparent">
          Painel Administrativo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Quizzes', count: 0 },
            { title: 'Usuários', count: 0 },
            { title: 'Denúncias', count: 0 },
          ].map((item) => (
            <div key={item.title} className="card">
              <h3 className="text-gray-400 text-sm">{item.title}</h3>
              <p className="text-3xl font-bold text-neon-blue mt-2">{item.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
