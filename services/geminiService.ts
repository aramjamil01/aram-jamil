
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartSuggestion = async (currentItems: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بۆ ئەم خواردنانەی خوارەوە، پێشنیاری خواردنەوەیەکی کوردی گونجاو بکە بە کورتترین شێوە: ${currentItems.join(', ')}`,
      config: {
        systemInstruction: "You are a Kurdish culinary expert. Suggest pairings in Sorani Kurdish only.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Suggestion Error:", error);
    return null;
  }
};
