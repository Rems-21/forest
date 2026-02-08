
import React from 'react';
import { SubscriptionTier, UserRole } from '../types';

interface PricingProps {
  onSelectPlan: (tier: SubscriptionTier) => void;
  currentTier?: SubscriptionTier;
  user?: any;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan, currentTier, user }) => {
  // Les admins et praticiens n'ont pas besoin de payer pour les abonnements
  if (user && (user.role === UserRole.ADMIN || user.role === UserRole.PRACTITIONER)) {
    const isAdmin = user.role === UserRole.ADMIN;
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-lime-100 text-lime-600 rounded-[2rem] flex items-center justify-center text-3xl mx-auto mb-8 shadow-xl">
            <i className={`fas ${isAdmin ? 'fa-crown' : 'fa-leaf'}`}></i>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-emerald-900 mb-6 tracking-tighter">
            {isAdmin ? 'Accès Administrateur' : 'Accès Botaniste'}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
            En tant que {isAdmin ? 'administrateur' : 'botaniste professionnel'}, vous avez un accès complet et gratuit à toutes les fonctionnalités premium de Forest Apothecary.
          </p>
          <div className="bg-lime-50 border-2 border-lime-200 rounded-[2rem] p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-black text-emerald-900 mb-4">Vos avantages inclus:</h3>
            <ul className="text-left space-y-3 text-gray-700">
              <li className="flex items-center"><i className="fas fa-check text-lime-500 mr-3"></i>Accès illimité à toutes les plantes premium</li>
              <li className="flex items-center"><i className="fas fa-check text-lime-500 mr-3"></i>Analyses biomoléculaires IA avancées</li>
              <li className="flex items-center"><i className="fas fa-check text-lime-500 mr-3"></i>Recettes exclusives des maîtres herboristes</li>
              <li className="flex items-center"><i className="fas fa-check text-lime-500 mr-3"></i>Support prioritaire 24/7</li>
              <li className="flex items-center"><i className="fas fa-check text-lime-500 mr-3"></i>Accès anticipé aux nouvelles fonctionnalités</li>
              {!isAdmin && (
                <li className="flex items-center"><i className="fas fa-check text-lime-500 mr-3"></i>Espace professionnel personnalisé</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
  const plans = [
    {
      id: SubscriptionTier.FREE,
      name: 'Explorateur',
      price: '0',
      period: '',
      description: 'Pour découvrir les bases de la botanique africaine.',
      features: [
        'Accès au Wiki public',
        'Identification IA basique',
        'Communauté de discussion',
        'Favoris limités (5)'
      ],
      cta: 'Plan Actuel',
      popular: false,
      color: 'bg-emerald-50 text-emerald-900'
    },
    {
      id: SubscriptionTier.PREMIUM_MONTHLY,
      name: 'Gardien de la Forêt',
      price: '2 500',
      period: '/ mois',
      description: 'Accès complet pour les passionnés et étudiants.',
      features: [
        'Wiki Premium Illimité',
        'Analyses Biomoléculaires IA',
        'Recettes des Maîtres Herboristes',
        'Consultation Praticiens Prioritaire',
        'Sans publicité'
      ],
      cta: 'Passer au Premium',
      popular: true,
      color: 'bg-emerald-950 text-white'
    },
    {
      id: SubscriptionTier.PREMIUM_YEARLY,
      name: 'Maître Botaniste',
      price: '20 000',
      period: '/ an',
      description: 'Le meilleur rapport qualité-prix pour les experts.',
      features: [
        'Tous les avantages Mensuels',
        'Accès anticipé aux nouvelles fiches',
        'Support expert 24/7',
        'Économisez 30%'
      ],
      cta: 'S\'abonner à l\'Année',
      popular: false,
      color: 'bg-lime-500 text-emerald-950'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-emerald-900 mb-6 tracking-tighter">Choisissez votre Impact</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
          En vous abonnant, vous soutenez la recherche botanique et la préservation de la sagesse africaine tout en accédant au savoir le plus pointu.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative p-10 rounded-[3rem] shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 ${
              plan.popular ? 'border-lime-500 scale-105 z-10' : 'border-transparent'
            } ${plan.color}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-lime-500 text-emerald-950 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                Plus Populaire
              </div>
            )}
            
            <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{plan.name}</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
              <span className="text-sm font-bold ml-2 opacity-60">CFA{plan.period}</span>
            </div>
            
            <p className="text-sm font-light mb-10 opacity-80 leading-relaxed">{plan.description}</p>
            
            <div className="space-y-4 mb-12">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <i className="fas fa-check-circle text-lime-400 mt-0.5"></i>
                  <span className="text-xs font-medium opacity-90">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              disabled={currentTier === plan.id}
              onClick={() => onSelectPlan(plan.id)}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95 ${
                plan.id === SubscriptionTier.FREE 
                  ? 'bg-white text-emerald-900' 
                  : plan.id === SubscriptionTier.PREMIUM_MONTHLY 
                  ? 'bg-lime-500 text-emerald-950' 
                  : 'bg-emerald-950 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {currentTier === plan.id ? 'Déjà Actif' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 p-12 bg-white rounded-[3rem] shadow-xl border border-emerald-50 text-center max-w-4xl mx-auto">
         <div className="flex items-center justify-center space-x-8 opacity-40">
            <i className="fab fa-cc-visa text-5xl"></i>
            <i className="fab fa-cc-mastercard text-5xl"></i>
            <i className="fas fa-mobile-screen-button text-5xl"></i>
            <span className="font-black text-xl">Orange / MTN Money</span>
         </div>
         <p className="mt-8 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Paiements sécurisés et cryptés par ForestPay</p>
      </div>
    </div>
  );
};
