
import React, { useState, useEffect } from 'react';
import { Plant, ValidationStatus, AccessType, Recipe, AppView, UserRole } from '../types';
import { getScientificInsights } from '../services/geminiService';

interface PlantDetailProps {
  plant: Plant;
  onBack: () => void;
  user?: any;
  setCurrentView?: (view: AppView) => void;
}

export const PlantDetail: React.FC<PlantDetailProps> = ({ plant, onBack, user, setCurrentView }) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'heritage' | 'recipes' | 'science'>('heritage');

  const hasAccess = plant.accessType === AccessType.FREE || (user && (user.hasPremiumAccess || user.role === UserRole.ADMIN || user.role === UserRole.PRACTITIONER));

  useEffect(() => {
    if (activeTab === 'science' && !insights && hasAccess) {
      const fetchInsights = async () => {
        setLoading(true);
        try {
          const data = await getScientificInsights(plant.commonName);
          setInsights(data);
        } catch (e) {
          console.error("Failed to fetch scientific insights", e);
        } finally {
          setLoading(false);
        }
      };
      fetchInsights();
    }
  }, [activeTab, plant, insights, hasAccess]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-12 flex items-center space-x-4 text-emerald-700 font-black text-xs uppercase tracking-widest hover:text-emerald-950 transition-all group"
      >
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
           <i className="fas fa-arrow-left"></i>
        </div>
        <span>Fermer le Dossier Botanique</span>
      </button>

      <div className="grid lg:grid-cols-12 gap-16">
        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-10">
          <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white group">
             <img src={plant.imageUrl} alt={plant.commonName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
             <div className="absolute top-8 left-8">
                <div className="bg-emerald-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center">
                   {plant.accessType === AccessType.PREMIUM ? (
                     <><i className="fas fa-crown text-lime-400 mr-2"></i> Premium</>
                   ) : (
                     <><i className="fas fa-leaf text-lime-400 mr-2"></i> Public</>
                   )}
                </div>
             </div>
          </div>

          <div className="space-y-6 px-4">
             <h1 className="text-5xl md:text-7xl font-black text-emerald-900 tracking-tighter leading-none">
                {plant.commonName}
             </h1>
             <p className="text-emerald-500 italic text-2xl font-light tracking-tight">
                {plant.scientificName}
             </p>
             <div className="flex flex-wrap gap-2">
                {plant.localNames.map(name => (
                  <span key={name} className="px-4 py-2 bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase rounded-xl border border-emerald-100">
                    {name}
                  </span>
                ))}
             </div>
          </div>

          {plant.accessType === AccessType.PREMIUM && !hasAccess && (
            <div className="bg-lime-400 p-10 rounded-[3rem] shadow-2xl text-emerald-950">
               <h3 className="text-2xl font-black mb-4 tracking-tighter">Accès Restreint</h3>
               <p className="font-medium text-emerald-900/70 mb-8">Débloquez les analyses moléculaires IA et les protocoles herboristes en passant Premium.</p>
               <button 
                 onClick={() => setCurrentView && setCurrentView('pricing')}
                 className="w-full py-5 bg-emerald-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-emerald-900 transition-all"
               >
                  Découvrir nos Abonnements
               </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-7 space-y-12">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 p-2 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
             {[
               { id: 'heritage', label: 'Héritage', icon: 'fa-vihara' },
               { id: 'recipes', label: 'Recettes Pro', icon: 'fa-mortar-pestle' },
               { id: 'science', label: 'Analyse IA', icon: 'fa-dna' },
             ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-3 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id ? 'bg-white text-emerald-950 shadow-xl' : 'text-emerald-400 hover:text-emerald-700'
                  }`}
               >
                  <i className={`fas ${tab.icon} text-lg`}></i>
                  <span className="hidden sm:inline">{tab.label}</span>
               </button>
             ))}
          </div>

          <div className="min-h-[500px]">
            {activeTab === 'heritage' && (
              <div className="space-y-10 animate-fade-in">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-emerald-50">
                   <h2 className="text-3xl font-black text-emerald-900 mb-10 tracking-tight">Usages Traditionnels</h2>
                   <div className="grid md:grid-cols-2 gap-6 mb-12">
                      {plant.uses.map(use => (
                        <div key={use} className="flex items-center space-x-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-50">
                           <div className="w-2 h-2 rounded-full bg-lime-500"></div>
                           <span className="text-emerald-900 font-black uppercase tracking-widest text-[10px]">{use}</span>
                        </div>
                      ))}
                   </div>
                   <div className="p-10 bg-emerald-950 text-emerald-100 rounded-[2.5rem] italic font-light text-xl relative">
                      <i className="fas fa-quote-left absolute top-6 left-6 text-white/10 text-5xl"></i>
                      {plant.preparation}
                   </div>
                   <div className="mt-8 p-8 bg-orange-50 rounded-[2.5rem] border border-orange-100">
                      <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-4 flex items-center">
                         <i className="fas fa-triangle-exclamation mr-3"></i> Précautions
                      </h4>
                      <p className="text-orange-900 font-medium leading-relaxed">{plant.precautions}</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'recipes' && (
              <div className="space-y-6 animate-fade-in">
                {!hasAccess ? (
                  <div className="py-24 text-center bg-emerald-50/30 rounded-[3.5rem] border-2 border-dashed border-emerald-100 px-12">
                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-emerald-200 text-3xl mx-auto mb-8 shadow-inner">
                        <i className="fas fa-lock"></i>
                     </div>
                     <h3 className="text-2xl font-black text-emerald-950 mb-4 tracking-tighter">Protocoles Réservés</h3>
                     <p className="text-sm font-medium text-gray-400 mb-10 leading-relaxed">Les recettes complètes, dosages herboristes et modes de préparation experts sont accessibles avec un pass Premium.</p>
                     <button 
                       onClick={() => setCurrentView && setCurrentView('pricing')}
                       className="px-10 py-5 bg-emerald-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-lime-500 hover:text-emerald-950 transition-all"
                     >
                       S'abonner maintenant
                     </button>
                  </div>
                ) : plant.recipes.length > 0 ? (
                  plant.recipes.map(recipe => (
                    <div key={recipe.id} className="bg-white p-10 rounded-[3rem] shadow-xl border border-emerald-50">
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <h3 className="text-2xl font-black text-emerald-900 tracking-tighter">{recipe.title}</h3>
                             <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Par {recipe.authorName}</p>
                          </div>
                          <span className="px-3 py-1 bg-lime-100 text-lime-700 rounded-lg text-[9px] font-black uppercase tracking-widest">Expert Certifié</span>
                       </div>
                       <p className="text-gray-600 font-light mb-8 italic">"{recipe.description}"</p>
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-800">Ingrédients</h4>
                             <ul className="space-y-2">
                                {recipe.ingredients.map((ing, i) => (
                                  <li key={i} className="flex items-center space-x-3 text-sm text-gray-500">
                                     <i className="fas fa-plus text-[8px] text-lime-500"></i>
                                     <span>{ing}</span>
                                  </li>
                                ))}
                             </ul>
                          </div>
                          <div className="space-y-4">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-800">Étapes</h4>
                             <ul className="space-y-4">
                                {recipe.steps.map((step, i) => (
                                  <li key={i} className="flex space-x-4">
                                     <span className="w-6 h-6 bg-emerald-50 text-emerald-900 rounded-lg flex items-center justify-center text-[10px] font-black">{i+1}</span>
                                     <span className="text-sm text-gray-500 flex-1">{step}</span>
                                  </li>
                                ))}
                             </ul>
                          </div>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-emerald-100 opacity-40">
                     <i className="fas fa-mortar-pestle text-6xl mb-6"></i>
                     <p className="font-light italic">Aucune recette publiée pour cette plante pour le moment.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'science' && (
              <div className="animate-fade-in">
                {!hasAccess ? (
                   <div className="py-24 text-center bg-emerald-50/30 rounded-[3.5rem] border-2 border-dashed border-emerald-100 px-12">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-emerald-200 text-3xl mx-auto mb-8 shadow-inner">
                         <i className="fas fa-flask"></i>
                      </div>
                      <h3 className="text-2xl font-black text-emerald-950 mb-4 tracking-tighter">Analyse Moléculaire</h3>
                      <p className="text-sm font-medium text-gray-400 mb-10 leading-relaxed">Accédez aux profils chimiques détaillés, études cliniques récentes et synthèses IA expertes réservées aux comptes Premium.</p>
                      <button 
                        onClick={() => setCurrentView && setCurrentView('pricing')}
                        className="px-10 py-5 bg-emerald-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-lime-500 hover:text-emerald-950 transition-all"
                      >
                        Passer au Premium
                      </button>
                   </div>
                ) : loading ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                     <div className="relative mb-8">
                        <div className="w-16 h-16 border-4 border-emerald-200 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-emerald-950 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
                     </div>
                     <p className="text-emerald-950 font-black uppercase tracking-widest text-xs">Séquençage via Gemini Science...</p>
                  </div>
                ) : insights ? (
                  <div className="space-y-10">
                     <div className="bg-emerald-950 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                        <h3 className="text-2xl font-black mb-10 tracking-tighter flex items-center">
                           <span className="w-10 h-10 bg-lime-500 text-emerald-950 rounded-xl flex items-center justify-center mr-4"><i className="fas fa-flask"></i></span>
                           Rapport Scientifique
                        </h3>
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                           <div>
                              <h4 className="text-[10px] font-black text-lime-400 uppercase tracking-widest mb-4">Principes Actifs</h4>
                              <div className="flex flex-wrap gap-2">
                                 {insights.activeCompounds.map((c: string) => (
                                   <span key={c} className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">{c}</span>
                                 ))}
                              </div>
                           </div>
                           <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                              <h4 className="text-[10px] font-black text-lime-400 uppercase tracking-widest mb-3">Études Cliniques</h4>
                              <p className="text-sm font-light leading-relaxed">{insights.clinicalStudies}</p>
                           </div>
                        </div>
                        <div className="p-8 bg-red-500/20 rounded-[2rem] border border-red-500/30">
                           <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3">Alerte Toxicité</h4>
                           <p className="text-lg font-black">{insights.toxicityAlerts}</p>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="text-center py-20 opacity-20">
                     <i className="fas fa-server text-6xl mb-6"></i>
                     <p className="text-2xl font-light">Connexion échouée.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
