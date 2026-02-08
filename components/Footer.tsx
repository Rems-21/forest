
import React from 'react';
import { AppView } from '../types';

interface FooterProps {
  setCurrentView: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 py-12 border-t border-emerald-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-lime-500 p-2 rounded-lg">
                <i className="fas fa-leaf text-emerald-950 text-xl"></i>
              </div>
              <span className="font-bold text-2xl text-white tracking-tight">Forest Apothecary</span>
            </div>
            <p className="text-emerald-400 text-sm leading-relaxed mb-6">
              Préserver et valider le patrimoine médicinal africain pour une santé globale et durable.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-lime-500 hover:text-emerald-950 transition-all">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-lime-500 hover:text-emerald-950 transition-all">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-lime-500 hover:text-emerald-950 transition-all">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Plateforme</h4>
            <ul className="space-y-4 text-sm">
              <li><button onClick={() => setCurrentView('home')} className="hover:text-lime-400 transition-colors">Accueil</button></li>
              <li><button onClick={() => setCurrentView('wiki')} className="hover:text-lime-400 transition-colors">Encyclopédie Wiki</button></li>
              <li><button onClick={() => setCurrentView('analyze')} className="hover:text-lime-400 transition-colors">Analyse IA</button></li>
              <li><button onClick={() => setCurrentView('practitioner-apply')} className="text-lime-500 font-black hover:text-white transition-colors">Devenir Expert</button></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Soutien</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-lime-400 transition-colors">Comité Scientifique</a></li>
              <li><a href="#" className="hover:text-lime-400 transition-colors">Partenariats</a></li>
              <li><a href="#" className="hover:text-lime-400 transition-colors">Blog Santé</a></li>
              <li><button onClick={() => setCurrentView('privacy')} className="hover:text-lime-400 transition-colors">Confidentialité</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt mt-1 text-lime-500"></i>
                <span>Yaoundé, Cameroun<br/>Immeuble de la Santé</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-envelope text-lime-500"></i>
                <span>contact@forestapothecary.org</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-phone text-lime-500"></i>
                <span>+237 693 29 01 35</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-900 mt-12 pt-8 text-center text-xs text-emerald-600">
          <p>&copy; {new Date().getFullYear()} Forest Apothecary. Tous droits réservés. Design par Excellence Digitale.</p>
        </div>
      </div>
    </footer>
  );
};
