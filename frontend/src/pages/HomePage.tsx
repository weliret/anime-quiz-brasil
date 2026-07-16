import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function HomePage() {
  const categories = [
    { name: 'Naruto', icon: '🍃', color: 'from-orange-500 to-yellow-500' },
    { name: 'One Piece', icon: '☠️', color: 'from-red-500 to-orange-500' },
    { name: 'Dragon Ball', icon: '⭐', color: 'from-orange-400 to-red-500' },
    { name: 'Bleach', icon: '⚔️', color: 'from-purple-500 to-pink-500' },
    { name: 'Solo Leveling', icon: '🐉', color: 'from-blue-500 to-purple-500' },
    { name: 'Demon Slayer', icon: '🔥', color: 'from-red-600 to-pink-500' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-neon bg-clip-text text-transparent">
              Bem-vindo ao Anime Quiz Brasil
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Teste seus conhecimentos sobre anime, ganhe XP, desbloqueie conquistas e
              compete com a comunidade otaku brasileira!
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/quizzes" className="btn btn-primary text-lg">
                Começar Agora
              </Link>
              <Link to="/ranking" className="btn btn-outline text-lg">
                Ver Ranking
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-900 bg-opacity-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-100">
            Categorias Populares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`card card-hover bg-gradient-to-br ${cat.color} bg-opacity-10 border-2 border-opacity-50 border-gray-600 cursor-pointer hover:border-opacity-100`}
              >
                <div className="text-6xl mb-4">{cat.icon}</div>
                <h3 className="text-2xl font-bold text-gray-100">{cat.name}</h3>
                <p className="text-gray-400 mt-2">Teste seus conhecimentos</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-100">
            Por que Anime Quiz Brasil?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '🎮 Gamificado',
                desc: 'Ganhe XP, suba de nível e desbloqueie conquistas',
              },
              {
                title: '🏆 Competitivo',
                desc: 'Dispute rankings globais e por categoria',
              },
              {
                title: '👥 Comunidade',
                desc: 'Participe de uma comunidade otaku vibrante',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="card text-center"
              >
                <div className="text-5xl mb-4">{feature.title.split(' ')[0]}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title.split(' ').slice(1).join(' ')}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
