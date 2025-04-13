
import { Task, TaskPriority, TaskCategory } from '@/types/task';
import { addDays, format, parse, isValid } from 'date-fns';

// Helper function to extract date/time information from text
export const extractDateTime = (text: string): Date | null => {
  const todayPattern = /\b(today)\b/i;
  const tomorrowPattern = /\b(tomorrow)\b/i;
  const datePattern = /\b(on\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s*,?\s*(\d{4}))?\b/i;
  const timePattern = /\b(at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i;
  
  let dueDate: Date | null = null;
  
  // Check for "today" or "tomorrow"
  if (todayPattern.test(text)) {
    dueDate = new Date();
  } else if (tomorrowPattern.test(text)) {
    dueDate = addDays(new Date(), 1);
  }
  
  // Check for specific date
  const dateMatch = text.match(datePattern);
  if (dateMatch) {
    const month = dateMatch[2];
    const day = dateMatch[3];
    const year = dateMatch[4] || new Date().getFullYear().toString();
    const dateString = `${month} ${day}, ${year}`;
    const parsedDate = new Date(dateString);
    
    if (isValid(parsedDate)) {
      dueDate = parsedDate;
    }
  }
  
  // Extract time if available
  const timeMatch = text.match(timePattern);
  if (timeMatch && dueDate) {
    let hours = parseInt(timeMatch[2], 10);
    const minutes = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;
    const ampm = timeMatch[4].toLowerCase();
    
    if (ampm === 'pm' && hours < 12) {
      hours += 12;
    } else if (ampm === 'am' && hours === 12) {
      hours = 0;
    }
    
    dueDate.setHours(hours, minutes, 0, 0);
  }
  
  return dueDate;
};

// Helper function to guess task category
export const guessCategory = (text: string): TaskCategory => {
  const lowerText = text.toLowerCase();
  
  if (/work|project|meeting|presentation|client|report|email|boss|colleague/i.test(lowerText)) {
    return 'Work';
  } else if (/exercise|gym|workout|run|fitness|health|doctor|medic|pill|drug/i.test(lowerText)) {
    return 'Health';
  } else if (/shop|buy|store|purchase|grocery|supermarket/i.test(lowerText)) {
    return 'Shopping';
  } else if (/study|learn|course|class|read|book|education/i.test(lowerText)) {
    return 'Education';
  } else if (/pay|bill|money|bank|finance|budget|tax/i.test(lowerText)) {
    return 'Finance';
  } else {
    return 'Personal';
  }
};

// Helper function to guess task priority
export const guessPriority = (text: string): TaskPriority => {
  const lowerText = text.toLowerCase();
  
  if (/urgent|immediate|asap|critical|emergency|now/i.test(lowerText)) {
    return 'high';
  } else if (/important|priority|soon/i.test(lowerText)) {
    return 'medium';
  } else {
    return 'low';
  }
};

// Extract tags from the text
export const extractTags = (text: string): string[] => {
  // Look for hashtags
  const hashtagPattern = /#(\w+)/g;
  const hashtagMatches = [...text.matchAll(hashtagPattern)];
  
  // Extract words that might be good tag candidates
  const tags = hashtagMatches.map(match => match[1].toLowerCase());
  
  // Add some guessed tags based on the content
  const lowerText = text.toLowerCase();
  
  if (/call|phone|talk/i.test(lowerText)) tags.push('call');
  if (/meet|visit|appointment/i.test(lowerText)) tags.push('meeting');
  if (/email|send/i.test(lowerText)) tags.push('email');
  if (/deadline|due/i.test(lowerText)) tags.push('deadline');
  
  // Remove duplicates
  return [...new Set(tags)];
};

// Main function to parse natural language input
export const parseNaturalLanguageTask = (text: string): Partial<Task> => {
  // Basic task info - use the input as the title
  let title = text;
  
  // Try to extract a better title by taking the first sentence or clause
  const firstSentence = text.split(/[.!?]|\band\b|\bthen\b/i)[0].trim();
  if (firstSentence && firstSentence.length < text.length) {
    title = firstSentence;
  }
  
  // Get due date
  const dueDate = extractDateTime(text);
  
  // Guess category
  const category = guessCategory(text);
  
  // Guess priority
  const priority = guessPriority(text);
  
  // Extract tags
  const tags = extractTags(text);
  
  // Build description - mention why we chose these values
  let description = `Created from: "${text}"`;
  
  return {
    title,
    description,
    dueDate,
    category,
    priority,
    tags,
    completed: false,
    subtasks: []
  };
};

// Function to suggest deadline based on past behavior
export const suggestDeadline = (taskTitle: string, taskDescription: string, tasks: Task[]): Date | null => {
  const lowerTitle = taskTitle.toLowerCase();
  const lowerDescription = taskDescription.toLowerCase();
  
  // Find similar completed tasks
  const similarTasks = tasks.filter(task => 
    task.category === guessCategory(taskTitle + " " + taskDescription) &&
    (task.title.toLowerCase().includes(lowerTitle) || lowerTitle.includes(task.title.toLowerCase()) ||
     task.description.toLowerCase().includes(lowerDescription) || lowerDescription.includes(task.description.toLowerCase()))
  );
  
  if (similarTasks.length > 0) {
    // Calculate average days to complete
    const now = new Date();
    const avgDays = similarTasks.reduce((sum, task) => {
      if (task.dueDate) {
        const createdDate = new Date(task.createdAt);
        const dueDate = new Date(task.dueDate);
        const days = Math.round((dueDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }
      return sum + 2; // Default to 2 days if no due date
    }, 0) / similarTasks.length;
    
    // Suggest a deadline based on average
    return addDays(now, Math.round(avgDays));
  }
  
  // Default suggestions based on category
  const category = guessCategory(taskTitle + " " + taskDescription);
  switch (category) {
    case 'Work': return addDays(new Date(), 2);
    case 'Health': return addDays(new Date(), 1);
    case 'Shopping': return addDays(new Date(), 3);
    case 'Education': return addDays(new Date(), 5);
    case 'Finance': return addDays(new Date(), 2);
    default: return addDays(new Date(), 3);
  }
};
