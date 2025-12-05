import { GoogleGenAI, Type } from "@google/genai";
import { WordDetailsResponse } from "../types";

// Ensure API key is present
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches details (Pinyin, Meaning, Example) for a given Chinese word/phrase.
 */
export const enrichWord = async (character: string): Promise<WordDetailsResponse> => {
  const model = "gemini-2.5-flash";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Provide the pinyin, english meaning, a simple chinese example sentence, and the english meaning of that sentence for the word: "${character}".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pinyin: { type: Type.STRING, description: "The Pinyin with tone marks" },
          meaning: { type: Type.STRING, description: "The English translation" },
          exampleSentence: { type: Type.STRING, description: "A simple example sentence in Chinese" },
          exampleMeaning: { type: Type.STRING, description: "English translation of the example sentence" },
        },
        required: ["pinyin", "meaning", "exampleSentence", "exampleMeaning"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as WordDetailsResponse;
};

/**
 * Fetches details for multiple words at once.
 * Uses chunking to prevent timeouts or output token limits.
 * Accepts an optional onProgress callback.
 */
export const enrichWordsBulk = async (
  characters: string[],
  onProgress?: (count: number, total: number) => void
): Promise<(WordDetailsResponse & { character: string })[]> => {
  const model = "gemini-2.5-flash";
  
  // Clean inputs
  const cleanChars = characters.map(c => c.trim()).filter(Boolean);
  if (cleanChars.length === 0) return [];

  // Process in chunks of 20 to be safe with output tokens and latency
  const chunkSize = 20;
  const chunks = [];
  for (let i = 0; i < cleanChars.length; i += chunkSize) {
    chunks.push(cleanChars.slice(i, i + chunkSize));
  }

  const allResults: (WordDetailsResponse & { character: string })[] = [];
  let processedCount = 0;

  for (const chunk of chunks) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: `For the following list of Chinese words, provide the pinyin, meaning, example sentence, and example meaning for each.
        
        Words:
        ${chunk.join('\n')}
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                character: { type: Type.STRING, description: "The Chinese word from the list" },
                pinyin: { type: Type.STRING },
                meaning: { type: Type.STRING },
                exampleSentence: { type: Type.STRING },
                exampleMeaning: { type: Type.STRING },
              },
              required: ["character", "pinyin", "meaning", "exampleSentence", "exampleMeaning"],
            },
          },
        },
      });

      const text = response.text;
      if (text) {
        const chunkResults = JSON.parse(text) as (WordDetailsResponse & { character: string })[];
        allResults.push(...chunkResults);
      }
    } catch (error) {
      console.error("Error processing chunk:", chunk, error);
      // Continue with other chunks even if one fails
    } finally {
      processedCount += chunk.length;
      if (onProgress) {
        onProgress(Math.min(processedCount, cleanChars.length), cleanChars.length);
      }
    }
  }
  
  return allResults;
};
