
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PRACTITIONERS } from '../constants';
import { Practitioner } from '../types';

export const Network: React.FC = () => {
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter and sort practitioners
  const displayPractitioners = useMemo(() => {
    let filtered = PRACTITIONERS.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (userCoords) {
      filtered = [...filtered].sort((a, b) => {
        const distA = calculateDistance(userCoords.lat, userCoords.lng, a.lat, a.lng);
        const distB = calculateDistance(userCoords.lat, userCoords.lng, b.lat, b.lng);
        return distA - distB;
      });
    }

    return filtered;
  }, [searchTerm, userCoords]);

  // Effect for map initialization
  useEffect(() => {
    const L = (window as any).L;
    if (!L) return;

    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        scrollWheelZoom: false
      }).setView([7.3697, 12.3547], 6); // Centered on Cameroon

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CartoDB'
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Effect for updating markers when practitioners list changes
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Custom Icons
    const certifiedIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="w-10 h-10 bg-emerald-600 border-4 border-white rounded-2xl shadow-xl flex items-center justify-center text-white transform -rotate-45 hover:rotate-0 transition-transform duration-300"><i class="fas fa-certificate rotate-45"></i></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    const standardIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="w-8 h-8 bg-gray-400 border-2 border-white rounded-xl shadow-lg flex items-center justify-center text-white transform -rotate-45 transition-all"><i class="fas fa-user-md rotate-45"></i></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    displayPractitioners.forEach(p => {
      const marker = L.marker([p.lat, p.lng], { 
        icon: p.certified ? certifiedIcon : standardIcon 
      }).addTo(mapRef.current);

      const popupContent = `
        <div class="p-4 min-w-[200px]">
          <div class="flex items-center space-x-2 mb-2">
            <span class="text-[10px] font-black uppercase tracking-widest ${p.certified ? 'text-emerald-600' : 'text-gray-400'}">
              ${p.certified ? '<i class="fas fa-check-circle mr-1"></i> Certifié' : 'Praticien'}
            </span>
          </div>
          <h3 class="font-black text-emerald-950 text-lg mb-1">${p.name}</h3>
          <p class="text-xs text-emerald-600 font-bold mb-3 uppercase tracking-tighter">${p.specialty}</p>
          <div class="text-[10px] text-gray-500 mb-4">
            <i class="fas fa-location-dot mr-1"></i> ${p.location}
          </div>
          <a href="tel:${p.phone}" class="block w-full text-center bg-emerald-950 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest no-underline hover:bg-emerald-800 transition-colors">
            Appeler
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-leaflet-popup',
        closeButton: false
      });
      markersRef.current.push(marker);
    });

    // If there's only one result, auto-focus
    if (displayPractitioners.length === 1) {
      mapRef.current.setView([displayPractitioners[0].lat, displayPractitioners[0].lng], 12);
    }
  }, [displayPractitioners]);

  const handleGeolocation = () => {
    setGeoStatus('loading');
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserCoords(coords);
        setGeoStatus('success');

        const L = (window as any).L;
        if (mapRef.current) {
          mapRef.current.setView([coords.lat, coords.lng], 12);
          L.circle([coords.lat, coords.lng], {
            color: '#10b981',
            fillColor: '#10b981',
            fillOpacity: 0.1,
            radius: 2000
          }).addTo(mapRef.current);
          
          L.marker([coords.lat, coords.lng], {
            icon: L.divIcon({
              className: 'user-loc',
              html: `<div class="relative flex items-center justify-center"><div class="absolute animate-ping w-8 h-8 bg-lime-400 rounded-full opacity-75"></div><div class="w-4 h-4 bg-emerald-600 border-2 border-white rounded-full z-10 shadow-xl"></div></div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })
          }).addTo(mapRef.current).bindPopup('<b class="text-[10px] font-black uppercase">Ma Position</b>').openPopup();
        }
      },
      () => setGeoStatus('error')
    );
  };

  const focusOnPractitioner = (p: Practitioner) => {
    if (mapRef.current) {
      mapRef.current.setView([p.lat, p.lng], 14, { animate: true });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-emerald-100 text-emerald-800 rounded-[1.5rem] md:rounded-[2rem] shadow-xl mb-6 md:mb-8">
           <i className="fas fa-map-location-dot text-3xl md:text-4xl"></i>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-emerald-900 mb-4 md:mb-6 tracking-tighter">Réseau Géographique</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed px-4 mb-10">
          Localisez les experts en pharmacopée les plus proches. Les profils certifiés garantissent une pratique validée par nos comités botaniques.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative group">
          <i className="fas fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-emerald-200 transition-colors group-focus-within:text-emerald-500"></i>
          <input 
            type="text" 
            placeholder="Rechercher par nom ou spécialité (ex: Maître Herboriste)"
            className="w-full pl-16 pr-8 py-5 rounded-[2rem] border-none bg-white shadow-xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-medium text-emerald-950 placeholder-emerald-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 md:gap-12">
        {/* Map Panel */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="relative group">
            <div id="map" className="z-10 shadow-2xl rounded-[2.5rem] md:rounded-[3.5rem] border-8 border-white overflow-hidden h-[400px] md:h-[600px]"></div>
            
            <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 z-20">
              <button 
                onClick={handleGeolocation}
                disabled={geoStatus === 'loading'}
                className="group flex items-center space-x-4 bg-emerald-950 text-white px-6 md:px-8 py-4 rounded-2xl md:rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-lime-500 hover:text-emerald-950 transition-all active:scale-95"
              >
                <i className={`fas ${geoStatus === 'loading' ? 'fa-spinner fa-spin' : 'fa-location-crosshairs'} text-lg`}></i>
                <span>{geoStatus === 'success' ? 'Ma position active' : 'Près de moi'}</span>
              </button>
            </div>

            <div className="absolute top-6 md:top-10 right-6 md:right-10 z-20 flex flex-col space-y-2">
               <div className="glass px-4 py-2 rounded-xl flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                  <span className="text-[9px] font-black uppercase text-emerald-900">Certifié</span>
               </div>
               <div className="glass px-4 py-2 rounded-xl flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-[9px] font-black uppercase text-emerald-900">Standard</span>
               </div>
            </div>
          </div>
          
          {geoStatus === 'error' && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-100">
               Géo-localisation bloquée par le navigateur.
            </div>
          )}
        </div>

        {/* List Panel */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4 max-h-[600px] md:max-h-[800px] overflow-y-auto custom-scrollbar pr-2">
          {displayPractitioners.length > 0 ? displayPractitioners.map((p) => (
            <div 
              key={p.id} 
              onClick={() => focusOnPractitioner(p)}
              className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border border-emerald-50 hover:border-lime-400 transition-all group cursor-pointer animate-fade-in"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                  p.certified ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : 'bg-gray-50 text-gray-400'
                }`}>
                  <i className={`fas ${p.certified ? 'fa-user-check' : 'fa-user-doctor'}`}></i>
                </div>
                {p.certified && (
                  <div className="bg-lime-100 text-lime-700 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm">
                    Certifié Forest
                  </div>
                )}
              </div>

              <h3 className="text-xl font-black text-emerald-900 mb-2 leading-tight tracking-tighter">{p.name}</h3>
              <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.15em] mb-6">{p.specialty}</p>
              
              <div className="space-y-3 border-t border-emerald-50 pt-6">
                <div className="flex items-center space-x-3 text-gray-400 text-xs font-medium">
                  <i className="fas fa-map-pin text-emerald-200"></i>
                  <span>{p.location}</span>
                </div>
                {userCoords && (
                  <div className="flex items-center space-x-3 text-emerald-600 text-[10px] font-black">
                    <i className="fas fa-route"></i>
                    <span>À environ {calculateDistance(userCoords.lat, userCoords.lng, p.lat, p.lng).toFixed(1)} km</span>
                  </div>
                )}
                <div className="pt-4 flex gap-3">
                   <a 
                    href={`tel:${p.phone}`} 
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 text-center py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg active:scale-95"
                   >
                    Appeler
                   </a>
                   <button className="w-14 h-14 bg-emerald-50 text-emerald-900 rounded-2xl flex items-center justify-center text-sm hover:bg-lime-400 transition-all">
                      <i className="fas fa-message"></i>
                   </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center opacity-30">
               <i className="fas fa-user-slash text-6xl mb-4 text-emerald-950"></i>
               <p className="text-sm font-black uppercase tracking-widest">Aucun résultat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
