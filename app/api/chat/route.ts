import { NextResponse } from "next/server";
import { generateChatResponse } from "../../lib/gemini";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const reply = await generateChatResponse(message, history);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from Gemini" },
      { status: 500 }
    );
  }
}