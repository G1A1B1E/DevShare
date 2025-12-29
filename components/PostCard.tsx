import React, { useState, memo } from 'react';
import { Heart, MessageSquare, Share2, Trash2, ExternalLink, Edit2 } from 'lucide-react';
import { Post, User } from '../types';
import CodeBlock from './CodeBlock';
import { db } from '../services/db';
import { useToast } from '../context/ToastContext';
import { timeAgo } from '../utils/date';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onUpdate: () => void;
  onEdit: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onUpdate, onEdit }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { addToast } = useToast();

  const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
  const isOwner = currentUser?.id === post.userId;

  const handleLike = () => {
    if (!currentUser) {
        addToast('Please login to like posts.', 'info');
        return;
    }
    db.toggleLike(post.id, currentUser.id);
    onUpdate();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      db.deletePost(post.id);
      addToast('Post deleted.', 'success');
      onUpdate();
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Link copied to clipboard!', 'success');
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        addToast('Please login to comment.', 'info');
        return;
    }
    if (!commentText.trim()) return;

    db.addComment(post.id, {
      id: `c${Date.now()}`,
      postId: post.id,
      userId: currentUser.id,
      username: currentUser.username,
      content: commentText,
      createdAt: new Date().toISOString()
    });
    setCommentText('');
    addToast('Comment added!', 'success');
    onUpdate();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-6 hover:border-slate-700 transition-colors">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={post.author.avatarUrl || 'https://via.placeholder.com/40'} 
              alt={post.author.username}
              className="w-10 h-10 rounded-full border border-slate-700 object-cover"
            />
            <div>
              <h3 className="text-white font-medium">{post.title}</h3>
              <p className="text-sm text-slate-400">
                @{post.author.username} • {timeAgo(post.createdAt)}
              </p>
            </div>
          </div>
          {isOwner && (
            <div className="flex space-x-1">
              <button 
                onClick={() => onEdit(post)}
                className="text-slate-500 hover:text-primary-400 p-2 rounded-lg hover:bg-slate-800 transition"
                title="Edit Post"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={handleDelete}
                className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition"
                title="Delete Post"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        <p className="text-slate-300 leading-relaxed mb-4 whitespace-pre-line">{post.description}</p>

        {post.type === 'snippet' && post.code && (
          <CodeBlock code={post.code} language={post.language} />
        )}

        {post.type === 'project' && post.projectUrl && (
          <div className="mt-3 p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-primary-400">
                <span className="font-semibold">Project Link</span>
              </div>
              <a 
                href={post.projectUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-1 text-sm text-slate-400 hover:text-white transition"
              >
                <span>Visit Project</span>
                <ExternalLink size={14} />
              </a>
            </div>
            <a href={post.projectUrl} className="text-xs text-slate-500 mt-1 block truncate hover:underline">
              {post.projectUrl}
            </a>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-6 mt-6 pt-4 border-t border-slate-800">
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-2 text-sm font-medium transition ${
              isLiked ? 'text-pink-500' : 'text-slate-400 hover:text-pink-500'
            }`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            <span>{post.likes.length}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-sm font-medium text-slate-400 hover:text-primary-400 transition"
          >
            <MessageSquare size={18} />
            <span>{post.comments.length}</span>
          </button>

          <button 
            onClick={handleShare}
            className="flex items-center space-x-2 text-sm font-medium text-slate-400 hover:text-white transition ml-auto"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {showComments && (
        <div className="bg-slate-950/50 p-5 border-t border-slate-800 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4 mb-4">
            {post.comments.length === 0 ? (
              <p className="text-center text-slate-500 text-sm py-2">No comments yet.</p>
            ) : (
              post.comments.map(comment => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="flex-1 bg-slate-900 rounded-lg p-3 border border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-300">@{comment.username}</span>
                      <span className="text-[10px] text-slate-500">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-400">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {currentUser && (
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-500 text-white placeholder-slate-600"
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Post
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(PostCard);