
import React, { useState, useEffect, useRef } from 'react';
import { PLANTS, PRACTITIONERS } from '../constants';
import { Plant, Practitioner, Contribution, ValidationStatus, User, UserRole, Recipe, SubscriptionTier, AccessType } from '../types';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PLANTS' | 'CONTRIBS' | 'PRACTITIONERS' | 'USERS' | 'RECIPES' | 'APPLICATIONS'>('CONTRIBS');
  const [localPlants, setLocalPlants] = useState<Plant[]>(PLANTS);
  const [localPractitioners, setLocalPractitioners] = useState<Practitioner[]>(PRACTITIONERS);
  const [localUsers, setLocalUsers] = useState<User[]>([
    { id: '1', name: 'Jean Dupont', email: 'jean@test.com', role: UserRole.USER, hasPremiumAccess: false, createdAt: '2025-01-10' },
    { id: '2', name: 'Marie Kouame', email: 'marie@test.com', role: UserRole.USER, hasPremiumAccess: true, subscriptionTier: SubscriptionTier.PREMIUM_MONTHLY, createdAt: '2025-02-15' },
    { id: 'pract-1', name: 'Papa Samuel', email: 'pract@forest.org', role: UserRole.PRACTITIONER, createdAt: '2024-12-01' }
  ]);

  const [expertApplications, setExpertApplications] = useState<any[]>([
    {
      id: 'app-1',
      name: 'Dr. Moussa Traoré',
      email: 'moussa@clinic-t.com',
      specialty: 'Phytothérapie Malienne',
      status: 'PENDING',
      date: 'Aujourd\'hui',
      experience: '15 ans d\'exercice traditionnel à Bamako.'
    }
  ]);

  const [showAddPractitioner, setShowAddPractitioner] = useState(false);
  const [editingPractitioner, setEditingPractitioner] = useState<Practitioner | null>(null);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  const [newPractitioner, setNewPractitioner] = useState({
    name: '', 
    email: '', 
    password: '', 
    specialty: '', 
    location: '', 
    phone: '', 
    lat: 4.05, 
    lng: 9.7, 
    certified: true,
    address: '',
    city: '',
    country: '',
    region: '',
    hours: '',
    services: '',
    experience: ''
  });

  const [newPlant, setNewPlant] = useState({
    commonName: '', scientificName: '', localNames: '', uses: '', preparation: '', precautions: '', region: '', accessType: 'FREE' as AccessType, price: 0
  });

  const [newUser, setNewUser] = useState({
    name: '', email: '', role: 'USER' as UserRole, hasPremiumAccess: false
  });
  
  const [contribs, setContribs] = useState<Contribution[]>([
    {
      id: 'c1',
      plantName: 'Aloe Africana',
      localName: 'Aloe',
      usage: 'Brûlures et soins de la peau. Très efficace en gel pur sur les plaies.',
      region: 'Afrique du Sud',
      submittedBy: 'Jean-Pierre M.',
      date: '24/05/2025',
      status: 'PENDING',
      reviews: [
        { practitionerId: 'p1', practitionerName: 'Papa Samuel', status: 'VALIDATED', comment: 'Confirmé par nos anciens.', date: 'Hier' }
      ]
    },
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

  const [pendingRecipes, setPendingRecipes] = useState<Recipe[]>([
    {
      id: 'r-rec-1',
      title: 'Tisane Digestive de Samuel',
      description: 'Un mélange ancestral pour soulager les maux d\'estomac lourds.',
      ingredients: ['3 feuilles de Kinkeliba', '1 racine de gingembre', 'Eau bouillante'],
      steps: ['Laver les feuilles', 'Faire infuser 10 min', 'Boire chaud après le repas'],
      authorId: 'pract-1',
      authorName: 'Papa Samuel',
      date: '2025-05-20',
      status: 'PENDING',
      plantId: '2'
    }
  ]);

  useEffect(() => {
    if (activeTab === 'USERS' && chartRef.current) {
      const L = (window as any).Chart;
      if (!L) return;
      if (chartInstance.current) chartInstance.current.destroy();
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new L(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Féb', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Nouveaux Utilisateurs',
            data: [45, 82, 120, 190, 250, 400],
            borderColor: '#10b981',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(16, 185, 129, 0.1)'
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { display: false }, x: { grid: { display: false } } } }
      });
    }
  }, [activeTab]);

  const handleSavePractitioner = (practitioner: Practitioner) => {
    if (editingPractitioner) {
      setLocalPractitioners(prev => prev.map(p => p.id === practitioner.id ? practitioner : p));
      setEditingPractitioner(null);
    } else {
      const newPractitionerWithId = { 
        ...practitioner, 
        id: Date.now().toString(),
        userId: Date.now().toString()
      };
      setLocalPractitioners(prev => [...prev, newPractitionerWithId]);
      
      // Ajouter aussi comme utilisateur
      const newUserFromPractitioner: User = {
        id: newPractitionerWithId.userId!,
        name: practitioner.name,
        email: practitioner.email || '',
        role: UserRole.PRACTITIONER,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setLocalUsers(prev => [...prev, newUserFromPractitioner]);
      
      setShowAddPractitioner(false);
      setNewPractitioner({ 
        name: '', 
        email: '', 
        password: '', 
        specialty: '', 
        location: '', 
        phone: '', 
        lat: 4.05, 
        lng: 9.7, 
        certified: true,
        address: '',
        city: '',
        country: '',
        region: '',
        hours: '',
        services: '',
        experience: ''
      });
    }
  };

  const handleDeletePractitioner = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet expert ?")) {
      setLocalPractitioners(prev => prev.filter(p => p.id !== id));
      setLocalUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleDeletePlant = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette plante ?")) {
      setLocalPlants(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setLocalUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleSavePlant = (plant: Plant) => {
    if (editingPlant) {
      setLocalPlants(prev => prev.map(p => p.id === plant.id ? plant : p));
      setEditingPlant(null);
    } else {
      const newPlantWithId = { ...plant, id: Date.now().toString(), recipes: [], status: ValidationStatus.VALIDATED, imageUrl: '/placeholder-plant.jpg' };
      setLocalPlants(prev => [...prev, newPlantWithId]);
      setShowAddPlant(false);
      setNewPlant({ commonName: '', scientificName: '', localNames: '', uses: '', preparation: '', precautions: '', region: '', accessType: 'FREE' as AccessType, price: 0 });
    }
  };

  const handleSaveUser = (user: User) => {
    if (editingUser) {
      setLocalUsers(prev => prev.map(u => u.id === user.id ? user : u));
      setEditingUser(null);
    } else {
      const newUserWithId = { ...user, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] };
      setLocalUsers(prev => [...prev, newUserWithId]);
      setShowAddUser(false);
      setNewUser({ name: '', email: '', role: 'USER' as UserRole, hasPremiumAccess: false });
    }
  };

  const handleApproveRecipe = (recipe: Recipe) => {
    setPendingRecipes(prev => prev.filter(r => r.id !== recipe.id));
    setLocalPlants(prev => prev.map(p => p.id === recipe.plantId ? { ...p, recipes: [...p.recipes, { ...recipe, status: 'APPROVED' }] } : p));
    alert(`La recette "${recipe.title}" est maintenant publique.`);
  };

  const togglePremium = (userId: string) => {
    setLocalUsers(prev => prev.map(u => u.id === userId ? {
      ...u, 
      hasPremiumAccess: !u.hasPremiumAccess, 
      subscriptionTier: !u.hasPremiumAccess ? SubscriptionTier.PREMIUM_MONTHLY : undefined 
    } : u));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-emerald-900 tracking-tighter">Administration Centrale</h1>
          <p className="text-emerald-500 font-bold uppercase tracking-widest text-[10px] mt-2 flex items-center">
             <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse mr-2"></span>
             Contrôle de la Pharmacopée Numérique
          </p>
        </div>
        <div className="flex bg-white p-2 rounded-2xl shadow-xl border border-emerald-50 overflow-x-auto scroll-hide">
          {[
            { id: 'CONTRIBS', label: 'Validations', icon: 'fa-gavel', badge: contribs.filter(c => c.status === 'PENDING').length },
            { id: 'APPLICATIONS', label: 'Candidatures', icon: 'fa-user-tie', badge: expertApplications.filter(a => a.status === 'PENDING').length },
            { id: 'RECIPES', label: 'Recettes', icon: 'fa-mortar-pestle', badge: pendingRecipes.length },
            { id: 'PRACTITIONERS', label: 'Praticiens', icon: 'fa-user-md' },
            { id: 'PLANTS', label: 'Catalogue', icon: 'fa-leaf' },
            { id: 'USERS', label: 'Membres', icon: 'fa-users' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-3 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-emerald-950 text-white shadow-lg' : 'text-emerald-400 hover:bg-emerald-50'
              }`}
            >
              <i className={`fas ${tab.icon}`}></i>
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.badge ? <span className="bg-lime-500 text-emerald-950 px-2 py-0.5 rounded-full text-[8px]">{tab.badge}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] p-6 md:p-12 shadow-2xl border border-emerald-50 min-h-[600px]">
        
        {/* TAB: APPLICATIONS */}
        {activeTab === 'APPLICATIONS' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-black text-emerald-900 tracking-tight">Dossiers Experts à Réviser</h2>
            <div className="grid gap-6">
              {expertApplications.map(app => (
                <div key={app.id} className="p-8 bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="flex-1">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-800 text-xl font-black">
                           {app.name.charAt(0)}
                        </div>
                        <div>
                           <h3 className="font-black text-xl text-emerald-950 tracking-tight">{app.name}</h3>
                           <p className="text-[10px] font-black uppercase text-emerald-400">{app.specialty} • {app.email}</p>
                        </div>
                     </div>
                     <p className="text-sm text-gray-500 italic mb-6">"{app.experience}"</p>
                     <div className="flex gap-4">
                        <button className="px-5 py-2.5 bg-white border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:bg-emerald-100 transition-all">
                           <i className="fas fa-file-pdf mr-2 text-red-400"></i> Voir Diplômes
                        </button>
                        <button className="px-5 py-2.5 bg-white border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:bg-emerald-100 transition-all">
                           <i className="fas fa-calendar-check mr-2 text-emerald-500"></i> Planifier Entretien
                        </button>
                     </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                     <button className="flex-1 md:flex-none px-8 py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-lime-500 hover:text-emerald-950 transition-all">Accepter</button>
                     <button className="flex-1 md:flex-none px-8 py-4 bg-white text-red-400 border border-red-100 rounded-2xl font-black text-[10px] uppercase">Refuser</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'CONTRIBS' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-emerald-900 tracking-tight">Soumissions à Approuver</h2>
              <div className="flex gap-2">
                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black">
                  {contribs.filter(c => c.status === 'PENDING').length} En attente
                </span>
                <span className="px-4 py-2 bg-lime-100 text-lime-700 rounded-full text-[10px] font-black">
                  {contribs.filter(c => c.status === 'APPROVED').length} Approuvées
                </span>
              </div>
            </div>
            <div className="space-y-6">
              {contribs.map(c => (
                <div key={c.id} className={`p-8 rounded-[2.5rem] border transition-all ${
                  c.status === 'PENDING' ? 'bg-emerald-50/50 border-emerald-100 shadow-lg' : 
                  c.status === 'APPROVED' ? 'bg-lime-50/50 border-lime-100' : 
                  'bg-red-50/50 border-red-100 opacity-75'
                }`}>
                  {/* En-tête avec statut */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black text-emerald-950">{c.plantName}</h3>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                          c.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                          c.status === 'APPROVED' ? 'bg-lime-100 text-lime-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {c.status === 'PENDING' ? 'EN ATTENTE' : 
                           c.status === 'APPROVED' ? 'APPROUVÉE' : 
                           'REJETÉE'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Soumis par <span className="font-bold text-emerald-700">{c.submittedBy}</span> • {c.date}
                      </p>
                    </div>
                    {c.imageUrl && (
                      <img 
                        src={c.imageUrl} 
                        alt={c.plantName} 
                        className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md"
                      />
                    )}
                  </div>

                  {/* Informations complètes de la plante */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-emerald-700 mb-2">Nom Local</h4>
                        <p className="text-lg font-medium text-gray-800 bg-white px-4 py-2 rounded-lg border border-emerald-100">
                          {c.localName}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-emerald-700 mb-2">Région</h4>
                        <p className="text-lg font-medium text-gray-800 bg-white px-4 py-2 rounded-lg border border-emerald-100">
                          <i className="fas fa-map-marker-alt text-emerald-500 mr-2"></i>{c.region}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-emerald-700 mb-2">Usage Traditionnel</h4>
                        <div className="bg-white px-4 py-3 rounded-lg border border-emerald-100">
                          <p className="text-gray-800 leading-relaxed">{c.usage}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section des avis des praticiens */}
                  {c.reviews && c.reviews.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-[10px] font-black uppercase text-emerald-700 mb-3">
                        Avis des Experts ({c.reviews.length})
                      </h4>
                      <div className="space-y-3">
                        {c.reviews.map((review, index) => (
                          <div key={index} className="bg-white p-4 rounded-xl border border-emerald-100">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-bold text-emerald-800">{review.practitionerName}</span>
                                <span className={`ml-2 px-2 py-1 rounded text-[8px] font-black ${
                                  review.status === 'VALIDATED' ? 'bg-lime-100 text-lime-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {review.status === 'VALIDATED' ? 'VALIDÉ' : 'CONTESTÉ'}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-sm text-gray-700 italic">"{review.comment}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {c.status === 'PENDING' && (
                    <div className="flex gap-4 pt-6 border-t border-emerald-200">
                      <button 
                        onClick={() => {
                          setContribs(prev => prev.map(contrib => 
                            contrib.id === c.id ? {...contrib, status: 'APPROVED'} : contrib
                          ));
                          alert(`La soumission "${c.plantName}" a été approuvée.`);
                        }}
                        className="flex-1 px-6 py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-lime-500 hover:text-emerald-950 transition-all"
                      >
                        <i className="fas fa-check mr-2"></i>Approuver
                      </button>
                      <button 
                        onClick={() => {
                          setContribs(prev => prev.map(contrib => 
                            contrib.id === c.id ? {...contrib, status: 'REJECTED'} : contrib
                          ));
                          alert(`La soumission "${c.plantName}" a été rejetée.`);
                        }}
                        className="flex-1 px-6 py-4 bg-white text-red-400 border border-red-100 rounded-2xl font-black text-[10px] uppercase"
                      >
                        <i className="fas fa-times mr-2"></i>Rejeter
                      </button>
                      <button className="px-6 py-4 bg-white text-emerald-600 border border-emerald-100 rounded-2xl font-black text-[10px] uppercase">
                        <i className="fas fa-comment mr-2"></i>Demander plus d'infos
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'USERS' && (
          <div className="space-y-8 animate-fade-in">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-black text-emerald-900 tracking-tight">Utilisateurs & Audience</h2>
               <button 
                 onClick={() => setShowAddUser(true)}
                 className="px-6 py-3 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-lime-500 hover:text-emerald-950 transition-all"
               >
                 <i className="fas fa-user-plus mr-2"></i>Ajouter un Utilisateur
               </button>
             </div>
             <div className="bg-white rounded-3xl border border-emerald-50 overflow-hidden shadow-xl">
               <table className="w-full text-left">
                  <thead className="bg-emerald-950 text-white">
                     <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase">Membre</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase">Email</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase">Rôle</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase">Statut</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase">Inscription</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {localUsers.map(u => (
                        <tr key={u.id} className="border-b border-emerald-50 hover:bg-emerald-50/30 transition-all">
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 font-black">
                                    {u.name.charAt(0)}
                                 </div>
                                 <span className="font-bold">{u.name}</span>
                              </div>
                           </td>
                           <td className="px-8 py-5 text-sm text-gray-600">{u.email}</td>
                           <td className="px-8 py-5">
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                                 u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 
                                 u.role === 'PRACTITIONER' ? 'bg-blue-100 text-blue-700' : 
                                 'bg-gray-100 text-gray-700'
                              }`}>
                                 {u.role}
                              </span>
                           </td>
                           <td className="px-8 py-5">
                              <div className="flex flex-col gap-1">
                                 {u.hasPremiumAccess && (
                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[8px] font-black uppercase">PREMIUM</span>
                                 )}
                                 {u.subscriptionTier && (
                                    <span className="text-[8px] text-gray-500">{u.subscriptionTier}</span>
                                 )}
                              </div>
                           </td>
                           <td className="px-8 py-5 text-[10px] text-gray-500">{u.createdAt}</td>
                           <td className="px-8 py-5 text-right">
                              <div className="flex gap-2 justify-end">
                                 <button 
                                    onClick={() => setEditingUser(u)}
                                    className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-100"
                                 >
                                    <i className="fas fa-edit text-xs"></i>
                                 </button>
                                 <button 
                                    onClick={() => togglePremium(u.id)}
                                    className="px-3 py-1 bg-emerald-50 rounded-lg text-[8px] font-black uppercase text-emerald-700 hover:bg-emerald-100"
                                 >
                                    Premium
                                 </button>
                                 <button 
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-100"
                                 >
                                    <i className="fas fa-trash text-xs"></i>
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'PRACTITIONERS' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-emerald-900 tracking-tight">Praticiens & Experts</h2>
              <button 
                onClick={() => setShowAddPractitioner(true)}
                className="px-6 py-3 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-lime-500 hover:text-emerald-950 transition-all"
              >
                <i className="fas fa-user-plus mr-2"></i>Ajouter un Praticien
              </button>
            </div>
            <div className="grid gap-6">
              {localPractitioners.map(p => (
                <div key={p.id} className="p-8 bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="flex-1">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-800 text-xl font-black">
                           {p.name.charAt(0)}
                        </div>
                        <div>
                           <h3 className="font-black text-xl text-emerald-950 tracking-tight">{p.name}</h3>
                           <p className="text-[10px] font-black uppercase text-emerald-400">{p.specialty} • {p.location}</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div><i className="fas fa-phone text-emerald-500 mr-2"></i>{p.phone}</div>
                        <div><i className="fas fa-map-marker-alt text-emerald-500 mr-2"></i>{p.lat.toFixed(2)}, {p.lng.toFixed(2)}</div>
                        <div><i className="fas fa-certificate text-emerald-500 mr-2"></i>{p.certified ? 'Certifié' : 'Non certifié'}</div>
                        <div><i className="fas fa-envelope text-emerald-500 mr-2"></i>{p.email || 'Non spécifié'}</div>
                     </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                     <button 
                       onClick={() => setEditingPractitioner(p)}
                       className="flex-1 md:flex-none px-6 py-3 bg-white border border-emerald-100 rounded-xl text-[10px] font-black uppercase text-emerald-700 hover:bg-emerald-100 transition-all"
                     >
                        <i className="fas fa-edit mr-2"></i> Modifier
                     </button>
                     <button 
                       onClick={() => handleDeletePractitioner(p.id)}
                       className="flex-1 md:flex-none px-6 py-3 bg-white text-red-400 border border-red-100 rounded-xl text-[10px] font-black uppercase"
                     >
                        <i className="fas fa-trash mr-2"></i> Supprimer
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'RECIPES' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-emerald-900 tracking-tight">Recettes & Préparations</h2>
              <div className="flex gap-2">
                <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black">
                  {pendingRecipes.length} En attente
                </span>
                <span className="px-4 py-2 bg-lime-100 text-lime-700 rounded-full text-[10px] font-black">
                  {localPlants.reduce((acc, plant) => acc + plant.recipes.filter(r => r.status === 'APPROVED').length, 0)} Approuvées
                </span>
              </div>
            </div>

            {/* Recettes en attente */}
            {pendingRecipes.length > 0 && (
              <div>
                <h3 className="text-lg font-black text-emerald-800 mb-4">Recettes en Attente de Validation</h3>
                <div className="space-y-4">
                  {pendingRecipes.map(recipe => (
                    <div key={recipe.id} className="p-6 bg-amber-50/50 border border-amber-100 rounded-[2rem]">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-black text-emerald-950">{recipe.title}</h4>
                          <p className="text-sm text-gray-600">
                            Par {recipe.authorName} • {recipe.date} • 
                            <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[8px] font-black">
                              EN ATTENTE
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="text-[10px] font-black uppercase text-emerald-700 mb-2">Ingrédients</h5>
                          <ul className="space-y-1">
                            {recipe.ingredients.map((ingredient, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-center">
                                <i className="fas fa-check-circle text-lime-500 mr-2 text-xs"></i>
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-[10px] font-black uppercase text-emerald-700 mb-2">Préparation</h5>
                          <ol className="space-y-1">
                            {recipe.steps.map((step, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start">
                                <span className="font-bold text-emerald-600 mr-2">{index + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-amber-200">
                        <button 
                          onClick={() => handleApproveRecipe(recipe)}
                          className="flex-1 px-4 py-3 bg-emerald-950 text-white rounded-xl font-black text-[10px] uppercase shadow-lg hover:bg-lime-500 hover:text-emerald-950 transition-all"
                        >
                          <i className="fas fa-check mr-2"></i>Approuver
                        </button>
                        <button className="flex-1 px-4 py-3 bg-white text-red-400 border border-red-100 rounded-xl font-black text-[10px] uppercase">
                          <i className="fas fa-times mr-2"></i>Rejeter
                        </button>
                        <button className="px-4 py-3 bg-white text-emerald-600 border border-emerald-100 rounded-xl font-black text-[10px] uppercase">
                          <i className="fas fa-comment mr-2"></i>Demander modification
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recettes approuvées */}
            <div>
              <h3 className="text-lg font-black text-emerald-800 mb-4">Recettes Approuvées</h3>
              <div className="grid gap-4">
                {localPlants.map(plant => 
                  plant.recipes
                    .filter(recipe => recipe.status === 'APPROVED')
                    .map(recipe => (
                      <div key={recipe.id} className="p-6 bg-lime-50/50 border border-lime-100 rounded-[2rem]">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-black text-emerald-950">{recipe.title}</h4>
                            <p className="text-sm text-gray-600">
                              Par {recipe.authorName} • {recipe.date} • 
                              <span className="ml-2 px-2 py-1 bg-lime-100 text-lime-700 rounded-full text-[8px] font-black">
                                APPROUVÉE
                              </span>
                            </p>
                            <p className="text-xs text-emerald-600 mt-1">
                              Pour la plante: <span className="font-bold">{plant.commonName}</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-[10px] font-black uppercase text-emerald-700 mb-2">Ingrédients</h5>
                            <ul className="space-y-1">
                              {recipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-center">
                                  <i className="fas fa-check-circle text-lime-500 mr-2 text-xs"></i>
                                  {ingredient}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-[10px] font-black uppercase text-emerald-700 mb-2">Préparation</h5>
                            <ol className="space-y-1">
                              {recipe.steps.map((step, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-start">
                                  <span className="font-bold text-emerald-600 mr-2">{index + 1}.</span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    ))
                )}
                {localPlants.reduce((acc, plant) => acc + plant.recipes.filter(r => r.status === 'APPROVED').length, 0) === 0 && (
                  <div className="text-center py-12">
                    <i className="fas fa-mortar-pestle text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 font-medium">Aucune recette approuvée pour le moment</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'PLANTS' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-emerald-900 tracking-tight">Catalogue Botanique</h2>
              <button 
                onClick={() => setShowAddPlant(true)}
                className="px-6 py-3 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-lime-500 hover:text-emerald-950 transition-all"
              >
                <i className="fas fa-plus mr-2"></i>Ajouter une Plante
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {localPlants.map(p => (
                <div key={p.id} className="bg-white rounded-3xl border border-emerald-50 shadow-md flex flex-col overflow-hidden group">
                  <div className="aspect-video relative overflow-hidden">
                     <img src={p.imageUrl} alt={p.commonName} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                     <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                       <button 
                         onClick={() => setEditingPlant(p)}
                         className="w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-50"
                       >
                         <i className="fas fa-edit text-xs"></i>
                       </button>
                       <button 
                         onClick={() => handleDeletePlant(p.id)}
                         className="w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50"
                       >
                         <i className="fas fa-trash text-xs"></i>
                       </button>
                     </div>
                  </div>
                  <div className="p-6">
                     <h4 className="font-black text-lg text-emerald-950">{p.commonName}</h4>
                     <p className="text-[10px] text-gray-400 italic mb-2">{p.scientificName}</p>
                     <div className="flex flex-wrap gap-1 mb-3">
                       {p.localNames.map((name, i) => (
                         <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[8px] font-medium">{name}</span>
                       ))}
                     </div>
                     <div className="flex items-center justify-between">
                       <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                         p.accessType === 'FREE' ? 'bg-lime-100 text-lime-700' : 'bg-amber-100 text-amber-700'
                       }`}>
                         {p.accessType === 'FREE' ? 'GRATUIT' : `PREMIUM - ${p.price} FCFA`}
                       </span>
                       <span className="text-[8px] text-gray-500">{p.region}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal d'ajout/édition de praticien */}
      {(editingPractitioner || showAddPractitioner) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-emerald-900 mb-6">
              {editingPractitioner ? 'Modifier le Praticien' : 'Ajouter un Praticien'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Nom Complet</label>
                <input 
                  type="text" 
                  value={editingPractitioner?.name || newPractitioner.name}
                  onChange={(e) => editingPractitioner 
                    ? setEditingPractitioner({...editingPractitioner, name: e.target.value})
                    : setNewPractitioner({...newPractitioner, name: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={editingPractitioner?.email || newPractitioner.email}
                  onChange={(e) => editingPractitioner 
                    ? setEditingPractitioner({...editingPractitioner, email: e.target.value})
                    : setNewPractitioner({...newPractitioner, email: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Spécialité</label>
                <input 
                  type="text" 
                  value={editingPractitioner?.specialty || newPractitioner.specialty}
                  onChange={(e) => editingPractitioner 
                    ? setEditingPractitioner({...editingPractitioner, specialty: e.target.value})
                    : setNewPractitioner({...newPractitioner, specialty: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Téléphone</label>
                <input 
                  type="tel" 
                  value={editingPractitioner?.phone || newPractitioner.phone}
                  onChange={(e) => editingPractitioner 
                    ? setEditingPractitioner({...editingPractitioner, phone: e.target.value})
                    : setNewPractitioner({...newPractitioner, phone: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Adresse Complète</label>
                <input 
                  type="text" 
                  value={editingPractitioner?.location || newPractitioner.location}
                  onChange={(e) => editingPractitioner 
                    ? setEditingPractitioner({...editingPractitioner, location: e.target.value})
                    : setNewPractitioner({...newPractitioner, location: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Ville</label>
                <input 
                  type="text" 
                  value={editingPractitioner?.city || newPractitioner.city}
                  onChange={(e) => editingPractitioner 
                    ? setEditingPractitioner({...editingPractitioner, city: e.target.value})
                    : setNewPractitioner({...newPractitioner, city: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Région</label>
                <input 
                  type="text" 
                  value={editingPractitioner?.region || newPractitioner.region}
                  onChange={(e) => editingPractitioner 
                    ? setEditingPractitioner({...editingPractitioner, region: e.target.value})
                    : setNewPractitioner({...newPractitioner, region: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Pays</label>
                <input 
                  type="text" 
                  value={editingPractitioner?.country || newPractitioner.country}
                  onChange={(e) => editingPractitioner 
                    ? setEditingPractitioner({...editingPractitioner, country: e.target.value})
                    : setNewPractitioner({...newPractitioner, country: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Coordonnées GPS pour la carte</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] text-gray-500 mb-1">Latitude</label>
                    <input 
                      type="number" 
                      step="0.0001"
                      value={editingPractitioner?.lat || newPractitioner.lat}
                      onChange={(e) => editingPractitioner 
                        ? setEditingPractitioner({...editingPractitioner, lat: parseFloat(e.target.value)})
                        : setNewPractitioner({...newPractitioner, lat: parseFloat(e.target.value)})
                      }
                      className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-gray-500 mb-1">Longitude</label>
                    <input 
                      type="number" 
                      step="0.0001"
                      value={editingPractitioner?.lng || newPractitioner.lng}
                      onChange={(e) => editingPractitioner 
                        ? setEditingPractitioner({...editingPractitioner, lng: parseFloat(e.target.value)})
                        : setNewPractitioner({...newPractitioner, lng: parseFloat(e.target.value)})
                      }
                      className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Heures d'ouverture</label>
                <input 
                  type="text" 
                  placeholder="Ex: 8h-17h, Lun-Sam"
                  value={editingPractitioner?.hours || newPractitioner.hours}
                  onChange={(e) => editingPractitioner 
                    ? setEditingPractitioner({...editingPractitioner, hours: e.target.value})
                    : setNewPractitioner({...newPractitioner, hours: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Services proposés</label>
                <input 
                  type="text" 
                  placeholder="Ex: Consultations, préparations, diagnostics"
                  value={editingPractitioner?.services || newPractitioner.services}
                  onChange={(e) => editingPractitioner 
                    ? setEditingPractitioner({...editingPractitioner, services: e.target.value})
                    : setNewPractitioner({...newPractitioner, services: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Expérience</label>
                <textarea 
                  placeholder="Décrivez l'expérience et les qualifications du praticien..."
                  value={editingPractitioner?.experience || newPractitioner.experience}
                  onChange={(e) => editingPractitioner 
                    ? setEditingPractitioner({...editingPractitioner, experience: e.target.value})
                    : setNewPractitioner({...newPractitioner, experience: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={editingPractitioner?.certified ?? newPractitioner.certified}
                    onChange={(e) => editingPractitioner 
                      ? setEditingPractitioner({...editingPractitioner, certified: e.target.checked})
                      : setNewPractitioner({...newPractitioner, certified: e.target.checked})
                    }
                    className="w-5 h-5 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-[10px] font-black uppercase text-emerald-700">Praticien Certifié</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => {
                  if (editingPractitioner) {
                    handleSavePractitioner(editingPractitioner);
                  } else {
                    handleSavePractitioner(newPractitioner as Practitioner);
                  }
                }}
                className="flex-1 px-6 py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-lime-500 hover:text-emerald-950 transition-all"
              >
                {editingPractitioner ? 'Mettre à Jour' : 'Ajouter'}
              </button>
              <button 
                onClick={() => {
                  setEditingPractitioner(null);
                  setShowAddPractitioner(false);
                  setNewPractitioner({ 
                    name: '', 
                    email: '', 
                    password: '', 
                    specialty: '', 
                    location: '', 
                    phone: '', 
                    lat: 4.05, 
                    lng: 9.7, 
                    certified: true,
                    address: '',
                    city: '',
                    country: '',
                    region: '',
                    hours: '',
                    services: '',
                    experience: ''
                  });
                }}
                className="flex-1 px-6 py-4 bg-white text-red-400 border border-red-100 rounded-2xl font-black text-[10px] uppercase"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition de plante */}
      {(editingPlant || showAddPlant) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-emerald-900 mb-6">
              {editingPlant ? 'Modifier la Plante' : 'Ajouter une Plante'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Nom Commun</label>
                <input 
                  type="text" 
                  value={editingPlant?.commonName || newPlant.commonName}
                  onChange={(e) => editingPlant 
                    ? setEditingPlant({...editingPlant, commonName: e.target.value})
                    : setNewPlant({...newPlant, commonName: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Nom Scientifique</label>
                <input 
                  type="text" 
                  value={editingPlant?.scientificName || newPlant.scientificName}
                  onChange={(e) => editingPlant 
                    ? setEditingPlant({...editingPlant, scientificName: e.target.value})
                    : setNewPlant({...newPlant, scientificName: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Noms Locaux (séparés par des virgules)</label>
                <input 
                  type="text" 
                  value={editingPlant?.localNames.join(', ') || newPlant.localNames}
                  onChange={(e) => {
                    const names = e.target.value.split(',').map(n => n.trim());
                    editingPlant 
                      ? setEditingPlant({...editingPlant, localNames: names})
                      : setNewPlant({...newPlant, localNames: e.target.value});
                  }}
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Usages (séparés par des virgules)</label>
                <input 
                  type="text" 
                  value={editingPlant?.uses.join(', ') || newPlant.uses}
                  onChange={(e) => {
                    const uses = e.target.value.split(',').map(u => u.trim());
                    editingPlant 
                      ? setEditingPlant({...editingPlant, uses})
                      : setNewPlant({...newPlant, uses: e.target.value});
                  }}
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Préparation</label>
                <textarea 
                  value={editingPlant?.preparation || newPlant.preparation}
                  onChange={(e) => editingPlant 
                    ? setEditingPlant({...editingPlant, preparation: e.target.value})
                    : setNewPlant({...newPlant, preparation: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Précautions</label>
                <textarea 
                  value={editingPlant?.precautions || newPlant.precautions}
                  onChange={(e) => editingPlant 
                    ? setEditingPlant({...editingPlant, precautions: e.target.value})
                    : setNewPlant({...newPlant, precautions: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Région</label>
                <input 
                  type="text" 
                  value={editingPlant?.region || newPlant.region}
                  onChange={(e) => editingPlant 
                    ? setEditingPlant({...editingPlant, region: e.target.value})
                    : setNewPlant({...newPlant, region: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Type d'Accès</label>
                  <select 
                    value={editingPlant?.accessType || newPlant.accessType}
                    onChange={(e) => editingPlant 
                      ? setEditingPlant({...editingPlant, accessType: e.target.value as AccessType})
                      : setNewPlant({...newPlant, accessType: e.target.value as AccessType})
                    }
                    className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="FREE">GRATUIT</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Prix (FCFA)</label>
                  <input 
                    type="number" 
                    value={editingPlant?.price || newPlant.price}
                    onChange={(e) => editingPlant 
                      ? setEditingPlant({...editingPlant, price: parseInt(e.target.value)})
                      : setNewPlant({...newPlant, price: parseInt(e.target.value)})
                    }
                    className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => {
                  if (editingPlant) {
                    handleSavePlant(editingPlant);
                  } else {
                    const plantToSave = {
                      ...newPlant,
                      localNames: newPlant.localNames.split(',').map(n => n.trim()),
                      uses: newPlant.uses.split(',').map(u => u.trim())
                    };
                    handleSavePlant(plantToSave as Plant);
                  }
                }}
                className="flex-1 px-6 py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-lime-500 hover:text-emerald-950 transition-all"
              >
                {editingPlant ? 'Mettre à Jour' : 'Ajouter'}
              </button>
              <button 
                onClick={() => {
                  setEditingPlant(null);
                  setShowAddPlant(false);
                  setNewPlant({ commonName: '', scientificName: '', localNames: '', uses: '', preparation: '', precautions: '', region: '', accessType: 'FREE' as AccessType, price: 0 });
                }}
                className="flex-1 px-6 py-4 bg-white text-red-400 border border-red-100 rounded-2xl font-black text-[10px] uppercase"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition d'utilisateur */}
      {(editingUser || showAddUser) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full">
            <h3 className="text-2xl font-black text-emerald-900 mb-6">
              {editingUser ? 'Modifier l\'Utilisateur' : 'Ajouter un Utilisateur'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Nom</label>
                <input 
                  type="text" 
                  value={editingUser?.name || newUser.name}
                  onChange={(e) => editingUser 
                    ? setEditingUser({...editingUser, name: e.target.value})
                    : setNewUser({...newUser, name: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={editingUser?.email || newUser.email}
                  onChange={(e) => editingUser 
                    ? setEditingUser({...editingUser, email: e.target.value})
                    : setNewUser({...newUser, email: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2">Rôle</label>
                <select 
                  value={editingUser?.role || newUser.role}
                  onChange={(e) => editingUser 
                    ? setEditingUser({...editingUser, role: e.target.value as UserRole})
                    : setNewUser({...newUser, role: e.target.value as UserRole})
                  }
                  className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="USER">UTILISATEUR</option>
                  <option value="PRACTITIONER">PRATICIEN</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={editingUser?.hasPremiumAccess || newUser.hasPremiumAccess}
                    onChange={(e) => editingUser 
                      ? setEditingUser({...editingUser, hasPremiumAccess: e.target.checked})
                      : setNewUser({...newUser, hasPremiumAccess: e.target.checked})
                  }
                  className="w-5 h-5 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-[10px] font-black uppercase text-emerald-700">Accès Premium</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => {
                  if (editingUser) {
                    handleSaveUser(editingUser);
                  } else {
                    handleSaveUser(newUser as User);
                  }
                }}
                className="flex-1 px-6 py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-lime-500 hover:text-emerald-950 transition-all"
              >
                {editingUser ? 'Mettre à Jour' : 'Ajouter'}
              </button>
              <button 
                onClick={() => {
                  setEditingUser(null);
                  setShowAddUser(false);
                  setNewUser({ name: '', email: '', role: 'USER' as UserRole, hasPremiumAccess: false });
                }}
                className="flex-1 px-6 py-4 bg-white text-red-400 border border-red-100 rounded-2xl font-black text-[10px] uppercase"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
