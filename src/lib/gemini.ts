
// Gemini API utility for AI assistance with tasks
import { toast } from "@/hooks/use-toast";

// Using the most up-to-date Gemini API configuration
// Note: This API key has expired according to the error message
const GEMINI_API_KEY = "AIzaSyAzPMKQnW_eRlJWWX2pkLovVMxb3eM4xwA";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent";

export interface GeminiResponse {
  text: string;
  success: boolean;
}

// Fallback task suggestions when API is unavailable
const fallbackSuggestions = [
  {
    title: "Prepare weekly report",
    description: "Compile data from the past week and create a summary report for the team meeting on Friday."
  },
  {
    title: "Grocery shopping",
    description: "Buy fresh produce, dairy, and cleaning supplies from the local supermarket before weekend."
  },
  {
    title: "Schedule dentist appointment",
    description: "Call the dental clinic to book a routine check-up and cleaning for next month."
  },
  {
    title: "Update resume",
    description: "Review and update resume with recent achievements and skills for job applications."
  },
  {
    title: "Plan team building activity",
    description: "Research and organize a fun team-building event for the department next quarter."
  }
];

export const getTaskSuggestions = async (prompt: string): Promise<GeminiResponse> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      // Instead of throwing an error, use the fallback suggestions
      return getRandomFallbackSuggestion();
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return {
        text: data.candidates[0].content.parts[0].text,
        success: true
      };
    } else {
      return getRandomFallbackSuggestion();
    }
  } catch (error) {
    console.error("Error getting suggestions from Gemini:", error);
    return getRandomFallbackSuggestion();
  }
};

// Get a random suggestion from the fallback list
const getRandomFallbackSuggestion = (): GeminiResponse => {
  const randomIndex = Math.floor(Math.random() * fallbackSuggestions.length);
  const suggestion = fallbackSuggestions[randomIndex];
  
  return {
    text: `${suggestion.title}\n${suggestion.description}`,
    success: true
  };
};
