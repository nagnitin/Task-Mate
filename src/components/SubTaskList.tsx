
import React from 'react';
import { SubTask } from '@/types/task';
import { Check, Circle, Trash2 } from 'lucide-react';

interface SubTaskListProps {
  subtasks: SubTask[];
  taskId: string;
  onToggle: (taskId: string, subtaskId: string) => void;
  onDelete: (taskId: string, subtaskId: string) => void;
}

const SubTaskList: React.FC<SubTaskListProps> = ({ subtasks, taskId, onToggle, onDelete }) => {
  if (subtasks.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-1.5">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subtasks ({subtasks.length})</h4>
      <ul className="space-y-1">
        {subtasks.map((subtask) => (
          <li key={subtask.id} className="flex items-center gap-2 text-sm">
            <button
              onClick={() => onToggle(taskId, subtask.id)}
              className="flex-shrink-0 text-gray-400 hover:text-taskmate-primary"
            >
              {subtask.completed ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </button>
            <span className={subtask.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-300'}>
              {subtask.title}
            </span>
            <button
              onClick={() => onDelete(taskId, subtask.id)}
              className="ml-auto text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubTaskList;
