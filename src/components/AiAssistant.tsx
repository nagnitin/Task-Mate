
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getTaskSuggestions } from '@/lib/gemini';
import { Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AiAssistantProps {
  onSuggestionSelected: (suggestion: string) => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ onSuggestionSelected }) => {
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestion = async () => {
    setIsLoading(true);
    try {
      const prompt = "Generate a practical and specific task for a to-do list. Include a clear title and a brief description. Make it realistic and actionable.";
      const result = await getTaskSuggestions(prompt);
      
      if (result.success && result.text) {
        onSuggestionSelected(result.text);
        toast({
          title: "Suggestion Generated",
          description: "AI has created a task suggestion for you!",
        });
      }
    } catch (error) {
      console.error("Error in AI suggestion generation:", error);
      toast({
        title: "AI Assistant Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <Button
        type="button"
        variant="outline"
        onClick={generateSuggestion}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2"
      >
        <Sparkles className="h-4 w-4" />
        {isLoading ? "Generating..." : "Generate Task with AI"}
      </Button>
    </div>
  );
};

export default AiAssistant;
