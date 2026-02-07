
import React, { useState } from 'react';
import { AppView, UserRole } from '../types';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  user?: any;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems: { id: AppView; label: string; icon: string; roles?: UserRole[] }[] = [
    { id: 'home', label: 'Accueil', icon: 'fa-house' },
    { id: 'wiki', label: 'Wiki', icon: 'fa-book-medical' },
    { id: 'analyze', label: 'Analyse', icon: 'fa-magnifying-glass' },
    { id: 'map', label: 'Réseau', icon: 'fa-location-dot' },
    { id: 'community', label: 'Communauté', icon: 'fa-users-rectangle' },
    { id: 'practitioner-apply', label: 'Devenir Expert', icon: 'fa-user-plus' },
    { id: 'practitioner-dashboard', label: 'Révision', icon: 'fa-user-check', roles: [UserRole.PRACTITIONER] },
  ];

  const visibleItems = navItems.filter(item => !item.roles || (user && item.roles.includes(user.role)));

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <header className="bg-emerald-900 text-white shadow-2xl sticky top-0 z-[100] backdrop-blur-md bg-opacity-95 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Bouton Hamburger Mobile */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-xl hover:bg-emerald-800 rounded-xl transition-colors"
              aria-label="Ouvrir le menu"
            >
              <i className="fas fa-bars"></i>
            </button>

            {/* Logo */}
            <div 
              className="flex items-center space-x-2 md:space-x-3 cursor-pointer group" 
              onClick={() => { setCurrentView('home'); closeSidebar(); }}
            >
              <div className="bg-lime-500 p-1.5 md:p-2 rounded-lg md:rounded-xl transform rotate-3 shadow-lg group-hover:rotate-0 transition-transform">
                 <i className="fas fa-leaf text-emerald-950 text-sm md:text-xl"></i>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base md:text-xl tracking-tighter leading-none">Forest Apothecary</span>
                <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-lime-400 hidden sm:block">Patrimoine Médicinal Africain</span>
              </div>
            </div>
            
            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {visibleItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 relative group ${
                    currentView === item.id 
                      ? 'text-lime-400' 
                      : 'text-emerald-100/60 hover:text-white hover:bg-emerald-800/50'
                  }`}
                >
                  <i className={`fas ${item.icon} text-sm`}></i>
                  <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                  {currentView === item.id && (
                    <div className="absolute -bottom-1 left-4 right-4 h-1 bg-lime-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>

            {/* Profil Rapide */}
            <div className="flex items-center">
               <button 
                  onClick={() => { setCurrentView('profile'); closeSidebar(); }} 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    currentView === 'profile' 
                    ? 'bg-lime-500 text-emerald-950 scale-105 shadow-xl' 
                    : 'bg-emerald-800 hover:bg-emerald-700'
                  }`}
                >
                  <i className="fas fa-user text-sm"></i>
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Mobile & Overlay */}
      <div 
        className={`fixed inset-0 z-[150] lg:hidden transition-all duration-500 ${isSidebarOpen ? 'visible' : 'invisible'}`}
      >
        {/* Fond Sombre (Overlay) */}
        <div 
          className={`absolute inset-0 bg-emerald-950/80 backdrop-blur-sm transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeSidebar}
        ></div>

        {/* Contenu Sidebar */}
        <aside 
          className={`absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-emerald-900 shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Header Sidebar */}
          <div className="p-6 flex justify-between items-center border-b border-emerald-800">
            <div className="flex items-center space-x-3">
              <div className="bg-lime-500 p-1.5 rounded-lg">
                <i className="fas fa-leaf text-emerald-950 text-sm"></i>
              </div>
              <span className="font-black text-white text-lg tracking-tighter">Navigation</span>
            </div>
            <button 
              onClick={closeSidebar}
              className="w-10 h-10 flex items-center justify-center text-emerald-400 hover:text-white transition-colors"
            >
              <i className="fas fa-xmark text-2xl"></i>
            </button>
          </div>

          {/* Liens de Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentView(item.id); closeSidebar(); }}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${
                  currentView === item.id 
                    ? 'bg-lime-500 text-emerald-950 font-black shadow-lg' 
                    : 'text-emerald-100/70 hover:bg-emerald-800 hover:text-white'
                }`}
              >
                <i className={`fas ${item.icon} text-lg w-8 text-center`}></i>
                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Pied Sidebar (Profil) */}
          <div className="p-6 bg-emerald-950/50 border-t border-emerald-800">
            <button 
              onClick={() => { setCurrentView('profile'); closeSidebar(); }}
              className="w-full flex items-center space-x-4 p-4 rounded-2xl bg-emerald-800 hover:bg-emerald-700 transition-all text-white"
            >
              <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center shadow-inner">
                <i className="fas fa-user"></i>
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-lime-400">Compte Utilisateur</p>
                <p className="text-xs font-bold truncate">{user ? user.name : 'Se connecter'}</p>
              </div>
              <i className="fas fa-chevron-right text-[10px] text-emerald-500"></i>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
};
