import React, { useState, useEffect } from 'react';
import { X, Code, Layout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { Post, PostType } from '../types';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: () => void;
  initialData?: Post | null;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPostCreated, initialData }) => {
  const { user } = useAuth();
  const [type, setType] = useState<PostType>('snippet');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCode(initialData.code || '');
      setProjectUrl(initialData.projectUrl || '');
      setTags(initialData.tags.join(', '));
    }
  }, [initialData]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      // We need to set the cursor position after React updates the state
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const postData: Post = {
      id: initialData ? initialData.id : `p${Date.now()}`,
      userId: user.id,
      author: {
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
      type,
      title,
      description,
      code: type === 'snippet' ? code : undefined,
      projectUrl: type === 'project' ? projectUrl : undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      likes: initialData ? initialData.likes : [],
      comments: initialData ? initialData.comments : [],
      createdAt: initialData ? initialData.createdAt : new Date().toISOString(),
      language: type === 'snippet' ? 'javascript' : undefined,
    };

    if (initialData) {
      db.updatePost(postData);
    } else {
      db.createPost(postData);
    }
    
    setTimeout(() => {
      setLoading(false);
      onPostCreated();
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900 sticky top-0">
          <h2 className="text-lg font-semibold text-white">{initialData ? 'Edit Post' : 'Create New Post'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="flex space-x-4 mb-6">
            <button
              type="button"
              onClick={() => setType('snippet')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg border transition-all ${
                type === 'snippet' 
                  ? 'bg-primary-600 border-primary-500 text-white' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <Code size={18} />
              <span>Code Snippet</span>
            </button>
            <button
              type="button"
              onClick={() => setType('project')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg border transition-all ${
                type === 'project' 
                  ? 'bg-primary-600 border-primary-500 text-white' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <Layout size={18} />
              <span>Project Showcase</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-white placeholder-slate-600"
                placeholder="e.g., Amazing Sort Algorithm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
              <textarea
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-white placeholder-slate-600 h-24 resize-none"
                placeholder="Describe your snippet or project..."
              />
            </div>

            {type === 'snippet' && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Code (Tab supported)</label>
                <textarea
                  required
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-white font-mono text-sm placeholder-slate-600 h-48"
                  placeholder="Paste your code here..."
                  spellCheck={false}
                />
              </div>
            )}

            {type === 'project' && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Project URL</label>
                <input
                  required
                  type="url"
                  value={projectUrl}
                  onChange={e => setProjectUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-white placeholder-slate-600"
                  placeholder="https://github.com/my-project"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-white placeholder-slate-600"
                placeholder="react, typescript, ui"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : (initialData ? 'Update Post' : 'Create Post')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;