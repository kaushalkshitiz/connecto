// =============================================================================
// Athlete Risk Intelligence Platform — Local AI Chat Proxy
// Forwards chat messages to a locally-running Ollama instance (e.g. gemma4).
// This route never predicts risk or invents athlete data — it is purely a
// conversational assistant per CLAUDE.md's AI Rules.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma4';

interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  let body: { messages?: OllamaMessage[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: 'A non-empty "messages" array is required.' },
      { status: 400 }
    );
  }

  try {
    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      return NextResponse.json(
        {
          error: `Ollama returned status ${ollamaResponse.status}. Make sure the "${OLLAMA_MODEL}" model is pulled (ollama pull ${OLLAMA_MODEL}).`,
        },
        { status: 502 }
      );
    }

    const data = await ollamaResponse.json();
    const reply: string | undefined = data?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: 'Ollama returned an empty response.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      {
        error: `Could not reach the local Ollama server at ${OLLAMA_URL}. Make sure "ollama serve" is running.`,
      },
      { status: 503 }
    );
  }
}
