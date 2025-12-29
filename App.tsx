import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import PostCard from './components/PostCard';
import CreatePostModal from './components/CreatePostModal';
import EditProfileModal from './components/EditProfileModal';
import { db } from './services/db';
import { Post } from './types';
import { Loader, Edit } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [page, setPage] = useState('feed');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState('');

  // Handle routing based on Auth state
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setPage('auth');
    } else if (!isLoading && isAuthenticated && page === 'auth') {
      setPage('feed');
    }
  }, [isAuthenticated, isLoading, page]);

  // Data fetching
  useEffect(() => {
    if (page === 'feed') {
      setPosts(db.getPosts());
    } else if (page === 'profile' && user) {
      setPosts(db.getUserPosts(user.id));
    }
  }, [page, user, lastUpdate]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    
    const lowerQuery = searchQuery.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [posts, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-primary-500">
        <Loader className="animate-spin w-10 h-10" />
      </div>
    );
  }

  if (page === 'auth') {
    return <Auth />;
  }

  return (
    <Layout 
      currentPage={page} 
      onNavigate={setPage} 
      onOpenCreate={() => { setEditingPost(null); setIsCreateModalOpen(true); }}
      onSearch={setSearchQuery}
      searchQuery={searchQuery}
    >
      <div className="py-6 px-4 md:px-0">
        <header className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {page === 'feed' ? 'Discover' : 'Your Profile'}
            </h2>
            <p className="text-slate-400 mt-1">
              {page === 'feed' 
                ? 'Latest snippets and projects from the community.' 
                : `Manage your ${posts.length} shared posts.`
              }
            </p>
          </div>
          {page === 'profile' && (
             <button 
               onClick={() => setIsEditProfileOpen(true)}
               className="flex items-center space-x-2 text-sm bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg transition"
             >
               <Edit size={16} />
               <span>Edit Profile</span>
             </button>
          )}
        </header>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
            <p className="text-slate-500">
              {searchQuery ? `No results found for "${searchQuery}"` : 'No posts found yet.'}
            </p>
            {page === 'profile' && !searchQuery && (
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 text-primary-400 hover:text-primary-300 font-medium"
              >
                Create your first post
              </button>
            )}
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-primary-400 hover:text-primary-300 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              currentUser={user} 
              onUpdate={() => setLastUpdate(Date.now())}
              onEdit={(postToEdit) => {
                setEditingPost(postToEdit);
                setIsCreateModalOpen(true);
              }}
            />
          ))
        )}
      </div>

      {isCreateModalOpen && (
        <CreatePostModal 
          onClose={() => { setIsCreateModalOpen(false); setEditingPost(null); }} 
          onPostCreated={() => {
            setLastUpdate(Date.now());
          }}
          initialData={editingPost}
        />
      )}

      {isEditProfileOpen && (
        <EditProfileModal 
          onClose={() => setIsEditProfileOpen(false)}
          onUpdate={() => setLastUpdate(Date.now())}
        />
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;