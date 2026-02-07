
import React, { useState } from 'react';
import { User, UserRole, ForumPost, PostCategory, Comment } from '../types';

interface CommunityProps {
  user: User | null;
  onNavigateToAuth: () => void;
}

export const Community: React.FC<CommunityProps> = ({ user, onNavigateToAuth }) => {
  const [activeCategory, setActiveCategory] = useState<PostCategory | 'Tout'>('Tout');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  // Post Creation State
  const [newPostData, setNewPostData] = useState({
    title: '',
    content: '',
    category: 'Discussion' as PostCategory
  });

  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: '1',
      authorId: 'admin-1',
      author: 'Dr. Mamadou',
      authorRole: UserRole.ADMIN,
      category: 'Solution',
      title: 'Traitement complémentaire pour le Paludisme',
      content: 'L\'association de l\'Artemisia avec une alimentation riche en vitamine C améliore significativement le temps de récupération. Il est recommandé de consommer du Baobab (poudre de fruit) en parallèle pour son apport massif en antioxydants.',
      likes: 24,
      likedBy: [],
      comments: [
        { id: 'c1', author: 'Sarah L.', content: 'Très intéressant, merci Docteur.', date: 'Il y a 1h' }
      ],
      date: 'Il y a 2h'
    },
    {
      id: '2',
      authorId: 'pract-1',
      author: 'Herboriste_67',
      authorRole: UserRole.PRACTITIONER,
      category: 'Astuce',
      title: 'Conservation optimale des feuilles de Moringa',
      content: 'Pour garder toutes les propriétés nutritionnelles, faites sécher les feuilles à l\'ombre dans un endroit ventilé, jamais au soleil direct. Une fois sèches, réduisez-les en poudre et conservez dans un bocal en verre ambré.',
      likes: 56,
      likedBy: [],
      comments: [],
      date: 'Il y a 5h'
    }
  ]);

  const filteredPosts = activeCategory === 'Tout' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  const handleLike = (postId: string) => {
    if (!user) {
      onNavigateToAuth();
      return;
    }
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const alreadyLiked = p.likedBy.includes(user.id);
        return {
          ...p,
          likes: alreadyLiked ? p.likes - 1 : p.likes + 1,
          likedBy: alreadyLiked ? p.likedBy.filter(id => id !== user.id) : [...p.likedBy, user.id]
        };
      }
      return p;
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onNavigateToAuth();
      return;
    }
    if (!newComment.trim() || !selectedPost) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: user.name,
      content: newComment,
      date: 'À l\'instant'
    };

    setPosts(prev => prev.map(p => {
      if (p.id === selectedPost.id) {
        return { ...p, comments: [comment, ...p.comments] };
      }
      return p;
    }));
    
    // Update local selected post view
    setSelectedPost(prev => prev ? { ...prev, comments: [comment, ...prev.comments] } : null);
    setNewComment('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const post: ForumPost = {
      id: Date.now().toString(),
      authorId: user.id,
      author: user.name,
      authorRole: user.role,
      category: newPostData.category,
      title: newPostData.title,
      content: newPostData.content,
      likes: 0,
      likedBy: [],
      comments: [],
      date: 'À l\'instant'
    };

    setPosts([post, ...posts]);
    setIsModalOpen(false);
    setNewPostData({ title: '', content: '', category: 'Discussion' });
  };

  const canPostSolution = user?.role === UserRole.ADMIN || user?.role === UserRole.PRACTITIONER;

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
        <button 
          onClick={() => setSelectedPost(null)}
          className="mb-8 flex items-center space-x-3 text-emerald-700 font-black text-xs uppercase tracking-widest hover:text-emerald-950 transition-all"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Retour au flux</span>
        </button>

        <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border border-emerald-50 mb-12">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-emerald-900 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                <i className="fas fa-user-circle"></i>
              </div>
              <div>
                <p className="font-black text-emerald-950 text-lg tracking-tighter">{selectedPost.author}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">{selectedPost.date}</span>
                  <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                  <span className="text-[9px] font-black uppercase text-lime-600 tracking-widest">{selectedPost.authorRole}</span>
                </div>
              </div>
            </div>
            <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
              selectedPost.category === 'Solution' ? 'bg-emerald-100 text-emerald-700' : 
              selectedPost.category === 'Astuce' ? 'bg-lime-100 text-lime-700' : 'bg-blue-50 text-blue-600'
            }`}>
              {selectedPost.category}
            </span>
          </div>

          <h1 className="text-4xl font-black text-emerald-900 mb-8 tracking-tighter leading-none">
            {selectedPost.title}
          </h1>
          <p className="text-gray-600 text-xl font-light leading-relaxed mb-12 whitespace-pre-wrap">
            {selectedPost.content}
          </p>

          <div className="flex items-center space-x-8 pt-8 border-t border-emerald-50">
            <button 
              onClick={() => handleLike(selectedPost.id)}
              className={`flex items-center space-x-3 transition-all ${
                user && selectedPost.likedBy.includes(user.id) ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <i className={`${user && selectedPost.likedBy.includes(user.id) ? 'fas' : 'far'} fa-heart text-2xl`}></i>
              <span className="text-sm font-black">{selectedPost.likes}</span>
            </button>
            <div className="flex items-center space-x-3 text-emerald-900 font-black text-sm">
              <i className="far fa-comment text-2xl"></i>
              <span>{selectedPost.comments.length} Commentaires</span>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="space-y-8 mb-20">
          <h2 className="text-2xl font-black text-emerald-950 tracking-tight pl-4">Discussions</h2>
          
          <form onSubmit={handleAddComment} className="relative mb-12">
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? "Ajoutez votre grain de sel..." : "Connectez-vous pour commenter"}
              disabled={!user}
              rows={3}
              className="w-full bg-white rounded-[2rem] p-8 pr-32 shadow-xl border border-emerald-50 focus:ring-2 focus:ring-lime-500 outline-none transition-all resize-none text-emerald-950 placeholder-emerald-100"
            ></textarea>
            <button 
              type="submit"
              disabled={!user || !newComment.trim()}
              className="absolute bottom-6 right-6 px-8 py-3 bg-emerald-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-lime-500 hover:text-emerald-950 transition-all disabled:opacity-30"
            >
              Publier
            </button>
          </form>

          <div className="space-y-4">
            {selectedPost.comments.map(comment => (
              <div key={comment.id} className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-black text-emerald-900 text-sm tracking-tight">{comment.author}</p>
                  <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest">{comment.date}</span>
                </div>
                <p className="text-gray-600 font-medium leading-relaxed">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 relative">
      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl border border-white animate-fade-in overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <i className="fas fa-paper-plane text-9xl"></i>
            </div>
            
            <h2 className="text-3xl font-black text-emerald-900 mb-8 tracking-tighter">Nouveau Partage</h2>
            
            <form onSubmit={handleCreatePost} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Catégorie</label>
                <div className="flex flex-wrap gap-2">
                  {['Discussion', 'Astuce', 'Question', 'Solution'].map(cat => {
                    const isSolution = cat === 'Solution';
                    const disabled = isSolution && !canPostSolution;
                    return (
                      <button
                        key={cat}
                        type="button"
                        disabled={disabled}
                        onClick={() => setNewPostData({...newPostData, category: cat as PostCategory})}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          newPostData.category === cat 
                            ? 'bg-emerald-950 text-white' 
                            : 'bg-emerald-50 text-emerald-400 hover:bg-emerald-100'
                        } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        {cat} {isSolution && <i className="fas fa-shield-halved ml-2"></i>}
                      </button>
                    );
                  })}
                </div>
                {!canPostSolution && <p className="text-[9px] text-orange-400 font-black uppercase tracking-widest ml-4 mt-2">* Solution réservée aux experts certifiés</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Titre du sujet</label>
                <input 
                  type="text" 
                  required
                  value={newPostData.title}
                  onChange={e => setNewPostData({...newPostData, title: e.target.value})}
                  placeholder="De quoi voulez-vous discuter ?"
                  className="w-full px-6 py-4 rounded-2xl bg-emerald-50/50 border-none focus:ring-2 focus:ring-lime-500 outline-none transition-all font-bold text-emerald-950"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Contenu du message</label>
                <textarea 
                  required
                  rows={5}
                  value={newPostData.content}
                  onChange={e => setNewPostData({...newPostData, content: e.target.value})}
                  placeholder="Détaillez votre pensée..."
                  className="w-full px-8 py-6 rounded-[2rem] bg-emerald-50/50 border-none focus:ring-2 focus:ring-lime-500 outline-none transition-all resize-none text-emerald-950"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  className="flex-1 py-5 bg-emerald-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-lime-500 hover:text-emerald-950 transition-all"
                >
                  Publier Maintenant
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left: Feed and Filters */}
        <div className="lg:col-span-8 flex-1 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-6xl font-black text-emerald-900 mb-6 tracking-tighter">Communauté Forest</h1>
              <p className="text-gray-500 text-lg font-light leading-relaxed">
                Un espace d'échange entre experts, praticiens et passionnés.
              </p>
            </div>
            <button 
              onClick={() => user ? setIsModalOpen(true) : onNavigateToAuth()}
              className="px-8 py-5 bg-emerald-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-lime-500 hover:text-emerald-950 transition-all active:scale-95 group"
            >
              <i className="fas fa-plus mr-3 group-hover:rotate-90 transition-transform"></i>
              Nouveau Post
            </button>
          </div>

          {/* Categories bar */}
          <div className="flex overflow-x-auto pb-4 gap-3 scroll-hide">
            {['Tout', 'Discussion', 'Astuce', 'Solution', 'Question'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${
                  activeCategory === cat 
                    ? 'bg-emerald-950 text-white border-emerald-950' 
                    : 'bg-white text-emerald-400 border-emerald-50 hover:border-lime-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => setSelectedPost(post)}
                className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-emerald-50 hover:border-lime-300 transition-all group animate-fade-in cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">
                      <i className="fas fa-user-circle text-2xl"></i>
                    </div>
                    <div>
                      <p className="font-black text-emerald-950 text-sm tracking-tight">{post.author}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{post.date}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    post.category === 'Astuce' ? 'bg-lime-100 text-lime-700' :
                    post.category === 'Solution' ? 'bg-emerald-100 text-emerald-700' :
                    post.category === 'Question' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {post.category}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-emerald-900 mb-4 tracking-tighter leading-tight group-hover:text-emerald-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 font-light leading-relaxed mb-8 line-clamp-3">
                  {post.content}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-emerald-50">
                  <div className="flex items-center space-x-8">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                      className={`flex items-center space-x-2 transition-colors ${
                        user && post.likedBy.includes(user.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <i className={`${user && post.likedBy.includes(user.id) ? 'fas' : 'far'} fa-heart`}></i>
                      <span className="text-[10px] font-black">{post.likes}</span>
                    </button>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <i className="far fa-comment-dots"></i>
                      <span className="text-[10px] font-black">{post.comments.length}</span>
                    </div>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest text-emerald-950 flex items-center group/btn">
                    <span>Rejoindre la discussion</span>
                    <i className="fas fa-arrow-right ml-2 text-[8px] group-hover/btn:translate-x-1 transition-transform"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-80 space-y-8">
           <div className="bg-emerald-950 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <i className="fas fa-users text-8xl"></i>
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-lime-400 mb-8">Statistiques</h4>
              <div className="space-y-6 relative z-10">
                 <div className="flex justify-between items-end">
                    <span className="text-emerald-500 text-[10px] font-bold uppercase">Membres</span>
                    <span className="text-3xl font-black tracking-tighter">2,4k</span>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-emerald-500 text-[10px] font-bold uppercase">Astuces</span>
                    <span className="text-3xl font-black tracking-tighter">{posts.length}</span>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-emerald-500 text-[10px] font-bold uppercase">En ligne</span>
                    <span className="text-3xl font-black tracking-tighter">124</span>
                 </div>
              </div>
              <button 
                onClick={() => user ? setIsModalOpen(true) : onNavigateToAuth()}
                className="w-full mt-10 py-5 bg-lime-500 text-emerald-950 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-lime-400 transition-all"
              >
                 Partager mon savoir
              </button>
           </div>

           <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-emerald-50">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Sujets Tendance</h4>
              <div className="space-y-4">
                 {['#MoringaPower', '#DetoxTraditionnelle', '#ValidationScientifique', '#CamerounSante'].map(tag => (
                   <a key={tag} href="#" className="block p-4 bg-emerald-50/50 rounded-xl text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors">
                      {tag}
                   </a>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
