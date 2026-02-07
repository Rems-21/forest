
import React, { useState } from 'react';
import { User, UserRole, Contribution, Recipe, Plant } from '../types';
import { PLANTS } from '../constants';

interface PractitionerDashboardProps {
  user: User;
}

export const PractitionerDashboard: React.FC<PractitionerDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'recipes'>('reviews');
  const [pendingContribs, setPendingContribs] = useState<Contribution[]>([
    {
      id: 'c2',
      plantName: 'Harpagophytum',
      localName: 'Griffe du diable',
      usage: 'Anti-inflammatoire puissant pour les articulations.',
      region: 'Namibie',
      submittedBy: 'Sarah L.',
      date: '28/05/2025',
      status: 'PENDING',
      reviews: []
    }
  ]);

  const [recipeForm, setRecipeForm] = useState({
    plantId: '',
    title: '',
    description: '',
    ingredients: '',
    steps: ''
  });

  const [reviewForm, setReviewForm] = useState<{ id: string | null, comment: string, status: 'VALIDATED' | 'DISPUTED' }>({
    id: null,
    comment: '',
    status: 'VALIDATED'
  });

  const handleSubmitRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeForm.plantId || !recipeForm.title) return;
    
    alert(`La recette "${recipeForm.title}" a été soumise à l'Administrateur pour homologation.`);
    setRecipeForm({ plantId: '', title: '', description: '', ingredients: '', steps: '' });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.id) return;

    setPendingContribs(prev => prev.map(c => {
      if (c.id === reviewForm.id) {
        return {
          ...c,
          reviews: [
            ...c.reviews,
            {
              practitionerId: user.id,
              practitionerName: user.name,
              status: reviewForm.status,
              comment: reviewForm.comment,
              date: 'À l\'instant'
            }
          ]
        };
      }
      return c;
    }));

    setReviewForm({ id: null, comment: '', status: 'VALIDATED' });
    alert("Votre validation a été transmise à l'administrateur pour décision finale.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
        <div>
          <h1 className="text-4xl font-black text-emerald-900 tracking-tighter">Tableau de Bord Expert</h1>
          <p className="text-emerald-500 font-bold uppercase tracking-widest text-[10px] mt-2">
             Portail de {user.name} • Maître Herboriste
          </p>
        </div>
        
        <div className="flex p-2 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-xl overflow-hidden">
           <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reviews' ? 'bg-emerald-950 text-white shadow-xl' : 'text-emerald-400'}`}
           >
             Révisions ({pendingContribs.filter(c => !c.reviews.some(r => r.practitionerId === user.id)).length})
           </button>
           <button 
            onClick={() => setActiveTab('recipes')}
            className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'recipes' ? 'bg-emerald-950 text-white shadow-xl' : 'text-emerald-400'}`}
           >
             Soumettre Recette
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          {activeTab === 'reviews' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-emerald-950 mb-8 tracking-tight">Propositions en attente d'avis technique</h2>
              {pendingContribs.filter(c => !c.reviews.some(r => r.practitionerId === user.id)).map(c => (
                <div key={c.id} className="bg-white p-10 rounded-[3rem] shadow-xl border border-emerald-50 animate-fade-in">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-emerald-900 tracking-tighter">{c.plantName}</h3>
                      <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-1">{c.localName}</p>
                    </div>
                    <div className="bg-emerald-50 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-emerald-600">Comité Technique</div>
                  </div>
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 mb-8 italic text-emerald-800 text-sm leading-relaxed">"{c.usage}"</div>
                  
                  {reviewForm.id === c.id ? (
                    <form onSubmit={handleSubmitReview} className="space-y-6 animate-fade-in">
                      <div className="flex gap-4">
                         <button type="button" onClick={() => setReviewForm({...reviewForm, status: 'VALIDATED'})} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${reviewForm.status === 'VALIDATED' ? 'bg-lime-500 border-lime-500 text-emerald-950' : 'bg-white border-gray-100 text-gray-400'}`}>Valider l'usage</button>
                         <button type="button" onClick={() => setReviewForm({...reviewForm, status: 'DISPUTED'})} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${reviewForm.status === 'DISPUTED' ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-100 text-gray-400'}`}>Contester</button>
                      </div>
                      <textarea required placeholder="Observations techniques précises pour l'administrateur..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none text-sm h-32 focus:ring-2 focus:ring-emerald-500 outline-none" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}></textarea>
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-lime-500 hover:text-emerald-950 transition-all">Transmettre à l'Admin</button>
                        <button type="button" onClick={() => setReviewForm({id: null, comment: '', status: 'VALIDATED'})} className="px-6 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase">Annuler</button>
                      </div>
                    </form>
                  ) : (
                    <button onClick={() => setReviewForm({...reviewForm, id: c.id})} className="w-full py-5 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-lime-500 hover:text-emerald-950 transition-all flex items-center justify-center">
                       <i className="fas fa-eye mr-3"></i> Examiner le Dossier
                    </button>
                  )}
                </div>
              ))}
              {pendingContribs.filter(c => !c.reviews.some(r => r.practitionerId === user.id)).length === 0 && (
                <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-emerald-100 opacity-40">
                   <i className="fas fa-check-circle text-6xl mb-6"></i>
                   <p className="font-light italic text-emerald-950">Aucun dossier en attente de votre expertise.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-emerald-50 animate-fade-in">
               <h2 className="text-3xl font-black text-emerald-900 mb-10 tracking-tighter">Proposer une Recette Professionnelle</h2>
               <p className="text-gray-400 text-sm mb-10">Une fois soumise, l'administrateur vérifiera les dosages avant de la rendre publique sur le Wiki.</p>
               <form onSubmit={handleSubmitRecipe} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Plante Associée</label>
                    <select 
                      className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none outline-none font-bold text-emerald-950"
                      value={recipeForm.plantId}
                      onChange={e => setRecipeForm({...recipeForm, plantId: e.target.value})}
                      required
                    >
                       <option value="">Sélectionner une plante du catalogue...</option>
                       {PLANTS.map(p => <option key={p.id} value={p.id}>{p.commonName}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Titre de la Recette</label>
                    <input type="text" required placeholder="Ex: Élixir Detox au Moringa" className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none outline-none focus:ring-2 focus:ring-lime-500 transition-all font-bold text-emerald-950" value={recipeForm.title} onChange={e => setRecipeForm({...recipeForm, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Description Courte</label>
                    <textarea rows={2} required placeholder="Bienfaits attendus et contexte traditionnel..." className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none resize-none focus:ring-2 focus:ring-lime-500 outline-none" value={recipeForm.description} onChange={e => setRecipeForm({...recipeForm, description: e.target.value})}></textarea>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Ingrédients (1 par ligne)</label>
                        <textarea rows={5} required placeholder="10g de poudre de..." className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none resize-none focus:ring-2 focus:ring-lime-500 outline-none text-sm" value={recipeForm.ingredients} onChange={e => setRecipeForm({...recipeForm, ingredients: e.target.value})}></textarea>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Étapes (1 par ligne)</label>
                        <textarea rows={5} required placeholder="Faire infuser à 80°C..." className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none resize-none focus:ring-2 focus:ring-lime-500 outline-none text-sm" value={recipeForm.steps} onChange={e => setRecipeForm({...recipeForm, steps: e.target.value})}></textarea>
                     </div>
                  </div>
                  <button type="submit" className="w-full py-6 bg-emerald-950 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-lime-500 hover:text-emerald-950 transition-all flex items-center justify-center">
                     <i className="fas fa-paper-plane mr-3"></i> Soumettre à l'Administrateur
                  </button>
               </form>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-emerald-950 text-white p-10 rounded-[3rem] shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5"><i className="fas fa-feather-pointed text-8xl"></i></div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-lime-400 mb-8">Statistiques Impact</h4>
              <div className="space-y-6 relative z-10">
                 <div className="flex justify-between items-end">
                    <span className="text-emerald-500 text-[10px] font-bold uppercase">Validations</span>
                    <span className="text-3xl font-black tracking-tighter">14</span>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-emerald-500 text-[10px] font-bold uppercase">Recettes Homologuées</span>
                    <span className="text-3xl font-black tracking-tighter">8</span>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-emerald-500 text-[10px] font-bold uppercase">Expertise Score</span>
                    <span className="text-3xl font-black tracking-tighter">250</span>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Expertise Certifiée</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                 En tant que praticien certifié, vos avis techniques sont cruciaux pour la sécurité des utilisateurs. 
                 <br/><br/>
                 <b>Règle d'or:</b> Si un dosage vous semble risqué, utilisez le bouton "Contester" et expliquez pourquoi.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
