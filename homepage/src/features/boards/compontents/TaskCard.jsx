
import { Clock, MessageSquare } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';

const priorityStyles = {
  Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  High: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const TaskCard = ({ task, index, onClick }) => {
  const { _id, title, description, priority, dueDate, assignedTo = [], commentCount = 0 } = task;

  return (
    <Draggable draggableId={_id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style }}
          onClick={onClick}
          className={`group bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 p-4 rounded-xl shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing flex flex-col gap-3 select-none ${
            snapshot.isDragging
              ? 'shadow-2xl border-indigo-500 rotate-1 scale-105 z-50 ring-2 ring-indigo-500/30'
              : ''
          }`}
        >
          {/* Priority Badge & Options */}
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                priorityStyles[priority] || priorityStyles.Medium
              }`}
            >
              {priority} Priority
            </span>
          </div>

          {/* Task Content */}
          <div>
            <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
              {title}
            </h4>
            {description && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Footer: Due Date, Assignees, Comments */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/40 text-xs text-slate-400">
            {/* Due Date Indicator */}
            {dueDate ? (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock size={13} className="text-slate-500" />
                <span className="text-[11px]">
                  {new Date(dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            ) : (
              <div />
            )}

            {/* Metadata: Assignee Avatars & Comment Count */}
            <div className="flex items-center gap-3">
              {/* Comment Count */}
              {commentCount > 0 && (
                <div className="flex items-center gap-1 text-slate-400">
                  <MessageSquare size={13} />
                  <span className="text-[11px]">{commentCount}</span>
                </div>
              )}

              {/* Assigned Users Avatar Stack */}
              {assignedTo.length > 0 && (
                <div className="flex -space-x-1.5 overflow-hidden">
                  {assignedTo.slice(0, 3).map((user, idx) => (
                    <div
                      key={user._id || idx}
                      title={user.username || user.name}
                      className="h-6 w-6 rounded-full ring-2 ring-slate-800 bg-indigo-600 flex items-center justify-center text-[10px] font-medium text-white uppercase"
                    >
                      {(user.username || user.name || 'U')[0]}
                    </div>
                  ))}
                  {assignedTo.length > 3 && (
                    <div className="h-6 w-6 rounded-full ring-2 ring-slate-800 bg-slate-700 flex items-center justify-center text-[9px] text-slate-300">
                      +{assignedTo.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;