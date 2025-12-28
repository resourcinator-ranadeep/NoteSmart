import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Missing VITE_GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);

interface ChatMessage {
    role: 'user' | 'model';
    parts: string;
}

// Helper to get response from a specific model
const generateWithModel = async (modelName: string, history: ChatMessage[], newMessage: string, context?: string) => {
    const model = genAI.getGenerativeModel({ model: modelName });

    const chat = model.startChat({
        history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.parts }]
        })),
        generationConfig: {
            maxOutputTokens: 8192,
        },
    });

    const prompt = context
        ? `Context: ${context}\n\nUser Question: ${newMessage}`
        : newMessage;

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
};

export const getGeminiResponse = async (history: ChatMessage[], newMessage: string, context?: string) => {
    try {
        // Try Primary Model first
        return await generateWithModel("gemini-pro-latest", history, newMessage, context);
    } catch (primaryError: any) {
        console.warn("Primary model failed, utilizing fallback:", primaryError);
        try {
            // Fallback to Flash Model
            return await generateWithModel("gemini-flash-latest", history, newMessage, context);
        } catch (fallbackError: any) {
            console.error("All models failed:", fallbackError);
            return `I'm having trouble connecting to both primary and fallback services. Error: ${fallbackError.message || "Unknown error"}`;
        }
    }
};
