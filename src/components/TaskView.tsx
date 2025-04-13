
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import TaskCard from './TaskCard';
import { Task } from '@/types/task';

interface TaskViewProps {
  onEditTask: (task: Task) => void;
  hideCompleted?: boolean;
}

const TaskView: React.FC<TaskViewProps> = ({ onEditTask, hideCompleted = false }) => {
  const { filteredTasks, deleteTask, toggleTaskCompletion } = useTaskContext();
  
  // Filter tasks based on the hideCompleted flag
  const visibleTasks = hideCompleted 
    ? filteredTasks.filter(task => !task.completed)
    : filteredTasks;
  
  // Separate completed and incomplete tasks
  const incompleteTasks = visibleTasks.filter(task => !task.completed);
  const completedTasks = visibleTasks.filter(task => task.completed);

  if (visibleTasks.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mb-4 flex justify-center">
          <CheckCircle className="h-16 w-16 text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">No tasks found</h3>
        <p className="text-gray-400 dark:text-gray-500 mt-1">
          Add a new task or change your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {incompleteTasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-taskmate-dark dark:text-taskmate-darkmode-text">
            Tasks ({incompleteTasks.length})
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {incompleteTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={deleteTask}
                onToggleComplete={toggleTaskCompletion}
              />
            ))}
          </div>
        </div>
      )}
      
      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-taskmate-dark dark:text-taskmate-darkmode-text">
            Completed ({completedTasks.length})
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={deleteTask}
                onToggleComplete={toggleTaskCompletion}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskView;
