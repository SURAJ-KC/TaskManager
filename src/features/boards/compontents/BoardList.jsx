import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Layout, ArrowRight, Trash2, Clock, FolderPlus } from 'lucide-react';
import boardService from '../services/boardService';
import UserNav from '../../../Components/navigation/UserNav'
const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await boardService.getBoards();
      setBoards(data);
    } catch (err) {
      setError(err.message || 'Failed to load boards');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user boards on component mount
  useEffect(() => {
    queueMicrotask(fetchBoards);
  }, [fetchBoards]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setCreating(true);
      const createdBoard = await boardService.createBoard({
        title: newTitle,
        description: newDescription,
      });
      setBoards((currentBoards) => [createdBoard, ...currentBoards]);
      setNewTitle('');
      setNewDescription('');
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to create board');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBoard = async (e, boardId) => {
    e.stopPropagation(); // Stop navigation click
    if (!window.confirm('Are you sure you want to delete this board?')) return;

    try {
      await boardService.deleteBoard(boardId);
      setBoards((currentBoards) =>
        currentBoards.filter((board) => board._id !== boardId)
      );
    } catch (err) {
      alert(err.message || 'Failed to delete board');
    }
  };

  if (loading) {
    return (
      
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Loading boards...
      </div>
    );
  }

  return (
    <div>
    <UserNav />
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      {/* Header Bar */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-100">
            <Layout className="text-indigo-500" size={24} /> My Workspaces
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your project boards, columns, and task workflows.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus size={16} /> Create New Board
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Board Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create Board Card Shortcut */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-slate-900/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group min-h-40"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-indigo-600/20 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
              <FolderPlus size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-300">
              Create New Board
            </span>
          </div>

          {/* List of Existing Boards */}
          {boards.map((board) => (
            <div
              key={board._id}
              onClick={() => navigate(`/board/${board._id}`)}
              className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 shadow-lg transition-all cursor-pointer group flex flex-col justify-between min-h-40"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {board.title}
                  </h3>
                  <button
                    onClick={(e) => handleDeleteBoard(e, board._id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 rounded-lg transition"
                    title="Delete Board"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {board.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(board.createdAt).toLocaleDateString()}
                </span>
                <span className="text-indigo-400 flex items-center gap-1 font-medium group-hover:translate-x-0.5 transition-transform">
                  Open Board <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Board Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-100">Create New Workspace Board</h2>
            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Board Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marketing Launch, Product Roadmap"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of the board's objective..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                >
                  {creating ? 'Creating...' : 'Create Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default BoardList;