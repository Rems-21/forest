
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getScientificInsights = async (plantName: string) => {
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
};

export const chatWithBotanist = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "Tu es l'assistant IA de Forest Apothecary, un expert en pharmacopée africaine et en botanique. Ton rôle est d'aider les utilisateurs à identifier des plantes médicinales traditionnelles africaines et à expliquer leur usage validé scientifiquement. Sois toujours prudent, mentionne que tes conseils ne remplacent pas un médecin, et alerte sur les dosages et toxicités potentielles."
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
