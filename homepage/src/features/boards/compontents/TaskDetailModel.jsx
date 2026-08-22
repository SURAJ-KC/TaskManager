import React, { useState, useEffect } from 'react';
import { 
  X, Clock, UserPlus, MessageSquare, Send, Trash2, 
  CheckCircle2, AlignLeft 
} from 'lucide-react';

const priorityColors = {
  Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  High: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const TaskDetailModal = ({ 
  isOpen, 
  onClose, 
  task, 
  onUpdateTask, 
  onAddComment, 
  onDeleteComment, 
  availableUsers = [] 
}) => {
  const [description, setDescription] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [comments, setComments] = useState([]);

  // Sync internal state whenever the selected task prop changes
  useEffect(() => {
    if (task) {
      setDescription(task.description || '');
      setAssignedUsers(task.assignedTo || []);
      setComments(task.comments || []);
      setIsEditingDesc(false);
    }
  }, [task]);

  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  // Save Description Update
  const handleSaveDescription = () => {
    if (onUpdateTask) {
      onUpdateTask(task._id, { description });
    }
    setIsEditingDesc(false);
  };

  // Toggle Assignee Selection
  const handleToggleAssignee = (user) => {
    const isAlreadyAssigned = assignedUsers.some((u) => u._id === user._id);
    const updated = isAlreadyAssigned
      ? assignedUsers.filter((u) => u._id !== user._id)
      : [...assignedUsers, user];

    setAssignedUsers(updated);
    if (onUpdateTask) {
      onUpdateTask(task._id, { assignedTo: updated.map((u) => u._id) });
    }
  };

  // Add Comment
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      _id: Date.now().toString(),
      text: commentText,
      userId: { name: 'You' },
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    if (onAddComment) {
      onAddComment(task._id, commentText);
    }
    setCommentText('');
  };

  // Delete Comment
  const handleDeleteComment = (commentId) => {
    setComments(comments.filter((c) => c._id !== commentId));
    if (onDeleteComment) {
      onDeleteComment(commentId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-start gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${priorityColors[task.priority] || priorityColors.Medium}`}>
                {task.priority || 'Medium'} Priority
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">{task.title}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm">
          
          {/* Section 1: Assignees */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <UserPlus size={14} /> Assigned Team Members
            </h3>
            <div className="flex flex-wrap gap-2 items-center">
              {availableUsers.map((user) => {
                const isAssigned = assignedUsers.some((u) => u._id === user._id);
                return (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => handleToggleAssignee(user)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                      isAssigned 
                        ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40' 
                        : 'bg-slate-800 text-slate-400 border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">
                      {user.name ? user.name[0] : 'U'}
                    </div>
                    {user.name}
                    {isAssigned && <CheckCircle2 size={12} className="text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Description */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlignLeft size={14} /> Description
            </h3>
            {isEditingDesc ? (
              <div className="space-y-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-800 border border-indigo-500/50 rounded-xl p-3 text-slate-100 focus:outline-none text-xs"
                  placeholder="Add detailed task instructions..."
                />
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={handleSaveDescription} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    Save
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsEditingDesc(false)} 
                    className="bg-slate-800 hover:bg-slate-700 text-slate-400 px-3 py-1.5 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => setIsEditingDesc(true)}
                className="bg-slate-800/50 border border-slate-800 hover:border-slate-700 rounded-xl p-3 cursor-pointer min-h-15 text-xs text-slate-300"
              >
                {description || <span className="text-slate-500 italic">Click to add a detailed description...</span>}
              </div>
            )}
          </div>

          {/* Section 3: Comments & Activity */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageSquare size={14} /> Comments & Activity
            </h3>

            {/* Comment List */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No comments yet. Start the conversation!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 space-y-1 group relative">
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span className="font-semibold text-indigo-400">{comment.userId?.name || 'User'}</span>
                      <div className="flex items-center gap-2">
                        <span>{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment._id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition"
                          title="Delete Comment"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-200">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* New Comment Input Form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition"
              >
                <Send size={13} /> Send
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TaskDetailModal;