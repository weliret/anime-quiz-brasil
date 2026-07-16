import React, { useState } from 'react';
import { motion } from 'framer-motion';

function RankingPage() {
  const [period, setPeriod] = useState('weekly');

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-neon bg-clip-text text-transparent">
          Ranking
        </h1>

        {/* Period Filter */}
        <div className="flex gap-4 mb-8">
          {['Diário', 'Semanal', 'Mensal', 'Global'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p.toLowerCase())}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                period === p.toLowerCase()
                  ? 'bg-gradient-neon text-dark-900'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Ranking Table */}
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left p-4">Posição</th>
                <th className="text-left p-4">Usuário</th>
                <th className="text-left p-4">Nível</th>
                <th className="text-left p-4">Pontos</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-dark-700 hover:bg-dark-700 transition"
                >
                  <td className="p-4 font-bold text-neon-blue">#{idx + 1}</td>
                  <td className="p-4">Usuário {idx + 1}</td>
                  <td className="p-4">Nível {idx + 10}</td>
                  <td className="p-4 text-neon-green font-bold">10,000 pts</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RankingPage;
