import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Layout, CheckSquare, X, ArrowRight, Loader2 } from 'lucide-react';
import boardService from '../services/boardService';

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ boards: [], tasks: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Debounced Search Request
  useEffect(() => {
    if (!query.trim()) {
      setResults({ boards: [], tasks: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await boardService.globalSearch(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectBoard = (boardId) => {
    onClose();
    navigate(`/board/${boardId}`);
  };

  const handleSelectTask = (task) => {
    onClose();
    // Navigate to board containing the task
    const boardId = task.listId?.boardId;
    if (boardId) {
      navigate(`/board/${boardId}?taskId=${task._id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search all boards and tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-100 text-sm focus:outline-none placeholder-slate-500"
            autoFocus
          />
          {loading ? (
            <Loader2 size={16} className="animate-spin text-slate-500" />
          ) : (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-6 text-xs">
          {!query.trim() && (
            <div className="text-center py-8 text-slate-500">
              Type keywords to search across your workspace
            </div>
          )}

          {/* Boards Section */}
          {results.boards.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layout size={13} /> Boards
              </h4>
              <div className="space-y-1.5">
                {results.boards.map((board) => (
                  <div
                    key={board._id}
                    onClick={() => handleSelectBoard(board._id)}
                    className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 cursor-pointer flex justify-between items-center transition"
                  >
                    <div>
                      <span className="font-semibold text-slate-200">{board.title}</span>
                      {board.description && (
                        <p className="text-slate-400 line-clamp-1">{board.description}</p>
                      )}
                    </div>
                    <ArrowRight size={14} className="text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Section */}
          {results.tasks.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckSquare size={13} /> Tasks
              </h4>
              <div className="space-y-1.5">
                {results.tasks.map((task) => (
                  <div
                    key={task._id}
                    onClick={() => handleSelectTask(task)}
                    className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 cursor-pointer flex justify-between items-center transition"
                  >
                    <div>
                      <span className="font-semibold text-slate-200">{task.title}</span>
                      <p className="text-slate-500">List: {task.listId?.title || 'Unknown'}</p>
                    </div>
                    <span className="text-indigo-400 font-medium">View Task</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query.trim() && !loading && results.boards.length === 0 && results.tasks.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No matching boards or tasks found for "{query}"
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default GlobalSearchModal;