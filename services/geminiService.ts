import { GoogleGenAI, Type } from "@google/genai";

// Initialize the API client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface WorkoutPlan {
  title: string;
  focus: string;
  exercises: {
    name: string;
    sets: string;
    reps: string;
    note: string;
  }[];
  motivation: string;
}

export const generateSampleWorkout = async (goal: string, experience: string, time: string): Promise<WorkoutPlan | null> => {
  try {
    const model = "gemini-2.5-flash"; // Using a fast model for interactive elements
    
    const prompt = `
      Jesteś ekspertem trenerem personalnym. Stwórz przykładowy, JEDEN dzień treningowy dla klienta.
      Cel klienta: ${goal}
      Poziom doświadczenia: ${experience}
      Czas na trening: ${time} minut.

      Odpowiedź musi być w formacie JSON. Zawrzyj chwytliwy tytuł treningu, na czym się skupiamy (focus), listę 3-5 ćwiczeń oraz krótkie zdanie motywacyjne.
      Używaj języka polskiego.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            focus: { type: Type.STRING },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.STRING },
                  reps: { type: Type.STRING },
                  note: { type: Type.STRING }
                }
              }
            },
            motivation: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as WorkoutPlan;
    }
    return null;

  } catch (error) {
    console.error("Error generating workout:", error);
    return null;
  }
};