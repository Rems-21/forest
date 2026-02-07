
import React, { useState } from 'react';
import { SubscriptionTier } from '../types';

interface PaymentProps {
  plan: SubscriptionTier;
  onSuccess: () => void;
  onCancel: () => void;
}

export const Payment: React.FC<PaymentProps> = ({ plan, onSuccess, onCancel }) => {
  const [method, setMethod] = useState<'MOMO' | 'CARD'>('MOMO');
  const [loading, setLoading] = useState(false);
  
  const price = plan === SubscriptionTier.PREMIUM_MONTHLY ? '2 500' : '20 000';
  const label = plan === SubscriptionTier.PREMIUM_MONTHLY ? 'Abonnement Mensuel' : 'Abonnement Annuel';

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2500);
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-4 animate-fade-in">
      <div className="bg-white rounded-[3.5rem] shadow-2xl border border-emerald-50 overflow-hidden">
        <div className="bg-emerald-950 p-10 text-white relative">
           <button onClick={onCancel} className="absolute top-8 right-8 text-emerald-500 hover:text-white"><i className="fas fa-times"></i></button>
           <h2 className="text-3xl font-black tracking-tighter mb-2">Finaliser l'Adhésion</h2>
           <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
           <div className="mt-8 flex justify-between items-end">
              <span className="text-sm font-light opacity-60">Total à payer :</span>
              <span className="text-4xl font-black tracking-tighter">{price} CFA</span>
           </div>
        </div>

        <div className="p-10 space-y-8">
           <div className="flex p-2 bg-emerald-50 rounded-2xl">
              <button 
                onClick={() => setMethod('MOMO')}
                className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'MOMO' ? 'bg-white text-emerald-950 shadow-md' : 'text-emerald-400'}`}
              >
                Mobile Money
              </button>
              <button 
                onClick={() => setMethod('CARD')}
                className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'CARD' ? 'bg-white text-emerald-950 shadow-md' : 'text-emerald-400'}`}
              >
                Carte Bancaire
              </button>
           </div>

           <form onSubmit={handlePay} className="space-y-6">
              {method === 'MOMO' ? (
                <div className="space-y-4 animate-fade-in">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Opérateur</label>
                      <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-emerald-950">
                         <option>Orange Money</option>
                         <option>MTN MoMo</option>
                         <option>Wave</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Numéro de téléphone</label>
                      <input type="tel" required placeholder="6XX XX XX XX" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-emerald-950" />
                   </div>
                   <div className="bg-emerald-50 p-6 rounded-2xl flex items-start space-x-4">
                      <i className="fas fa-info-circle text-emerald-500 mt-1"></i>
                      <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">Une demande de confirmation sera envoyée sur votre téléphone. Validez avec votre code PIN après avoir cliqué sur le bouton ci-dessous.</p>
                   </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Nom sur la carte</label>
                      <input type="text" required placeholder="JEAN DUPONT" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-emerald-950 uppercase" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Numéro de carte</label>
                      <div className="relative">
                         <input type="text" required placeholder="XXXX XXXX XXXX XXXX" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-emerald-950" />
                         <i className="fas fa-credit-card absolute right-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" required placeholder="MM/YY" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-emerald-950" />
                      <input type="text" required placeholder="CVV" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-emerald-950" />
                   </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 bg-emerald-950 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-lime-500 hover:text-emerald-950 transition-all active:scale-95 flex items-center justify-center"
              >
                {loading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-shield-check mr-3"></i>}
                <span>{loading ? 'Traitement Sécurisé...' : 'Confirmer le Paiement'}</span>
              </button>
           </form>
        </div>
      </div>
    </div>
  );
};
