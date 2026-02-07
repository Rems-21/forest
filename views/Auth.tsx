
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
  onNavigateToPrivacy: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onBack, onNavigateToPrivacy }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'RESET'>('LOGIN');
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'SIGNUP' && !acceptTerms) {
      setError("Vous devez accepter la politique de confidentialité pour continuer.");
      return;
    }

    setLoading(true);
    setError('');

    // Mock Authentication Logic
    setTimeout(() => {
      // Check Admin
      if (formData.email === 'admin@forest.org' && formData.password === 'admin123') {
        onLogin({ id: 'admin-1', email: formData.email, name: 'Admin Forest', role: UserRole.ADMIN });
      } 
      // Check Practitioner (Mock)
      else if (formData.email === 'pract@forest.org' && formData.password === 'pract123') {
        onLogin({ id: 'pract-1', email: formData.email, name: 'Papa Samuel', role: UserRole.PRACTITIONER });
      }
      // Check Standard User
      else if (formData.email && formData.password.length >= 6) {
        onLogin({ id: 'user-' + Date.now(), email: formData.email, name: formData.name || 'Ami de la Forêt', role: UserRole.USER });
      } else {
        setError('Identifiants invalides. Essayez admin@forest.org/admin123 ou pract@forest.org/pract123');
      }
      setLoading(false);
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin({ 
        id: 'google-' + Date.now(), 
        email: 'user@gmail.com', 
        name: 'Utilisateur Google', 
        role: UserRole.USER 
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-emerald-50 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 p-8 opacity-[0.02] transform -rotate-12">
          <i className="fas fa-lock text-[10rem]"></i>
        </div>

        <div className="w-20 h-20 bg-lime-100 text-lime-600 rounded-[1.5rem] flex items-center justify-center text-3xl mx-auto mb-8 shadow-xl relative z-10">
          <i className={`fas ${mode === 'LOGIN' ? 'fa-fingerprint' : mode === 'SIGNUP' ? 'fa-user-plus' : 'fa-key'}`}></i>
        </div>

        <h1 className="text-3xl font-black text-emerald-900 mb-2 tracking-tighter relative z-10">
          {mode === 'LOGIN' ? 'Connexion' : mode === 'SIGNUP' ? 'Nous rejoindre' : 'Récupération'}
        </h1>
        <p className="text-emerald-500/50 text-[10px] font-black uppercase tracking-[0.2em] mb-10 relative z-10">
          Portail Forest Apothecary
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold border border-red-100 animate-fade-in">
            <i className="fas fa-circle-exclamation mr-2"></i> {error}
          </div>
        )}

        <div className="space-y-4 relative z-10">
          {mode === 'LOGIN' && (
             <div className="grid grid-cols-1 gap-2 mb-6">
                <button 
                  type="button"
                  onClick={() => setFormData({ email: 'admin@forest.org', password: 'admin123', name: '' })}
                  className="py-2 bg-emerald-50 text-emerald-800 text-[9px] font-black uppercase rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                  Démo Admin
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({ email: 'pract@forest.org', password: 'pract123', name: '' })}
                  className="py-2 bg-lime-50 text-lime-800 text-[9px] font-black uppercase rounded-lg border border-lime-100 hover:bg-lime-100 transition-colors"
                >
                  Démo Praticien
                </button>
             </div>
          )}

          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-bold text-gray-700">Continuer avec Google</span>
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="px-4 text-[10px] font-black text-gray-300 uppercase">ou via email</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 text-left">
            {mode === 'SIGNUP' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Nom complet</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none focus:ring-2 focus:ring-lime-500 outline-none transition-all text-emerald-950"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Email</label>
              <input 
                type="email" 
                className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none focus:ring-2 focus:ring-lime-500 outline-none transition-all text-emerald-950"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between px-4">
                <label className="text-[10px] font-black uppercase text-gray-400">Mot de passe</label>
                {mode === 'LOGIN' && (
                  <button type="button" onClick={() => setMode('RESET')} className="text-[9px] font-black uppercase text-emerald-600 hover:text-lime-500 transition-colors">Oublié ?</button>
                )}
              </div>
              <input 
                type="password" 
                className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none focus:ring-2 focus:ring-lime-500 outline-none transition-all text-emerald-950"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            {mode === 'SIGNUP' && (
              <div className="flex items-start space-x-3 px-2 py-4">
                <input 
                  type="checkbox" 
                  id="privacy"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-emerald-900 rounded" 
                />
                <label htmlFor="privacy" className="text-[11px] text-gray-500 leading-snug">
                  J'accepte la <button type="button" onClick={onNavigateToPrivacy} className="text-emerald-700 font-bold hover:underline">politique de confidentialité</button> et je reconnais que les informations fournies ne remplacent pas un avis médical.
                </label>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || (mode === 'SIGNUP' && !acceptTerms)}
              className="w-full py-5 bg-emerald-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-lime-500 hover:text-emerald-950 transition-all flex items-center justify-center space-x-3 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
              <span>{mode === 'LOGIN' ? 'Se Connecter' : 'Créer un Compte'}</span>
            </button>
          </form>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-50 space-y-3 relative z-10">
          <button 
            onClick={() => setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
            className="text-[10px] font-black uppercase text-emerald-700 hover:text-lime-600 tracking-widest transition-colors"
          >
            {mode === 'LOGIN' ? 'Pas encore membre ? Rejoindre' : 'Déjà membre ? Se connecter'}
          </button>
          <button 
            onClick={onBack}
            className="block w-full text-[10px] font-black uppercase text-gray-300 hover:text-gray-500 tracking-widest transition-colors mt-6"
          >
            <i className="fas fa-chevron-left mr-2"></i> Retour
          </button>
        </div>
      </div>
    </div>
  );
};
