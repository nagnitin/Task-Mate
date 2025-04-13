
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseNaturalLanguageTask } from '@/lib/ai-helpers';
import { Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Task } from '@/types/task';

interface NaturalLanguageInputProps {
  onTaskCreated: (taskData: Partial<Task>) => void;
}

const NaturalLanguageInput: React.FC<NaturalLanguageInputProps> = ({ onTaskCreated }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter a task description",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const parsedTask = parseNaturalLanguageTask(input);
      
      if (parsedTask) {
        onTaskCreated(parsedTask);
        setInput('');
        toast({
          title: "Task created",
          description: `"${parsedTask.title}" has been created.`,
        });
      } else {
        toast({
          title: "Could not parse input",
          description: "Try something like 'Call John tomorrow at 5pm'",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error parsing natural language:', error);
      toast({
        title: "Error processing input",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Sparkles className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add task using natural language... (e.g., Call John tomorrow at 5pm)"
          className="pl-10 pr-4 py-2 bg-white dark:bg-taskmate-darkmode-card"
          disabled={isProcessing}
        />
      </div>
      <Button type="submit" disabled={isProcessing || !input.trim()}>
        {isProcessing ? "Processing..." : "Add Task"}
      </Button>
    </form>
  );
};

export default NaturalLanguageInput;
