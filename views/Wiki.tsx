
import React, { useState } from 'react';
import { PLANTS } from '../constants';
import { Plant, ValidationStatus } from '../types';

interface WikiProps {
  onSelectPlant: (plant: Plant) => void;
}

export const Wiki: React.FC<WikiProps> = ({ onSelectPlant }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<ValidationStatus | 'ALL'>('ALL');

  const filteredPlants = PLANTS.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = p.commonName.toLowerCase().includes(term) || 
                          p.scientificName.toLowerCase().includes(term) ||
                          p.localNames.some(ln => ln.toLowerCase().includes(term));
    const matchesFilter = filter === 'ALL' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-16 gap-8">
        <div className="max-w-2xl">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-950 text-lime-400 rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-xl mb-6 md:mb-8">
             <i className="fas fa-dna"></i>
          </div>
          <h1 className="text-3xl md:text-6xl font-black text-emerald-900 mb-4 md:mb-6 tracking-tighter text-balance">Encyclopédie Forest</h1>
          <p className="text-gray-500 text-base md:text-lg font-light leading-relaxed">
            Découvrez des siècles de sagesse médicinale africaine. Chaque fiche est compilée par des experts et croisée avec la science mondiale.
          </p>
        </div>
        <div className="flex items-center space-x-4 md:space-x-6 text-emerald-950 font-black text-[10px] md:text-xs uppercase tracking-widest">
           <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl mb-1">{PLANTS.length}</span>
              <span className="opacity-40">Espèces</span>
           </div>
           <div className="w-px h-8 md:h-10 bg-emerald-100"></div>
           <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl mb-1">{PLANTS.filter(p => p.status === ValidationStatus.VALIDATED).length}</span>
              <span className="opacity-40">Validées</span>
           </div>
        </div>
      </div>

      {/* Control Bar: Redesigned for Mobile UX */}
      <div className="space-y-4 mb-12 md:mb-16 sticky top-20 md:top-24 z-30">
        {/* Search */}
        <div className="relative group shadow-2xl shadow-emerald-900/5">
          <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-emerald-200 transition-colors group-focus-within:text-emerald-500"></i>
          <input 
            type="text" 
            placeholder="Rechercher une plante ou un usage..."
            className="w-full pl-14 md:pl-16 pr-6 py-4 md:py-5 rounded-2xl md:rounded-[2rem] border-none bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-emerald-950 placeholder-emerald-200 text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filters: Horizontal Scrollable Chips WITHOUT visible scrollbar */}
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
          {[
            { id: 'ALL', label: 'Tout', icon: 'fa-layer-group' },
            { id: ValidationStatus.VALIDATED, label: 'Certifié', icon: 'fa-certificate' },
            { id: ValidationStatus.PENDING, label: 'En étude', icon: 'fa-hourglass' }
          ].map(btn => (
            <button 
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`flex-shrink-0 flex items-center space-x-3 px-5 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border ${
                filter === btn.id 
                  ? 'bg-emerald-950 text-white border-emerald-950 shadow-xl' 
                  : 'bg-white text-emerald-400 border-emerald-50 hover:border-lime-200 shadow-sm'
              }`}
            >
              <i className={`fas ${btn.icon} text-xs md:text-sm`}></i>
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {filteredPlants.length > 0 ? filteredPlants.map(plant => (
          <div 
            key={plant.id} 
            className="group bg-white rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-xl border border-emerald-50 hover:shadow-2xl hover:border-lime-200 transition-all duration-500 cursor-pointer hover:-translate-y-2 flex flex-col"
            onClick={() => onSelectPlant(plant)}
          >
            <div className="relative h-64 md:h-72 overflow-hidden">
              <img 
                src={plant.imageUrl} 
                alt={plant.commonName} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="glass px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-950 flex items-center shadow-xl">
                   <i className="fas fa-globe-africa text-emerald-600 mr-2"></i>
                   {plant.region}
                </div>
              </div>
            </div>
            <div className="p-8 md:p-10 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                 <h3 className="text-2xl md:text-3xl font-black text-emerald-900 leading-tight tracking-tighter group-hover:text-emerald-700 transition-colors">
                   {plant.commonName}
                 </h3>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-lg flex-shrink-0 ${
                   plant.status === ValidationStatus.VALIDATED ? 'bg-lime-500 text-emerald-950' : 'bg-orange-400 text-white'
                 }`}>
                   <i className={`fas ${plant.status === ValidationStatus.VALIDATED ? 'fa-check' : 'fa-clock'}`}></i>
                 </div>
              </div>
              <p className="text-emerald-400 italic font-light mb-6 md:mb-8 text-sm">{plant.scientificName}</p>
              
              <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
                {plant.uses.slice(0, 3).map(use => (
                  <span key={use} className="px-3 py-1.5 bg-gray-50 text-gray-400 text-[10px] rounded-lg font-black uppercase tracking-widest border border-gray-100 group-hover:border-lime-100 transition-colors">
                    {use}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-6 md:pt-8 border-t border-emerald-50 flex items-center justify-between">
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white bg-emerald-100 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=${plant.id}${i}`} alt="Practitioner" className="w-full h-full object-cover" />
                     </div>
                   ))}
                   <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white bg-emerald-950 text-white flex items-center justify-center text-[9px] md:text-[10px] font-bold">
                     +5
                   </div>
                </div>
                <button className="flex items-center space-x-3 text-emerald-700 font-black text-[10px] uppercase tracking-widest group/btn">
                  <span>Détails</span>
                  <i className="fas fa-chevron-right text-[8px] group-hover/btn:translate-x-1 transition-transform"></i>
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center">
             <i className="fas fa-seedling text-6xl text-emerald-100 mb-6"></i>
             <h3 className="text-2xl font-black text-emerald-900 mb-2">Aucun résultat trouvé</h3>
             <p className="text-gray-400">Essayez une autre recherche ou réinitialisez les filtres.</p>
          </div>
        )}
      </div>
    </div>
  );
};
