import { OpenAIModel } from './openai';
import { HFModel } from './skole';

export interface Message {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user';

export interface ChatBody {
  model: HFModel;
  messages: Message[];
  prompt: string;
  temperature: number;
  topP: number;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  model: HFModel;
  prompt: string;
  temperature: number;
  topP: number;
  folderId: string | null;
}
