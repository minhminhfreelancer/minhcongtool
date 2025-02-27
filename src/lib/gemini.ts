import { StoredApiKey } from "./storage";

export interface ChatMessage {
  content: string;
  role: "user" | "assistant";
  files?: File[];
}

export async function sendMessageToGemini(
  message: string,
  apiKey: string,
  model: string = "gemini-1.0-pro",
  maxTokens: number = 32000,
  temperature: number = 0.7,
  topP: number = 0.7,
): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: temperature,
            topP: topP,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

export function getActiveApiKey(apiKeys: StoredApiKey[]): string | null {
  const activeKey = apiKeys.find((key) => key.isActive);
  return activeKey?.key || null;
}
