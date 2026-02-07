
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './views/Home';
import { Wiki } from './views/Wiki';
import { Analyze } from './views/Analyze';
import { PlantDetail } from './views/PlantDetail';
import { Network } from './views/Network';
import { Community } from './views/Community';
import { Contribute } from './views/Contribute';
import { Auth } from './views/Auth';
import { Admin } from './views/Admin';
import { PractitionerDashboard } from './views/PractitionerDashboard';
import { Pricing } from './views/Pricing';
import { Payment } from './views/Payment';
import { PractitionerApply } from './views/PractitionerApply';
import { Privacy } from './views/Privacy';
import { AppView, Plant, User, UserRole, SubscriptionTier } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier | null>(null);

  // Persistence mock
  useEffect(() => {
    const savedUser = localStorage.getItem('fa_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('fa_user');
      }
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('fa_user', JSON.stringify(u));
    if (u.role === UserRole.PRACTITIONER) {
      setCurrentView('practitioner-dashboard');
    } else {
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fa_user');
    setCurrentView('home');
  };

  const handleSelectPlant = (plant: Plant) => {
    setSelectedPlant(plant);
    setCurrentView('wiki');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpgradeSuccess = () => {
    if (!user || !selectedPlan) return;
    const updatedUser: User = {
      ...user,
      hasPremiumAccess: selectedPlan !== SubscriptionTier.FREE,
      subscriptionTier: selectedPlan,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    setUser(updatedUser);
    localStorage.setItem('fa_user', JSON.stringify(updatedUser));
    setSelectedPlan(null);
    setCurrentView('profile');
    alert("Félicitations ! Votre compte est désormais Premium.");
  };

  const renderContent = () => {
    if (selectedPlant && currentView === 'wiki') {
      return <PlantDetail plant={selectedPlant} user={user} onBack={() => setSelectedPlant(null)} />;
    }

    switch (currentView) {
      case 'home':
        return <Home onStartWiki={() => setCurrentView('wiki')} onStartAnalyze={() => setCurrentView('analyze')} />;
      case 'wiki':
        return <Wiki onSelectPlant={handleSelectPlant} />;
      case 'analyze':
        return <Analyze />;
      case 'map':
        return <Network />;
      case 'community':
        return <Community user={user} onNavigateToAuth={() => setCurrentView('auth')} />;
      case 'contribute':
        return <Contribute onBack={() => setCurrentView('home')} />;
      case 'pricing':
        return <Pricing currentTier={user?.subscriptionTier} onSelectPlan={(tier) => {
          if (!user) {
            setCurrentView('auth');
            return;
          }
          if (tier === SubscriptionTier.FREE) {
            // Mock downgrade
            const updatedUser: User = { ...user, hasPremiumAccess: false, subscriptionTier: SubscriptionTier.FREE };
            setUser(updatedUser);
            localStorage.setItem('fa_user', JSON.stringify(updatedUser));
            return;
          }
          setSelectedPlan(tier);
          setCurrentView('payment');
        }} />;
      case 'payment':
        return selectedPlan ? (
          <Payment 
            plan={selectedPlan} 
            onSuccess={handleUpgradeSuccess} 
            onCancel={() => setCurrentView('pricing')} 
          />
        ) : <Pricing onSelectPlan={() => {}} />;
      case 'auth':
        return <Auth onLogin={handleLogin} onBack={() => setCurrentView('home')} onNavigateToPrivacy={() => setCurrentView('privacy')} />;
      case 'admin':
        return user?.role === UserRole.ADMIN ? <Admin /> : <Auth onLogin={handleLogin} onBack={() => setCurrentView('home')} onNavigateToPrivacy={() => setCurrentView('privacy')} />;
      case 'practitioner-dashboard':
        return user?.role === UserRole.PRACTITIONER ? <PractitionerDashboard user={user} /> : <Auth onLogin={handleLogin} onBack={() => setCurrentView('home')} onNavigateToPrivacy={() => setCurrentView('privacy')} />;
      case 'practitioner-apply':
        return <PractitionerApply onBack={() => setCurrentView('home')} />;
      case 'privacy':
        return <Privacy />;
      case 'profile':
        if (!user) return <Auth onLogin={handleLogin} onBack={() => setCurrentView('home')} onNavigateToPrivacy={() => setCurrentView('privacy')} />;
        return (
          <div className="max-w-2xl mx-auto py-12 md:py-20 px-4">
            <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-emerald-50 text-center relative overflow-hidden">
              <div className="absolute -top-10 -left-10 opacity-[0.02]"><i className="fas fa-user-circle text-[15rem] md:text-[20rem]"></i></div>
              <div className="relative inline-block mb-8 md:mb-10">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-emerald-50 rounded-[2rem] md:rounded-[2.5rem] mx-auto flex items-center justify-center text-4xl md:text-5xl border-4 border-white shadow-2xl text-emerald-700">
                  <i className={`fas ${user.role === UserRole.ADMIN ? 'fa-user-shield' : user.role === UserRole.PRACTITIONER ? 'fa-user-doctor' : 'fa-user'}`}></i>
                </div>
                {user.hasPremiumAccess && (
                  <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 bg-lime-500 rounded-full flex items-center justify-center text-emerald-950 border-2 md:border-4 border-white shadow-lg">
                    <i className="fas fa-crown text-[10px] md:text-xs"></i>
                  </div>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-emerald-900 mb-2 tracking-tighter">{user.name}</h1>
              <p className="text-lime-600 font-black uppercase tracking-[0.2em] text-[10px] mb-8">{user.role}</p>
              
              <div className="mb-10 md:mb-12 p-5 md:p-6 bg-emerald-50 rounded-2xl md:rounded-3xl border border-emerald-100 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left gap-4">
                 <div>
                    <p className="text-[9px] md:text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Abonnement</p>
                    <p className="font-black text-emerald-950 text-sm md:text-base">{user.subscriptionTier || 'Standard (Gratuit)'}</p>
                 </div>
                 <button 
                  onClick={() => setCurrentView('pricing')}
                  className="w-full md:w-auto px-6 py-3 bg-emerald-950 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-lime-500 hover:text-emerald-950 transition-all shadow-lg"
                 >
                  {user.hasPremiumAccess ? 'Gérer' : 'Devenir Premium'}
                 </button>
              </div>

              <div className="space-y-3 md:space-y-4 relative z-10">
                {user.role === UserRole.ADMIN && (
                   <button onClick={() => setCurrentView('admin')} className="w-full py-4 md:py-5 bg-lime-500 text-emerald-950 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Panneau d'administration</button>
                )}
                {user.role === UserRole.PRACTITIONER && (
                   <button onClick={() => setCurrentView('practitioner-dashboard')} className="w-full py-4 md:py-5 bg-lime-500 text-emerald-950 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Espace Révision</button>
                )}
                <button onClick={handleLogout} className="w-full py-4 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-50 rounded-xl transition-all">Se Déconnecter</button>
              </div>
            </div>
          </div>
        );
      default:
        return <Home onStartWiki={() => setCurrentView('wiki')} onStartAnalyze={() => setCurrentView('analyze')} />;
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-lime-500 selection:text-emerald-950 flex flex-col overflow-x-hidden">
      <Header 
        currentView={currentView} 
        setCurrentView={(v) => { setCurrentView(v); setSelectedPlant(null); }} 
        user={user} 
      />
      <main className="flex-1 overflow-x-hidden">{renderContent()}</main>
      <Footer setCurrentView={setCurrentView} />
      
      {/* Bouton d'Action Flottant - Responsive */}
      <div className="fixed bottom-6 right-4 md:bottom-12 md:right-12 group z-[110]">
         <button 
           onClick={() => { setCurrentView('contribute'); setSelectedPlant(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
           className="w-14 h-14 md:w-16 md:h-16 bg-emerald-950 text-white rounded-2xl shadow-2xl flex items-center justify-center text-xl md:text-2xl font-bold hover:scale-110 hover:bg-lime-500 hover:text-emerald-950 transition-all active:scale-95 border border-emerald-800"
           aria-label="Contribuer"
         >
           <i className="fas fa-plus"></i>
         </button>
         <span className="absolute right-full mr-6 top-1/2 -translate-y-1/2 bg-emerald-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-xl opacity-0 lg:group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl pointer-events-none hidden lg:block">Contribuer au Savoir</span>
      </div>
    </div>
  );
};

export default App;
