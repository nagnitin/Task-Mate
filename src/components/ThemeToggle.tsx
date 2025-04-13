
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskContext } from '@/contexts/TaskContext';

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTaskContext();

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleDarkMode}
      className="rounded-full"
    >
      {darkMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
