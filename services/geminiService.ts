
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Ingredient, DishResult, Critic, IngredientType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCritics = async (level: number): Promise<Critic[]> => {
  const prompt = `
    RPG Cooking Game. Level ${level}.
    Generate 3 critics (JSON). Language: UKRAINIAN (Українська).
    One should be a Commoner, one Noble, one Monster/Weird.
    Crucial: One of them MUST have a specific 'request' (e.g. "Я хочу стейк з кров'ю" or "Зроби мені пюре").
    Use funny, stereotypical personas.
    Fields: id, name, persona, request (optional), avatar.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              persona: { type: Type.STRING },
              request: { type: Type.STRING, nullable: true },
              avatar: { type: Type.STRING },
            }
          }
        }
      }
    });
    const data = JSON.parse(response.text || "[]");
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [
      { id: 'c1', name: 'Пан Василь', persona: 'Гурман з села', request: 'Борщ', avatar: '👨‍🌾' },
      { id: 'c2', name: 'Леді Гага', persona: 'Ексцентрична зірка', request: 'Щось дивне', avatar: '👩‍🎤' },
      { id: 'c3', name: 'Орк Гриша', persona: 'Любить м\'ясо', request: 'Смажене м\'ясо', avatar: '👹' },
    ];
  }
};

export const evaluateDish = async (
  finalDishIngredients: Ingredient[],
  critics: Critic[],
  ingredientsCost: number
): Promise<DishResult> => {
  
  const ingredientsDesc = finalDishIngredients.map(i => `${i.name} (Стан: ${i.state})`).join(', ');
  const criticsDesc = critics.map(c => `${c.name} (${c.persona}) [Хоче: ${c.request || 'На розсуд шефа'}]`).join('; ');

  const prompt = `
    You are a legendary Chef and Dungeon Master in a Cooking RPG. Language: UKRAINIAN.
    
    PLAYER COOKED WITH: ${ingredientsDesc}.
    CRITICS TASTING: ${criticsDesc}.
    TOTAL INGREDIENTS COST: ${ingredientsCost} Gold.

    **SAFETY RULES:**
    If the user input contains explicit violence, hate speech, or strictly prohibited content that violates safety policies, you must NOT generate a recipe. Instead, return a JSON with the name "Я не буду це готувати" and description "Я не думаю, що це добра ідея відповідати на такий запит.". Score 0.

    **GAME RULES:**
    1. **Name & Desc**: Create a creative dish name and sensory description.
    2. **Recipe**: Generate a PROFESSIONAL, LOGICAL step-by-step recipe (5-8 steps). 
       - Describe HOW the specific ingredients were combined based on their state.
       - Make it sound like a real cookbook entry, even if ingredients are absurd.
    3. **Reviews**: Generate 3 REALISTIC, UNIQUE reviews.
       - Critics MUST reference specific ingredients.
       - If food is RAW (meat/eggs) or BURNT or WASTE (rubbish), the review must be Angry/Disgusted and score < 3.0.
    4. **Scoring & Economy**: 
       - Score 0.0 to 10.0.
       - Raw/Burnt = Automatic < 3.0.
       - The 'rewardGold' MUST be calculated based on the 'TOTAL INGREDIENTS COST'.
       - If the dish is GOOD (Score > 7), rewardGold should be approx 1.5x to 3x the cost.
       - If the dish is BAD (Score < 4), rewardGold should be negative (penalty).
       - Do NOT ignore the cost. A dish made of expensive items (Diamonds, Dragon Meat) should yield huge rewards if cooked well.

    JSON Format:
    {
      "name": "String",
      "description": "String",
      "reviews": [{"criticName": "String", "persona": "String", "text": "String", "score": Number}],
      "totalScore": Number,
      "rewardGold": Number,
      "rewardXp": Number,
      "steps": [{"action": "String", "description": "String", "icon": "Emoji"}]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            reviews: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  criticName: { type: Type.STRING },
                  persona: { type: Type.STRING },
                  text: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                }
              }
            },
            totalScore: { type: Type.NUMBER },
            rewardGold: { type: Type.NUMBER },
            rewardXp: { type: Type.NUMBER },
            steps: {
               type: Type.ARRAY,
               items: {
                 type: Type.OBJECT,
                 properties: {
                   action: { type: Type.STRING },
                   description: { type: Type.STRING },
                   icon: { type: Type.STRING }
                 }
               }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    // Safety check fallback for empty or refused responses
    if (result.name === "Я не буду це готувати" || !result.name) {
       return {
        name: "Відмова Шефа",
        description: "Я не думаю, що це добра ідея відповідати на такий запит.",
        reviews: [],
        totalScore: 0,
        rewardGold: 0,
        rewardXp: 0,
        steps: []
       };
    }
    
    return {
        name: result.name || "Невідома страва",
        description: result.description || "Експеримент...",
        reviews: Array.isArray(result.reviews) ? result.reviews : [],
        totalScore: typeof result.totalScore === 'number' ? result.totalScore : 0,
        rewardGold: typeof result.rewardGold === 'number' ? result.rewardGold : 0,
        rewardXp: typeof result.rewardXp === 'number' ? result.rewardXp : 0,
        steps: Array.isArray(result.steps) ? result.steps : [{ action: "Подача", description: "Ви виклали інгредієнти на тарілку", icon: "🍽️" }]
    };

  } catch (e) {
    return {
      name: "Кулінарний Провал",
      description: "Щось пішло не так під час оцінювання...",
      reviews: [],
      totalScore: 1.0,
      rewardGold: -10,
      rewardXp: -20,
      steps: []
    };
  }
};

