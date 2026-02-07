
import React, { useState } from 'react';

interface PractitionerApplyProps {
  onBack: () => void;
}

export const PractitionerApply: React.FC<PractitionerApplyProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    specialty: '',
    experience: '',
    portfolio: ''
  });

  const downloadGuidelines = () => {
    try {
      const { jsPDF } = (window as any).jspdf;
      const doc = new jsPDF();
      
      const emerald = [6, 78, 59]; // #064e3b
      const lime = [132, 204, 22]; // #84cc16
      const white = [255, 255, 255];
      const gray = [240, 240, 240];
      
      const margin = 20;
      let y = 15;

      // --- Header / Background Top ---
      doc.setFillColor(...emerald);
      doc.rect(0, 0, 210, 50, 'F');
      
      // --- Logo Graphic (Styled F) ---
      doc.setFillColor(...lime);
      doc.roundedRect(margin, 12, 14, 14, 3, 3, 'F');
      doc.setTextColor(...emerald);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("F", margin + 4.5, 22.5);
      
      doc.setTextColor(...white);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("FOREST APOTHECARY", margin + 18, 23);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("LEADERSHIP DANS LA PHARMACOPÉE AFRICAINE", margin + 18, 29);

      y = 65;

      // --- Title ---
      doc.setTextColor(...emerald);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("CHARTE D'ÉLIGIBILITÉ DES EXPERTS", margin, y);
      
      // Decorative lime line
      doc.setDrawColor(...lime);
      doc.setLineWidth(1.5);
      doc.line(margin, y + 3, margin + 50, y + 3);
      y += 15;

      // --- Body Sections ---
      const drawSection = (title: string, items: string[]) => {
        doc.setTextColor(...emerald);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(title, margin, y);
        y += 8;
        
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        items.forEach(item => {
          const splitText = doc.splitTextToSize(item, 170);
          doc.text(splitText, margin + 5, y);
          y += (splitText.length * 5) + 2;
        });
        y += 5;
      };

      drawSection("I. PRÉ-REQUIS PROFESSIONNELS", [
        "- Justifier d'une pratique clinique ou traditionnelle d'au moins 5 années consécutives.",
        "- Diplômes académiques ou attestations de reconnaissance herboriste par les autorités locales.",
        "- Engagement strict sur la transparence des protocoles et l'origine des échantillons végétaux.",
        "- Respect scrupuleux des limites de toxicité définies par le Comité Scientifique Forest."
      ]);

      drawSection("II. PROCESSUS DE VALIDATION ET ENTRETIEN", [
        "- Phase 1 : Audit administratif et vérification des références professionnelles (72h).",
        "- Phase 2 : Entretien technique approfondi mené par un EXPERT DÉLÉGUÉ certifié par la plateforme.",
        "- Phase 3 : Validation finale par le Comité et signature du contrat de publication expert."
      ]);

      drawSection("III. CADRE FINANCIER ET RÉMUNÉRATION", [
        "- Frais d'adhésion et étude de dossier : 25 000 CFA (paiement unique à l'homologation).",
        "- Redevance Cloud Expert : 10 000 CFA / mois (accès IA Labs, outils de publication et CRM).",
        "- Revenus : 70% de la valeur des recettes vendues via le portail premium sont reversés à l'auteur."
      ]);

      // --- Signature Block Design ---
      y = 225;
      doc.setFillColor(...gray);
      doc.roundedRect(margin, y, 170, 50, 5, 5, 'F');
      
      doc.setTextColor(...emerald);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("CERTIFIÉ POUR DIFFUSION CONTRACTUELLE,", margin + 10, y + 10);
      
      // Fancy Signature Rendering
      doc.setFont("times", "italic");
      doc.setFontSize(26);
      doc.setTextColor(30, 30, 30);
      doc.text("Dr. Remus", margin + 105, y + 25);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...emerald);
      doc.text("Dr. Remus", margin + 105, y + 33);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("CEO & Fondateur, Forest Apothecary", margin + 105, y + 38);
      
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(`Identifiant Document : FA-DOC-${Math.floor(Math.random()*90000) + 10000} | Date : ${new Date().toLocaleDateString()}`, margin + 10, y + 44);

      doc.save("Forest_Apothecary_Charte_Eligibilite.pdf");
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Une erreur est survenue lors de la création du PDF.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulation d'envoi au backend admin
    const applicationPayload = {
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'PENDING_REVIEW'
    };
    
    console.log("Transmission des données à l'administration...", applicationPayload);
    
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2500);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center animate-fade-in">
        <div className="w-24 h-24 bg-emerald-950 text-lime-400 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-8 shadow-2xl rotate-3">
          <i className="fas fa-paper-plane"></i>
        </div>
        <h1 className="text-4xl font-black text-emerald-900 mb-6 tracking-tighter">Dossier Transmis</h1>
        <p className="text-gray-500 text-lg font-light leading-relaxed mb-12 max-w-md mx-auto">
          Votre candidature a été envoyée à l'administration pour étude. Un <b>Expert Délégué</b> vous contactera pour fixer votre entretien technique.
        </p>
        <button onClick={onBack} className="px-12 py-5 bg-emerald-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-lime-500 hover:text-emerald-950 transition-all">Retour au Portail</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
      <div className="grid lg:grid-cols-12 gap-16 items-start">
        {/* Colonne d'Information */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-emerald-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5"><i className="fas fa-shield-halved text-9xl"></i></div>
            <h1 className="text-4xl font-black mb-6 tracking-tighter leading-none">Rejoignez nos <br/><span className="text-lime-400">Experts Certifiés</span></h1>
            <p className="text-emerald-100/60 font-medium leading-relaxed mb-10">
              Forest Apothecary structure la pharmacopée africaine. Votre savoir mérite un cadre rigoureux et une juste rémunération.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 bg-emerald-950/40 p-6 rounded-3xl border border-emerald-800/50">
                 <div className="w-10 h-10 bg-lime-500 text-emerald-950 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"><i className="fas fa-user-check"></i></div>
                 <div>
                    <h4 className="font-black text-sm uppercase tracking-wider">Expertise Déléguée</h4>
                    <p className="text-xs text-emerald-400">Évaluation par des pairs herboristes certifiés pour une qualité garantie.</p>
                 </div>
              </div>
              <div className="flex items-start space-x-4 bg-emerald-950/40 p-6 rounded-3xl border border-emerald-800/50">
                 <div className="w-10 h-10 bg-lime-500 text-emerald-950 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"><i className="fas fa-coins"></i></div>
                 <div>
                    <h4 className="font-black text-sm uppercase tracking-wider">Modèle de Revenus</h4>
                    <p className="text-xs text-emerald-400">Percevez 70% de royalties sur chaque consultation et vente de recette.</p>
                 </div>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-emerald-800">
               <button 
                 onClick={downloadGuidelines}
                 className="w-full py-5 bg-white text-emerald-950 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-lime-500 hover:text-emerald-950 transition-all flex items-center justify-center space-x-3 group"
               >
                  <i className="fas fa-file-pdf text-xl text-red-500 group-hover:scale-110 transition-transform"></i>
                  <span>Télécharger la Charte des Experts</span>
               </button>
               <p className="text-[9px] text-center mt-4 text-emerald-500 font-bold uppercase tracking-widest italic">Document officiel signé par Dr. Remus, CEO</p>
            </div>
          </div>
        </div>

        {/* Colonne Formulaire */}
        <div className="lg:col-span-7">
           <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-emerald-50">
              <h2 className="text-3xl font-black text-emerald-950 mb-10 tracking-tighter">Dossier de Candidature</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nom et Prénom</label>
                       <input 
                        required 
                        type="text" 
                        placeholder="Ex: Pr. Amadou Touré" 
                        className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none outline-none focus:ring-2 focus:ring-lime-500 transition-all font-bold text-emerald-950" 
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Pro</label>
                       <input 
                        required 
                        type="email" 
                        placeholder="expert@forest.org" 
                        className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none outline-none focus:ring-2 focus:ring-lime-500 transition-all font-bold text-emerald-950" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Spécialité Principale</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Herboristerie, Ethnobotanique, Phytothérapie..." 
                      className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none outline-none focus:ring-2 focus:ring-lime-500 transition-all font-bold text-emerald-950" 
                      value={formData.specialty}
                      onChange={e => setFormData({...formData, specialty: e.target.value})}
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Résumé d'expérience (Années, Lieux, Savoirs)</label>
                    <textarea 
                      rows={4} 
                      placeholder="Décrivez votre parcours et vos maîtres de formation..." 
                      className="w-full px-8 py-6 rounded-[2rem] bg-emerald-50/50 border-none outline-none focus:ring-2 focus:ring-lime-500 transition-all resize-none text-emerald-950 text-sm font-medium" 
                      required
                      value={formData.experience}
                      onChange={e => setFormData({...formData, experience: e.target.value})}
                    ></textarea>
                 </div>

                 <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 group">
                    <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-4 flex items-center">
                       <i className="fas fa-upload mr-3 text-lime-600"></i> Dossier de Preuves (Diplômes, ID)
                    </h4>
                    <div className="border-2 border-dashed border-emerald-200 rounded-2xl p-8 text-center hover:bg-white cursor-pointer transition-all hover:border-lime-500">
                       <i className="fas fa-cloud-arrow-up text-3xl text-emerald-300 mb-3 group-hover:text-lime-500 transition-colors"></i>
                       <p className="text-[10px] font-black text-emerald-400 uppercase">Documents PDF uniquement (Max 15MB)</p>
                    </div>
                 </div>

                 <div className="flex items-center space-x-4 px-4">
                    <input type="checkbox" required className="w-5 h-5 rounded accent-emerald-900" />
                    <label className="text-[11px] font-medium text-gray-500 leading-tight">
                      Je confirme l'exactitude des informations et j'accepte le processus d'évaluation technique par l'Expert Délégué.
                    </label>
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full py-6 bg-emerald-950 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-lime-500 hover:text-emerald-950 transition-all flex items-center justify-center"
                 >
                   {loading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-shield-check mr-3"></i>}
                   <span>{loading ? 'Télétransmission du dossier...' : 'Soumettre à l\'administration'}</span>
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};
