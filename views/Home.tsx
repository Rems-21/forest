
import React from 'react';
import { AppView } from '../types';

interface HomeProps {
  onStartWiki: () => void;
  onStartAnalyze: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStartWiki, onStartAnalyze }) => {
  return (
    <div className="space-y-12 pb-12 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[500px] lg:h-[600px] flex items-center justify-center text-white overflow-hidden rounded-b-[3rem] lg:rounded-b-[4rem] shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200" 
          alt="Forest" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
        />
        <div className="relative z-10 text-center px-6 max-w-4xl py-12 md:py-0">
          <div className="inline-block px-4 py-1.5 bg-lime-500/20 backdrop-blur-md rounded-full border border-lime-500/30 text-lime-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-6 animate-fade-in">
            Patrimoine Numérique Africain
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black mb-6 md:mb-8 leading-tight tracking-tighter">
            La Sagesse de la Nature, <br className="hidden md:block"/> <span className="text-lime-400">Validée par la Science</span>
          </h1>
          <p className="text-base md:text-lg lg:text-2xl mb-8 md:mb-10 text-emerald-50/80 max-w-2xl mx-auto font-light leading-relaxed">
            Identifiez instantanément les plantes médicinales et accédez à des remèdes ancestraux certifiés par nos experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 max-w-md mx-auto sm:max-w-none">
            <button 
              onClick={onStartWiki}
              className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 bg-lime-500 hover:bg-lime-400 text-emerald-950 font-black rounded-2xl transition-all shadow-xl active:scale-95"
            >
              <i className="fas fa-book-open mr-2"></i> Explorer le Wiki
            </button>
            <button 
              onClick={onStartAnalyze}
              className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 font-bold rounded-2xl transition-all active:scale-95"
            >
              <i className="fas fa-camera mr-2"></i> Identification IA
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 md:-mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Remèdes Validés', value: '100+', icon: 'fa-check-double', color: 'bg-emerald-100 text-emerald-600' },
            { label: 'Praticiens', value: '50', icon: 'fa-user-doctor', color: 'bg-lime-100 text-lime-600' },
            { label: 'Analyses IA', value: '12k+', icon: 'fa-microscope', color: 'bg-orange-100 text-orange-600' },
            { label: 'Espèces Référencées', value: '450+', icon: 'fa-seedling', color: 'bg-blue-100 text-blue-600' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-5 md:p-8 rounded-[2rem] shadow-xl border border-white transition-all hover:scale-105">
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-2xl mb-3 md:mb-4 ${stat.color}`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div className="text-xl md:text-3xl font-black text-emerald-900 mb-1">{stat.value}</div>
              <div className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Vision Cards */}
      <section className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-6 md:gap-8 py-6">
        <div className="bg-emerald-900 text-white p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <i className="fas fa-bullseye text-7xl md:text-9xl"></i>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center">
            <i className="fas fa-shield-halved mr-4 text-lime-400"></i> Notre Mission
          </h2>
          <p className="text-emerald-100/70 text-base md:text-lg leading-relaxed font-light">
            Cataloguer, valider scientifiquement et démocratiser l'accès aux remèdes traditionnels africains via une plateforme collaborative, préservant ainsi un patrimoine inestimable pour les générations futures.
          </p>
        </div>
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-emerald-50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
             <i className="fas fa-mountain-sun text-7xl md:text-9xl"></i>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-4 md:mb-6 flex items-center">
            <i className="fas fa-eye mr-4 text-emerald-600"></i> Notre Vision
          </h2>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed font-light">
            Devenir la référence mondiale de la pharmacopée traditionnelle validée, créant un pont de confiance incontournable entre la sagesse de la forêt et la médecine moderne.
          </p>
        </div>
      </section>
      
      {/* Newsletter Section - Fixed Overflow and Scaling */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="bg-lime-400 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between shadow-2xl gap-8 lg:gap-16">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-2xl md:text-4xl font-black text-emerald-950 mb-3 md:mb-4 leading-tight">Sauvons ensemble le savoir de nos aînés</h2>
            <p className="text-emerald-900/60 text-sm md:text-lg font-medium">Rejoignez notre bulletin scientifique et recevez les dernières validations en exclusivité.</p>
          </div>
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white/40 backdrop-blur-sm p-2 rounded-2xl flex flex-col sm:flex-row shadow-inner gap-2">
              <input 
                type="email" 
                placeholder="votre@email.com" 
                className="flex-1 bg-transparent px-4 py-3 rounded-xl text-emerald-950 placeholder-emerald-900/40 focus:outline-none min-w-0 text-sm md:text-base"
              />
              <button className="w-full sm:w-auto bg-emerald-950 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-900 transition-all shadow-lg active:scale-95 text-sm md:text-base">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