export const replyToExcuse = async (criticName: string, persona: string, dishName: string, excuse: string, originalReview: string): Promise<string> => {
    const prompt = `
      Roleplay: You are ${criticName}, a ${persona} critic in a cooking game.
      Language: UKRAINIAN.
      
      Situation: You gave a review: "${originalReview}" for the dish "${dishName}".
      The Player is making an excuse: "${excuse}".
      
      Task: Reply to the excuse.
      - If the excuse makes sense or is funny, be slightly forgiving but witty.
      - If the excuse is pathetic, roast them harder.
      - Reference specifically what they said.
      - Keep it short (max 20 words).
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Хм...";
    } catch (e) {
        return "Я вас не чую.";
    }
};

export const analyzeCustomIngredient = async (name: string): Promise<{emoji: string, tier: number, type: IngredientType}> => {
  const prompt = `
    Analyze this ingredient name: "${name}".
    Return JSON with:
    1. Best fitting single Emoji.
    2. Rarity Tier (1=Common to 5=Legendary/Absurd).
    3. Category (IngredientType: meat, veg, fruit, spice, liquid, grain, weird, magic, cosmic, tech, office, dungeon).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
              emoji: { type: Type.STRING },
              tier: { type: Type.NUMBER },
              type: { type: Type.STRING }
           }
        }
      }
    });
    const res = JSON.parse(response.text || "{}");
    return {
      emoji: res.emoji || '📦',
      tier: res.tier || 1,
      type: res.type || 'weird'
    };
  } catch (e) {
    return { emoji: '❓', tier: 1, type: 'weird' };
  }
}

export const generateDishImage = async (dishName: string, description: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Food photography, delicious RPG dish, close up, ${dishName}, ${description}. Dramatic lighting, steam, garnish, high detail, 8k render. If the description says burnt or rubbish, make it look funny and bad.`,
      config: { numberOfImages: 1, aspectRatio: '1:1', outputMimeType: 'image/jpeg' },
    });
    const bytes = response.generatedImages?.[0]?.image?.imageBytes;
    return bytes ? `data:image/jpeg;base64,${bytes}` : '';
  } catch (e) { return ''; }
};

export const generateSpeech = async (text: string, voiceName: string) => {
   try {
    const safeVoice = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'].includes(voiceName) ? voiceName : 'Puck';
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: safeVoice as any },
                },
            },
        },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
    return new ArrayBuffer(0);
   } catch (e) {
       return new ArrayBuffer(0);
   }
};
