interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AgentConfig {
  name: string;
  model_provider: "openai" | "xai";
  model_name: string;
  personality_traits?: string[];
  temperature?: number;
}

export async function getAgentResponse(
  agent: AgentConfig,
  messages: ChatMessage[],
  chatId?: number
) {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent,
        messages,
        chatId,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI Service Error: ${error}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error: any) {
    throw new Error(`AI Service Error: ${error.message}`);
  }
}