
import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-fade-in">
      <div className="bg-white rounded-[3rem] p-8 md:p-20 shadow-2xl border border-emerald-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-lime-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-emerald-950 text-lime-400 rounded-3xl flex items-center justify-center text-3xl mb-10 shadow-2xl transform -rotate-3">
            <i className="fas fa-shield-halved"></i>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-emerald-900 mb-6 tracking-tighter leading-none">Charte de Confidentialité & <br/><span className="text-lime-600">Protection des Savoirs</span></h1>
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Version 2.1.0</span>
            <span className="text-gray-400 text-xs font-medium italic">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>

          <div className="prose prose-emerald max-w-none space-y-12 text-gray-600 leading-relaxed">
            
            {/* Clause de modification - DEMANDE UTILISATEUR */}
            <section className="bg-lime-50 p-8 rounded-[2rem] border border-lime-100">
              <h2 className="text-2xl font-black text-emerald-900 mb-4 flex items-center">
                <i className="fas fa-pen-nib mr-4 text-lime-600"></i>
                Modification de la Politique
              </h2>
              <p className="text-emerald-900 font-medium">
                <strong>Forest Apothecary se réserve le droit discrétionnaire de modifier, compléter ou mettre à jour la présente politique à tout moment</strong>, afin de refléter les évolutions législatives, technologiques ou les changements dans nos services. 
                <br/><br/>
                Toute modification substantielle vous sera notifiée par e-mail ou via une alerte sur la plateforme. Votre utilisation continue des services après la publication des modifications vaut acceptation sans réserve de la nouvelle version de la politique. Nous vous encourageons à consulter cette page régulièrement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-emerald-900 mb-4">1. Engagement Éthique et Botanique</h2>
              <p>
                Forest Apothecary n'est pas seulement une application, c'est un sanctuaire numérique. Nous nous engageons à protéger vos données personnelles avec la même rigueur que nous protégeons les espèces en voie de disparition. Notre politique repose sur le principe de <strong>Souveraineté des Données</strong> : vous restez maître de ce que vous partagez.
              </p>
            </section>

            <section className="bg-orange-50 border-l-8 border-orange-400 p-8 rounded-r-[2rem]">
              <h2 className="text-2xl font-black text-orange-950 mb-4 flex items-center">
                <i className="fas fa-exclamation-triangle mr-4"></i>
                Clause de Non-Responsabilité Médicale
              </h2>
              <p className="text-orange-900 font-bold mb-4">
                IMPORTANT : Forest Apothecary est un outil de documentation botanique et culturelle. 
              </p>
              <p className="text-orange-900/80 text-sm">
                L'entreprise décline toute responsabilité en cas de réactions allergiques, d'intoxications ou d'échecs thérapeutiques liés à l'usage des plantes mentionnées. L'identification par IA a une marge d'erreur inhérente à la technologie. **L'utilisateur assume l'entière responsabilité des risques liés à la cueillette et à la consommation de plantes.** Une consultation médicale reste obligatoire pour toute pathologie.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-emerald-900 mb-6 flex items-center">
                <span className="w-10 h-10 bg-emerald-900 text-white rounded-xl flex items-center justify-center mr-4 text-sm font-bold shadow-lg">2</span>
                Données Collectées & Traitement
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-emerald-100 rounded-2xl shadow-sm">
                  <h4 className="font-black text-emerald-900 uppercase text-xs mb-3 flex items-center">
                    <i className="fas fa-id-card mr-2 text-emerald-500"></i> Identification
                  </h4>
                  <p className="text-xs">Nom, prénom, email, photo de profil et historique de navigation pour personnaliser votre expérience.</p>
                </div>
                <div className="p-6 bg-white border border-emerald-100 rounded-2xl shadow-sm">
                  <h4 className="font-black text-emerald-900 uppercase text-xs mb-3 flex items-center">
                    <i className="fas fa-microscope mr-2 text-emerald-500"></i> Données d'IA
                  </h4>
                  <p className="text-xs">Les photos de plantes que vous téléchargez sont analysées pour améliorer nos modèles de reconnaissance. Elles sont anonymisées avant tout traitement algorithmique.</p>
                </div>
                <div className="p-6 bg-white border border-emerald-100 rounded-2xl shadow-sm">
                  <h4 className="font-black text-emerald-900 uppercase text-xs mb-3 flex items-center">
                    <i className="fas fa-map-location-dot mr-2 text-emerald-500"></i> Géolocalisation
                  </h4>
                  <p className="text-xs">Utilisée uniquement pour cartographier la biodiversité locale et vous signaler les praticiens à proximité.</p>
                </div>
                <div className="p-6 bg-white border border-emerald-100 rounded-2xl shadow-sm">
                  <h4 className="font-black text-emerald-900 uppercase text-xs mb-3 flex items-center">
                    <i className="fas fa-wallet mr-2 text-emerald-500"></i> Transactions
                  </h4>
                  <p className="text-xs">Vos données bancaires sont traitées par nos partenaires certifiés (Stripe, ForestPay). Nous ne stockons jamais vos codes secrets.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-emerald-900 mb-4">3. Lutte contre la Biopiraterie</h2>
              <p>
                Forest Apothecary s'oppose à l'appropriation illégitime des savoirs ancestraux. En contribuant à la plateforme :
              </p>
              <ul className="list-none space-y-4 pl-0">
                <li className="flex items-start bg-emerald-50 p-4 rounded-xl">
                  <i className="fas fa-shield-virus text-emerald-600 mt-1 mr-4"></i>
                  <span className="text-sm">Vous garantissez que le savoir partagé est destiné au bien commun et non à un dépôt de brevet privé.</span>
                </li>
                <li className="flex items-start bg-emerald-50 p-4 rounded-xl">
                  <i className="fas fa-handshake text-emerald-600 mt-1 mr-4"></i>
                  <span className="text-sm">L'entreprise s'engage à ne jamais vendre vos contributions spécifiques à des laboratoires pharmaceutiques sans accord de partage de bénéfices avec les communautés sources.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-emerald-900 mb-6 flex items-center">
                <span className="w-10 h-10 bg-emerald-900 text-white rounded-xl flex items-center justify-center mr-4 text-sm font-bold shadow-lg">4</span>
                Vos Droits RGPD & Suppression
              </h2>
              <p className="mb-6">
                Vous disposez d'un contrôle total. À tout moment, vous pouvez solliciter l'exportation de vos données ou leur suppression définitive ("Droit à l'oubli").
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-emerald-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-800 transition-all">
                  Télécharger mes données
                </button>
                <button className="px-6 py-3 bg-red-50 text-red-500 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                  Supprimer mon compte
                </button>
              </div>
            </section>

            <section className="pt-12 border-t border-emerald-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-xl font-black text-emerald-950 mb-2">Besoin d'éclaircissements ?</h3>
                  <p className="text-sm text-gray-500">Notre Délégué à la Protection des Données (DPO) vous répond sous 48h.</p>
                </div>
                <a href="mailto:privacy@forestapothecary.org" className="px-10 py-4 bg-lime-500 text-emerald-950 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-lime-400 transition-all">
                  Contacter le DPO
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
