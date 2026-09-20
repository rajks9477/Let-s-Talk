import { config } from '../../config/index.js';

export interface AIProvider {
  chat(prompt: string, history?: { role: string; content: string }[]): Promise<string>;
  summarize(text: string): Promise<string>;
  translate(text: string, targetLanguage: string): Promise<string>;
  rewrite(text: string, tone: string): Promise<string>;
}

export class MockAIProvider implements AIProvider {
  async chat(prompt: string): Promise<string> {
    const p = prompt.toLowerCase();
    if (p.includes('hello') || p.includes('hi')) {
      return "Hello! I am Aura, your AI assistant on Let's Talk. How can I help you today? ✨";
    }
    if (p.includes('summarize')) {
      return "Here is a quick summary: The discussion covers product roadmap items, next deployment sprints, and active feature validation.";
    }
    return `Aura AI Response: I analyzed your request ("${prompt}"). Everything is in order and ready to execute. Let me know if you need translations, rewriting, or deep summaries! 🚀`;
  }

  async summarize(text: string): Promise<string> {
    const lines = text.split('\n').filter(Boolean);
    return `📌 **Key Takeaways (${lines.length} points analyzed)**:\n- Core topic discussed: ${lines[0] || text.slice(0, 40)}...\n- Action items: Coordinate with team and finalize implementation.\n- Status: On schedule.`;
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    return `[Translated to ${targetLanguage}]: ${text}`;
  }

  async rewrite(text: string, tone: string): Promise<string> {
    if (tone === 'professional') {
      return `Dear Colleague, regarding our recent discussion: "${text}". I look forward to your valuable feedback.`;
    }
    if (tone === 'friendly') {
      return `Hey there! 😊 Just wanted to share: "${text}". Have an amazing day! ✨`;
    }
    return `Summary: ${text.slice(0, 80)}...`;
  }
}

export function getAIProvider(): AIProvider {
  // Can be extended with real Gemini SDK / OpenAI SDK if API keys provided
  return new MockAIProvider();
}
