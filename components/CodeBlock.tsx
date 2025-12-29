import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Very basic syntax highlighting for demo purposes
  const highlightCode = (str: string) => {
    if (!str) return '';
    
    // Escape HTML to prevent injection
    let safeStr = str.replace(/&/g, "&amp;")
                     .replace(/</g, "&lt;")
                     .replace(/>/g, "&gt;");

    // Strings
    safeStr = safeStr.replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-green-400">$1</span>');
    // Keywords
    safeStr = safeStr.replace(/\b(const|let|var|function|return|import|export|from|if|else|for|while|class|interface|type)\b/g, '<span class="text-primary-400 font-bold">$1</span>');
    // Numbers
    safeStr = safeStr.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
    // Comments (Simple single line)
    safeStr = safeStr.replace(/(\/\/.*)/g, '<span class="text-slate-500 italic">$1</span>');
    
    return safeStr;
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-slate-700 bg-slate-900/50 mt-3">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400 uppercase">{language}</span>
        <button 
          onClick={handleCopy}
          className="p-1 hover:bg-slate-700 rounded transition-colors"
          title="Copy code"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-slate-400" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-slate-300 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
      </pre>
    </div>
  );
};

export default CodeBlock;