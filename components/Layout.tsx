import React from 'react';
import { Terminal, Home, User as UserIcon, LogOut, PlusCircle, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenCreate: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentPage, 
  onNavigate, 
  onOpenCreate,
  onSearch,
  searchQuery
}) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-7xl mx-auto">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 p-4 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950 flex flex-col z-10">
        <div className="flex items-center space-x-2 mb-8 px-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-900/40">
            <Terminal size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            DevShare
          </h1>
        </div>

        <div className="mb-6 px-2 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary-500/50"
            />
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => onNavigate('feed')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentPage === 'feed'
                ? 'bg-primary-600/10 text-primary-400 font-medium'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Home size={20} />
            <span>Feed</span>
          </button>
          
          <button
            onClick={() => onNavigate('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentPage === 'profile'
                ? 'bg-primary-600/10 text-primary-400 font-medium'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <UserIcon size={20} />
            <span>Profile</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all duration-200 md:hidden"
          >
            <PlusCircle size={20} />
            <span>New Post</span>
          </button>
        </nav>

        {user ? (
          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="flex items-center space-x-3 px-2 mb-4">
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-10 h-10 rounded-full bg-slate-800 ring-2 ring-slate-800"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.username}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
            >
              <LogOut size={18} />
              <span className="text-sm">Log out</span>
            </button>
          </div>
        ) : (
          <div className="mt-auto">
             <button
              onClick={() => onNavigate('auth')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
            >
              Sign In
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 border-r border-slate-800">
        <div className="max-w-3xl mx-auto w-full">
           {children}
        </div>
      </main>

      {/* Right Sidebar (Desktop only) */}
      <aside className="hidden lg:block w-80 p-6 h-screen sticky top-0">
        
        {/* Search Bar for Desktop */}
        <div className="mb-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search snippets, tags..." 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-900/50 to-slate-900 rounded-2xl p-6 border border-primary-500/20 mb-6">
          <h3 className="font-bold text-white mb-2">Share your code</h3>
          <p className="text-sm text-slate-300 mb-4">
            Got a cool React hook? A clever Rust macro? Share it with the community!
          </p>
          <button 
            onClick={onOpenCreate}
            className="w-full py-2 bg-white text-primary-900 font-bold rounded-lg hover:bg-slate-100 transition shadow-lg shadow-primary-900/20 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Create Post
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider">Trending Tags</h3>
          <div className="flex flex-wrap gap-2">
            {['react', 'javascript', 'rust', 'python', 'css', 'webdev'].map(tag => (
              <button 
                key={tag} 
                onClick={() => onSearch(tag)}
                className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-400 hover:border-primary-500 hover:text-primary-400 cursor-pointer transition"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-xs text-slate-600">
          <p>© 2024 DevShare Inc.</p>
          <div className="flex space-x-2 mt-2">
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Layout;