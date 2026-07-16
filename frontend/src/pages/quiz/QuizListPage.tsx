import React, { useState } from 'react';
import { motion } from 'framer-motion';

function QuizListPage() {
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const categories = ['Naruto', 'One Piece', 'Dragon Ball', 'Bleach', 'Solo Leveling', 'Demon Slayer'];
  const difficulties = ['Fácil', 'Médio', 'Difícil', 'Extremo'];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-neon bg-clip-text text-transparent">
          Quizzes
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full"
            >
              <option value="all">Todas as categorias</option>
              {categories.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Dificuldade</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full"
            >
              <option value="all">Todas as dificuldades</option>
              {difficulties.map((diff) => (
                <option key={diff} value={diff.toLowerCase()}>
                  {diff}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Loading skeleton */}
          {[...Array(6)].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card card-hover skeleton h-64"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizListPage;
