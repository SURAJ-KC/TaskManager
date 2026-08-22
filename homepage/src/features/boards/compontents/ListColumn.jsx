import React, { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const ListColumn = ({ list, tasks = [], onAddTask, onTaskClick }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (onAddTask) {
      onAddTask(list._id, newTitle);
    }
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="w-80 shrink-0 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col max-h-[calc(100vh-160px)] shadow-lg">
      
      {/* Column Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <h3 className="font-semibold text-sm text-slate-200">{list.title}</h3>
          <span className="bg-slate-800 text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-700/50">
            {tasks.length}
          </span>
        </div>
        <button className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Task Cards Container (Droppable Dropping Zone) */}
      <Droppable droppableId={list._id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 rounded-xl transition-colors ${
              snapshot.isDraggingOver
                ? 'bg-slate-800/40 border border-dashed border-indigo-500/40'
                : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task._id} 
                task={task} 
                index={index}
                onClick={() => onTaskClick && onTaskClick(task)} 
              />
            ))}

            {provided.placeholder}

            {tasks.length === 0 && !isAdding && (
              <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center text-xs text-slate-500">
                No tasks in this list
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Column Footer: Quick Add Task */}
      <div className="p-3 border-t border-slate-800/80">
        {isAdding ? (
          <form onSubmit={handleCreateTask} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Enter task title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2 rounded-lg border border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-1.5 rounded-lg font-medium transition"
              >
                Add Card
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs py-1.5 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 py-2 rounded-xl transition border border-transparent hover:border-slate-800"
          >
            <Plus size={15} /> Add Task
          </button>
        )}
      </div>

    </div>
  );
};

export default ListColumn;