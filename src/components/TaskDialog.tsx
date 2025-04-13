
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TaskCategory, Task, TaskPriority } from '@/types/task';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Plus, X, AlertTriangle, CheckCircle2, CircleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import AiAssistant from './AiAssistant';
import SubTaskList from './SubTaskList';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  task?: Task;
  mode: 'add' | 'edit';
}

const TaskDialog: React.FC<TaskDialogProps> = ({ isOpen, onClose, onSubmit, task, mode }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate || undefined);
      setCategory(task.category);
      setPriority(task.priority || 'medium');
      setTags(task.tags || []);
      setSubtasks(task.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(undefined);
      setCategory('Work');
      setPriority('medium');
      setTags([]);
      setSubtasks([]);
    }
  }, [task]);

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      dueDate,
      category,
      priority,
      tags,
      subtasks,
    });
    onClose();
  };

  const handleTagAdd = () => {
    if (newTag.trim() !== '' && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubtaskAdd = () => {
    if (newSubtask.trim() !== '') {
      setSubtasks([...subtasks, { id: crypto.randomUUID(), title: newSubtask.trim(), completed: false }]);
      setNewSubtask('');
    }
  };

  const handleSubtaskRemove = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const handleSubtaskToggle = (id: string) => {
    setSubtasks(subtasks.map(st => 
      st.id === id ? { ...st, completed: !st.completed } : st
    ));
  };

  const handleAiSuggestion = (suggestion: string) => {
    // Parse the AI suggestion
    const lines = suggestion.split('\n').filter(line => line.trim() !== '');
    
    // Try to extract title and description
    let suggestedTitle = '';
    let suggestedDescription = '';
    
    if (lines.length >= 1) {
      suggestedTitle = lines[0].replace(/^(Title:|Task:)?\s*/i, '');
    }
    
    if (lines.length >= 2) {
      // Join remaining lines as description
      suggestedDescription = lines.slice(1).join('\n').replace(/^(Description:)?\s*/i, '');
    }
    
    // Update form state
    setTitle(suggestedTitle);
    setDescription(suggestedDescription);
  };

  // Helper function to get the priority icon and color
  const getPriorityDetails = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return { icon: AlertTriangle, color: 'text-red-500 bg-red-100' };
      case 'medium':
        return { icon: CircleAlert, color: 'text-amber-500 bg-amber-100' };
      case 'low':
        return { icon: CheckCircle2, color: 'text-green-500 bg-green-100' };
      default:
        return { icon: CircleAlert, color: 'text-amber-500 bg-amber-100' };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Task' : 'Edit Task'}</DialogTitle>
        </DialogHeader>
        
        {mode === 'add' && (
          <AiAssistant onSuggestionSelected={handleAiSuggestion} />
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as TaskCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="high" className="text-red-500">High</SelectItem>
                    <SelectItem value="medium" className="text-amber-500">Medium</SelectItem>
                    <SelectItem value="low" className="text-green-500">Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => handleTagRemove(tag)}
                    className="rounded-full hover:bg-blue-300 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTagAdd()}
              />
              <Button type="button" size="icon" onClick={handleTagAdd}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Subtasks</Label>
            {subtasks.length > 0 && (
              <div className="mb-2 space-y-2 border rounded-md p-2">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => handleSubtaskToggle(subtask.id)}
                      className="h-4 w-4"
                    />
                    <span className={subtask.completed ? 'line-through text-gray-400' : ''}>
                      {subtask.title}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => handleSubtaskRemove(subtask.id)}
                      className="ml-auto rounded-full hover:bg-gray-200 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Add a subtask"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubtaskAdd()}
              />
              <Button type="button" size="icon" onClick={handleSubtaskAdd}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {mode === 'add' ? 'Add Task' : 'Update Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
