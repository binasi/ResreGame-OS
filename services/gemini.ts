import { GoogleGenAI, Type } from "@google/genai";
import { Scene } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Reduced limit to approx 200k tokens (800k chars) to be extremely safe against the 1M limit
const MAX_SCRIPT_CHARS = 800000; 

/**
 * Analyzes a script and breaks it down into scenes using Gemini 3 Pro.
 */
export const analyzeScript = async (scriptText: string): Promise<Scene[]> => {
  try {
    let processedScript = scriptText;
    
    // Safety check for huge inputs to prevent 400 errors
    if (scriptText.length > MAX_SCRIPT_CHARS) {
      console.warn(`Script too large (${scriptText.length} chars). Truncating to ${MAX_SCRIPT_CHARS} chars.`);
      processedScript = scriptText.substring(0, MAX_SCRIPT_CHARS) + "\n\n[Script truncated due to length limitations]";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Break down the following movie/video script into a sequence of key visual scenes for a storyboard. 
      For each scene, provide a short description and a highly descriptive visual prompt suitable for an AI image generator.
      The visual prompt should describe camera angle, lighting, subject, and action.
      
      Script:
      ${processedScript}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: { type: Type.NUMBER },
              description: { type: Type.STRING },
              visualPrompt: { type: Type.STRING },
            },
            required: ["sceneNumber", "description", "visualPrompt"],
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Scene[];
    }
    throw new Error("No response text received from Gemini.");
  } catch (error) {
    console.error("Error analyzing script:", error);
    throw error;
  }
};

/**
 * Generates an image for a specific scene using Gemini 2.5 Flash Image.
 */
export const generateSceneImage = async (visualPrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: visualPrompt,
      config: {}
    });

    // Extract image
    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part && part.inlineData && part.inlineData.data) {
       return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * General chat function using Gemini 3 Pro.
 */
export const sendChatMessage = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  try {
    // Aggressively truncate history if needed, though usually context window is large.
    // Truncate current message to avoid single-message token limits.
    const cleanMessage = message.length > 50000 ? message.substring(0, 50000) + "..." : message;

    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      history: history,
      config: {
          systemInstruction: "You are the AI interface for a retro game console OS (Retro-OS). Speak in a helpful, slightly robotic, retro-tech style. Keep responses concise and text-based."
      }
    });

    const response = await chat.sendMessage({ message: cleanMessage });
    return response.text || "SYSTEM ERROR: NO DATA RECEIVED.";
  } catch (error: any) {
    console.error("Chat Error:", error);
    return `SYSTEM ERROR: ${error.message || 'CONNECTION FAILED'}`;
  }
};