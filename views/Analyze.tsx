
import React, { useState, useRef } from 'react';
import { chatWithBotanist, analyzePlantImage } from '../services/geminiService';

export const Analyze: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setImage(imageData);
        runAnalysis(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (imageData?: string) => {
    const imageToAnalyze = imageData || image;
    if (!imageToAnalyze) return;
    
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzePlantImage(imageToAnalyze);
      setAnalysis(result);
    } catch (err) {
      setAnalysis("Erreur de connexion. Veuillez vérifier votre image et réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    setIsChatting(true);
    const prevAnalysis = analysis;
    setAnalysis(prevAnalysis + "\n\n---\n🔄 *En attente de réponse...*");
    try {
      const res = await chatWithBotanist(question, []);
      setAnalysis(prevAnalysis + "\n\n---\n💡 **Question supplémentaire:** " + question + "\n\n" + res);
      setQuestion('');
    } catch (e) {
      setAnalysis(prevAnalysis + "\n\n---\n⚠️ Erreur de réponse.");
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-lime-100 text-lime-700 rounded-[2rem] mb-8 shadow-xl">
           <i className="fas fa-wand-magic-sparkles text-3xl"></i>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-emerald-900 mb-6 tracking-tighter">Diagnostic Visuel Intelligent</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          Capturez n'importe quelle partie d'une plante pour débloquer des millénaires de savoir médicinal instantanément.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left: Interactive Camera Area */}
        <div className="lg:col-span-5 space-y-8">
          <div 
            className={`group relative aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl transition-all duration-500 border-4 ${image ? 'border-white' : 'border-emerald-100 border-dashed bg-emerald-50 hover:bg-emerald-100/50'}`}
            onClick={() => !loading && fileInputRef.current?.click()}
          >
            {image ? (
              <>
                <img src={image} alt="Target" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="bg-white/20 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/30 text-white font-black uppercase tracking-widest text-xs">
                      Changer l'image
                   </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center cursor-pointer">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl text-emerald-500 mb-8 shadow-2xl group-hover:scale-110 transition-transform">
                   <i className="fas fa-camera"></i>
                </div>
                <h3 className="text-emerald-900 font-black uppercase tracking-[0.2em] text-sm mb-4">Activer la Caméra</h3>
                <p className="text-emerald-600/50 text-xs font-bold leading-relaxed max-w-xs">
                  Placez la plante sous une lumière claire pour une précision optimale (Min 80%)
                </p>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-md flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                   <div className="w-20 h-20 border-4 border-lime-500/20 rounded-full"></div>
                   <div className="w-20 h-20 border-4 border-lime-500 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
                </div>
                <div className="text-center">
                   <p className="text-lime-400 font-black uppercase tracking-widest text-xs mb-1">Analyse du Génome...</p>
                   <p className="text-emerald-500 text-[10px] font-bold">Base de données: P-AFR-2025</p>
                </div>
              </div>
            )}
          </div>

          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" capture="environment" />
          
          <div className="grid grid-cols-3 gap-4">
             {['Structure', 'Couleur', 'Usage'].map(tag => (
               <div key={tag} className="bg-white p-4 rounded-2xl border border-emerald-50 text-center shadow-sm">
                  <i className={`fas ${tag === 'Structure' ? 'fa-diagram-project' : tag === 'Couleur' ? 'fa-palette' : 'fa-mortar-pestle'} text-emerald-200 mb-2 block`}></i>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{tag}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Right: AI Brain Area */}
        <div className="lg:col-span-7 bg-emerald-950 text-white rounded-[3.5rem] p-12 min-h-[600px] flex flex-col shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
             <i className="fas fa-microchip text-[12rem]"></i>
          </div>

          <div className="flex items-center justify-between mb-12 relative z-10">
            <h2 className="text-2xl font-black tracking-tighter flex items-center">
               <span className="w-12 h-12 bg-lime-500 text-emerald-950 rounded-2xl flex items-center justify-center mr-5 shadow-xl">
                  <i className="fas fa-bolt"></i>
               </span>
               Résultats Botaniques
            </h2>
            <div className="flex space-x-2">
               <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></div>
               <div className="w-2 h-2 rounded-full bg-emerald-800"></div>
               <div className="w-2 h-2 rounded-full bg-emerald-800"></div>
            </div>
          </div>

          <div className="flex-1 overflow-auto relative z-10 custom-scrollbar pr-4">
            {analysis ? (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-emerald-900/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-emerald-800/50 shadow-inner">
                   <p className="text-emerald-50 font-light text-xl leading-relaxed whitespace-pre-wrap selection:bg-lime-500 selection:text-emerald-950">
                     {analysis}
                   </p>
                </div>

                <div className="bg-lime-500 text-emerald-950 p-8 rounded-[2rem] shadow-2xl flex items-center justify-between">
                   <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Action Requise</h4>
                      <p className="font-black text-lg">Enregistrer cette plante ?</p>
                   </div>
                   <button className="bg-emerald-950 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl">
                      Sauvegarder
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-20 py-20">
                <i className="fas fa-leaf text-9xl mb-10"></i>
                <p className="text-2xl font-light italic max-w-sm">
                  Le moteur d'intelligence attend un échantillon pour démarrer le séquençage.
                </p>
              </div>
            )}
          </div>

          {analysis && (
            <div className="mt-12 pt-10 border-t border-emerald-900 relative z-10">
              <h4 className="text-xs font-black text-lime-400 uppercase tracking-widest mb-6">Expertise Complémentaire</h4>
              <div className="flex gap-4">
                 <input 
                  type="text" 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ex: Quelle est la toxicité pour un enfant ?"
                  className="flex-1 bg-emerald-900/50 border border-emerald-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all text-white placeholder-emerald-700"
                 />
                 <button 
                  onClick={handleAskQuestion}
                  disabled={isChatting || !question.trim()}
                  className="w-16 h-16 bg-lime-500 text-emerald-950 rounded-2xl flex items-center justify-center text-xl shadow-xl hover:bg-lime-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isChatting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
