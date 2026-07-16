import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold bg-gradient-neon bg-clip-text text-transparent mb-4">
              🎌 Anime Quiz Brasil
            </h3>
            <p className="text-gray-400 text-sm">
              A plataforma definitiva para testar seus conhecimentos sobre anime!
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-neon-blue">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="text-gray-400 hover:text-neon-blue">
                  Quizzes
                </Link>
              </li>
              <li>
                <Link to="/ranking" className="text-gray-400 hover:text-neon-blue">
                  Ranking
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-blue">
                  Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-blue">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-blue">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Redes Sociais</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-blue">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-blue">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-blue">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © 2024 Anime Quiz Brasil. Desenvolvido com ❤️ para a comunidade otaku brasileira.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
