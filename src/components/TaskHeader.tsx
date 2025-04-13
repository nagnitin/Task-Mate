
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTaskContext } from '@/contexts/TaskContext';
import { TaskCategory } from '@/types/task';
import ThemeToggle from './ThemeToggle';

interface TaskHeaderProps {
  onAddNewClick: () => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ onAddNewClick }) => {
  const { 
    setSearchQuery, 
    searchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    categories 
  } = useTaskContext();

  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-taskmate-dark dark:text-white">
          TaskMate
        </h1>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button onClick={onAddNewClick}>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>
      </div>
      
      <div className="w-full space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            onClick={() => setSelectedCategory("All")}
            className={selectedCategory === "All" ? "bg-taskmate-primary hover:bg-taskmate-secondary" : ""}
          >
            All
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-taskmate-primary hover:bg-taskmate-secondary" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;
