
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set. Please set the environment variable.');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const getScientificInsights = async (plantName: string) => {
  if (!apiKey) {
    throw new Error('API key is not configured');
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Fournis une analyse scientifique courte (en français) de la plante médicinale suivante : ${plantName}. Inclus les principes actifs connus, les études cliniques récentes et les avertissements de toxicité. Format: JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            activeCompounds: { type: Type.ARRAY, items: { type: Type.STRING } },
            clinicalStudies: { type: Type.STRING },
            toxicityAlerts: { type: Type.STRING },
            dosageRecommendation: { type: Type.STRING }
          },
          required: ["activeCompounds", "clinicalStudies", "toxicityAlerts", "dosageRecommendation"]
        }
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get scientific insights');
  }
};

export const chatWithBotanist = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  if (!apiKey) {
    throw new Error('API key is not configured');
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "Tu es l'assistant IA de Forest Apothecary, un expert en pharmacopée africaine et en botanique. Ton rôle est d'aider les utilisateurs à identifier des plantes médicinales traditionnelles africaines et à expliquer leur usage validé scientifiquement. Sois toujours prudent, mentionne que tes conseils ne remplacent pas un médecin, et alerte sur les dosages et toxicités potentielles."
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to chat with botanist');
  }
};
