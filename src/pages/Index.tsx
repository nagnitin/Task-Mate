
import React, { useState } from 'react';
import { Task } from '@/types/task';
import TaskHeader from '@/components/TaskHeader';
import TaskView from '@/components/TaskView';
import TaskDialog from '@/components/TaskDialog';
import { useTaskContext } from '@/contexts/TaskContext';
import PomodoroTimer from '@/components/PomodoroTimer';
import TaskAnalytics from '@/components/TaskAnalytics';
import NaturalLanguageInput from '@/components/NaturalLanguageInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { suggestDeadline } from '@/lib/ai-helpers';

const Index = () => {
  const { addTask, updateTask, tasks, filteredTasks } = useTaskContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [showCompleted, setShowCompleted] = useState(true);

  const handleAddNewClick = () => {
    setDialogMode('add');
    setSelectedTask(undefined);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setDialogMode('edit');
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = (values: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    if (dialogMode === 'add') {
      addTask({ ...values, completed: false });
    } else if (dialogMode === 'edit' && selectedTask) {
      updateTask({
        ...selectedTask,
        ...values,
      });
    }
  };

  const handleNaturalLanguageTaskCreated = (taskData: Partial<Task>) => {
    // Suggest deadline based on past behavior if not provided
    if (!taskData.dueDate && taskData.title) {
      const suggestedDeadline = suggestDeadline(
        taskData.title, 
        taskData.description || '', 
        tasks
      );
      
      if (suggestedDeadline) {
        taskData.dueDate = suggestedDeadline;
      }
    }
    
    addTask({ 
      ...taskData as Omit<Task, 'id' | 'createdAt'>,
      completed: false 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-taskmate-darkmode-bg dark:text-taskmate-darkmode-text transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <TaskHeader onAddNewClick={handleAddNewClick} />
        
        <div className="mb-6">
          <NaturalLanguageInput onTaskCreated={handleNaturalLanguageTaskCreated} />
        </div>
        
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="pomodoro">Pomodoro Timer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="animate-fade-in">
            <div className="flex items-center justify-end mb-4">
              <label className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <input 
                  type="checkbox" 
                  checked={showCompleted} 
                  onChange={() => setShowCompleted(!showCompleted)}
                  className="rounded text-taskmate-primary focus:ring-taskmate-primary dark:bg-taskmate-darkmode-accent"
                />
                <span>Show completed tasks</span>
              </label>
            </div>
            <TaskView onEditTask={handleEditTask} hideCompleted={!showCompleted} />
          </TabsContent>
          
          <TabsContent value="analytics" className="animate-fade-in">
            <TaskAnalytics tasks={tasks} />
          </TabsContent>
          
          <TabsContent value="pomodoro" className="animate-fade-in">
            <div className="max-w-md mx-auto">
              <PomodoroTimer />
            </div>
          </TabsContent>
        </Tabs>
        
        <TaskDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleDialogSubmit}
          task={selectedTask}
          mode={dialogMode}
        />
      </div>
    </div>
  );
};

export default Index;
