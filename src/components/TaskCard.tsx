
import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Circle, Edit, Trash2, Calendar, AlertTriangle, CircleAlert, CheckCircle2, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import SubTaskList from './SubTaskList';
import { useTaskContext } from '@/contexts/TaskContext';
import { toast } from '@/hooks/use-toast';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const { toggleSubTaskCompletion, deleteSubTask } = useTaskContext();
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  
  // Get priority styling
  const getPriorityDetails = (priority = 'medium') => {
    switch (priority) {
      case 'high':
        return { 
          icon: AlertTriangle, 
          color: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          label: 'High'
        };
      case 'medium':
        return { 
          icon: CircleAlert, 
          color: 'text-amber-500',
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
          label: 'Medium'
        };
      case 'low':
        return { 
          icon: CheckCircle2, 
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          label: 'Low'
        };
      default:
        return { 
          icon: CircleAlert, 
          color: 'text-amber-500',
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
          label: 'Medium'
        };
    }
  };

  const priorityDetails = getPriorityDetails(task.priority);
  const PriorityIcon = priorityDetails.icon;
  
  // Determine category color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'work': return 'bg-blue-500 dark:bg-blue-600';
      case 'personal': return 'bg-purple-500 dark:bg-purple-600';
      case 'health': return 'bg-green-500 dark:bg-green-600';
      case 'shopping': return 'bg-yellow-500 dark:bg-yellow-600';
      case 'education': return 'bg-indigo-500 dark:bg-indigo-600';
      case 'finance': return 'bg-emerald-500 dark:bg-emerald-600';
      default: return 'bg-gray-500 dark:bg-gray-600';
    }
  };
  
  const handleShareTask = () => {
    // In a real app, this would open a sharing dialog
    // For now, we'll just simulate sharing with a toast
    navigator.clipboard.writeText(`Task: ${task.title} - Due: ${task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}`);
    
    toast({
      title: "Task copied to clipboard",
      description: "Ready to share with others",
    });
  };

  return (
    <Card className={cn(
      "transition-all duration-300 border-l-4 animate-fade-in shadow-sm hover:shadow-md dark:glass-card dark:border-opacity-70",
      task.completed ? "border-l-green-500 bg-gray-50 dark:bg-taskmate-darkmode-card/70" : 
      isOverdue ? "border-l-red-500" : 
      task.priority === 'high' ? 'border-l-red-500' :
      task.priority === 'medium' ? 'border-l-amber-500' :
      task.priority === 'low' ? 'border-l-green-500' : 
      "border-l-taskmate-primary"
    )}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={cn("mt-1 transition-colors", 
                task.completed ? "text-green-500" : 
                task.priority === 'high' ? 'text-red-500' :
                task.priority === 'medium' ? 'text-amber-500' :
                task.priority === 'low' ? 'text-green-500' : 
                "text-taskmate-primary"
              )}
            >
              {task.completed ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>
            
            <div className="flex-1">
              <h3 className={cn(
                "text-lg font-medium transition-all",
                task.completed && "line-through text-gray-500 dark:text-gray-400"
              )}>
                {task.title}
              </h3>
              
              <p className={cn(
                "text-gray-600 dark:text-gray-400 mt-1",
                task.completed && "text-gray-400 dark:text-gray-500"
              )}>
                {task.description}
              </p>
              
              <div className="flex items-center flex-wrap gap-2 mt-3">
                <Badge className={cn("font-normal", getCategoryColor(task.category))}>
                  {task.category}
                </Badge>
                
                <Badge className={cn("font-normal", priorityDetails.bgColor, priorityDetails.color)}>
                  <PriorityIcon className="h-3 w-3 mr-1" />
                  <span>{priorityDetails.label}</span>
                </Badge>
                
                {task.dueDate && (
                  <div className={cn(
                    "flex items-center text-xs px-2 py-1 rounded-full",
                    isOverdue ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20" : 
                    "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800"
                  )}>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      {isOverdue && " (Overdue)"}
                    </span>
                  </div>
                )}
              </div>
              
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs bg-transparent text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {task.subtasks && task.subtasks.length > 0 && (
                <SubTaskList
                  subtasks={task.subtasks}
                  taskId={task.id}
                  onToggle={toggleSubTaskCompletion}
                  onDelete={deleteSubTask}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end pt-0 pb-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareTask}
          className="text-gray-500 hover:text-taskmate-primary dark:text-gray-400 dark:hover:text-taskmate-accent"
        >
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(task)}
          className="text-gray-500 hover:text-taskmate-primary dark:text-gray-400 dark:hover:text-taskmate-accent"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
