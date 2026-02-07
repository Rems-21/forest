
import React, { useState, useRef } from 'react';
import { chatWithBotanist } from '../services/geminiService';

interface ContributeProps {
  onBack: () => void;
}

export const Contribute: React.FC<ContributeProps> = ({ onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    localName: '',
    usage: '',
    region: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAiAssist = async () => {
    if (!formData.name && !image) {
      alert("Veuillez entrer au moins un nom ou charger une image pour l'aide IA.");
      return;
    }
    setLoading(true);
    try {
      const prompt = `Aide-moi à compléter une fiche de contribution pour Forest Apothecary. 
      Nom fourni: ${formData.name}. 
      Je veux que tu me donnes (en français) le nom scientifique probable, les composés actifs majeurs et une description courte de la préparation traditionnelle standard. 
      Formatte ta réponse de manière claire.`;
      
      const res = await chatWithBotanist(prompt, []);
      // Prepend to usage for demonstration
      setFormData(prev => ({
        ...prev,
        usage: prev.usage + "\n\n[Suggestion IA]:\n" + res
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center animate-fade-in">
        <div className="w-24 h-24 bg-lime-500 text-emerald-950 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-2xl">
          <i className="fas fa-check"></i>
        </div>
        <h1 className="text-4xl font-black text-emerald-900 mb-6 tracking-tighter">Merci pour votre contribution !</h1>
        <p className="text-gray-500 text-lg font-light leading-relaxed mb-12 max-w-md mx-auto">
          Votre savoir a été envoyé à notre comité d'experts. Après validation scientifique, il sera ajouté à l'encyclopédie Forest Apothecary.
        </p>
        <button 
          onClick={onBack}
          className="px-12 py-5 bg-emerald-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-900 shadow-xl transition-all"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <button 
        onClick={onBack}
        className="mb-10 flex items-center space-x-4 text-emerald-700 font-black text-xs uppercase tracking-widest hover:text-emerald-950 transition-all group"
      >
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
           <i className="fas fa-arrow-left"></i>
        </div>
        <span>Annuler la contribution</span>
      </button>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-emerald-950 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <i className="fas fa-feather-pointed text-8xl"></i>
            </div>
            <h2 className="text-2xl font-black mb-6 tracking-tight relative z-10">Transmettre le Savoir</h2>
            <p className="text-emerald-400 font-medium text-sm leading-relaxed mb-8 relative z-10">
              Chaque plante partagée aide à préserver une partie de notre patrimoine médicinal. Les informations seront vérifiées par des botanistes certifiés.
            </p>
            <div className="space-y-4 text-xs font-bold uppercase tracking-widest text-emerald-600 relative z-10">
              <div className="flex items-center space-x-3">
                <i className="fas fa-circle-check text-lime-500"></i>
                <span>Validation par les pairs</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-circle-check text-lime-500"></i>
                <span>Usage Traditionnel</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-circle-check text-lime-500"></i>
                <span>Protection du Patrimoine</span>
              </div>
            </div>
          </div>

          <div 
            className={`aspect-square rounded-[2.5rem] overflow-hidden border-4 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center p-8 text-center ${image ? 'border-white shadow-2xl bg-white' : 'border-emerald-100 bg-emerald-50 hover:bg-emerald-100'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {image ? (
              <img src={image} alt="Upload" className="w-full h-full object-cover" />
            ) : (
              <>
                <i className="fas fa-camera text-4xl text-emerald-200 mb-4"></i>
                <p className="text-emerald-900 font-black uppercase tracking-widest text-[10px]">Photo de la plante</p>
                <p className="text-gray-400 text-[10px] mt-2">Feuille, fleur ou écorce</p>
              </>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
          </div>
        </div>

        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-emerald-50 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nom de la Plante</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Kinkeliba"
                  className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none focus:ring-2 focus:ring-lime-500 outline-none transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nom Local</label>
                <input 
                  type="text" 
                  placeholder="Ex: Sékhew (Wolof)"
                  className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none focus:ring-2 focus:ring-lime-500 outline-none transition-all"
                  value={formData.localName}
                  onChange={e => setFormData({...formData, localName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Région de Provenance</label>
              <input 
                type="text" 
                placeholder="Ex: Adamaoua, Cameroun"
                className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none focus:ring-2 focus:ring-lime-500 outline-none transition-all"
                value={formData.region}
                onChange={e => setFormData({...formData, region: e.target.value})}
              />
            </div>

            <div className="space-y-2 relative">
              <div className="flex justify-between items-center mb-2 px-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Usages & Préparation</label>
                <button 
                  type="button"
                  onClick={handleAiAssist}
                  disabled={loading}
                  className="text-[10px] font-black uppercase tracking-widest text-lime-600 flex items-center hover:text-lime-700 transition-colors"
                >
                  <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'} mr-2`}></i>
                  Aide IA
                </button>
              </div>
              <textarea 
                rows={6}
                required
                placeholder="Décrivez les bienfaits et comment préparer le remède..."
                className="w-full px-8 py-6 rounded-[2rem] bg-emerald-50/50 border-none focus:ring-2 focus:ring-lime-500 outline-none transition-all resize-none"
                value={formData.usage}
                onChange={e => setFormData({...formData, usage: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-emerald-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-emerald-900/20 hover:bg-lime-500 hover:text-emerald-950 transition-all flex items-center justify-center space-x-3"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
              <span>Soumettre la Contribution</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
