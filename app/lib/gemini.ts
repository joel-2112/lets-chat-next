import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface ChatHistory {
  role: "user" | "model";
  parts: { text: string }[];
}

export async function generateChatResponse(
  message: string,
  history: ChatHistory[] = []
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
}