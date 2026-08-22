import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Filter, X, Plus } from 'lucide-react';
import { DragDropContext } from '@hello-pangea/dnd';
import ListColumn from './ListColumn';
import boardService from '../services/boardService';

const BoardView = () => {
  const { id: boardId } = useParams();

  const [boardData, setBoardData] = useState({ board: null, lists: [], tasks: [] });
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All'); // 'All' | 'Low' | 'Medium' | 'High'

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

  const fetchBoardData = async () => {
    try {
      setLoading(true);
      const data = await boardService.getBoardDetails(boardId);
      setBoardData(data);
    } catch (err) {
      console.error('Error loading board data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks in memory using search keyword and priority selection
  const filteredTasks = useMemo(() => {
    return boardData.tasks.filter((task) => {
      // 1. Check title/description matches search query
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Check priority filter match
      const matchesPriority =
        selectedPriority === 'All' || task.priority === selectedPriority;

      return matchesSearch && matchesPriority;
    });
  }, [boardData.tasks, searchQuery, selectedPriority]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPriority('All');
  };

  // Handle Drag and Drop Card Movement
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside column or in exact same position
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const destListId = destination.droppableId;

    // Optimistic Update: Immediately move task to new list in local state
    setBoardData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task._id === draggableId ? { ...task, listId: destListId } : task
      ),
    }));

    // Sync state change with backend API
    try {
      await boardService.updateTask(draggableId, { listId: destListId });
    } catch (error) {
      console.error('Failed to update task location:', error);
      // Revert to original server state on failure
      fetchBoardData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Loading workspace board...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Workspace Header & Toolbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Board Title */}
        <div>
          <h1 className="text-xl font-bold text-slate-100">{boardData.board?.title}</h1>
          {boardData.board?.description && (
            <p className="text-xs text-slate-400 mt-0.5">{boardData.board.description}</p>
          )}
        </div>

        {/* Toolbar: Search Input & Priority Filter */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Priority Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <Filter size={13} className="text-slate-400" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-800">All Priorities</option>
              <option value="Low" className="bg-slate-800">Low Priority</option>
              <option value="Medium" className="bg-slate-800">Medium Priority</option>
              <option value="High" className="bg-slate-800">High Priority</option>
            </select>
          </div>

          {/* Clear Filters Indicator */}
          {(searchQuery || selectedPriority !== 'All') && (
            <button
              onClick={clearFilters}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition"
            >
              Reset
            </button>
          )}
        </div>

      </header>

      {/* Main Drag and Drop Kanban Board View */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <main className="flex-1 p-6 overflow-x-auto">
          <div className="flex gap-4 items-start min-h-[calc(100vh-180px)]">
            {boardData.lists.map((list) => {
              // Filter list tasks from the global filteredTasks array
              const listTasks = filteredTasks.filter((t) => t.listId === list._id);

              return (
                <ListColumn
                  key={list._id}
                  list={list}
                  tasks={listTasks}
                />
              );
            })}
          </div>
        </main>
      </DragDropContext>
    </div>
  );
};

export default BoardView;