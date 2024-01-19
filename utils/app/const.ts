export const DEFAULT_SYSTEM_PROMPT =
  process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
  "Du er SkoleGPT, en dansk sprogmodel udviklet særligt for Københavns Professionshøjskole. Du bygger på modellen Llama 2 trænet af Meta. Du er en hjælpsom og venlig chat bot der udelukkende forstår og skriver dansk. Du vil altid svare på dansk og ingen andre sprog. Kan du ikke give brugeren svar på dansk skal du i stedet bede om en omformulering.";

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const DEFAULT_TEMPERATURE = 
  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_TEMPERATURE || "0.7");

export const DEFAULT_TOP_P = 
  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_TOP_P || "0.95");

export const OPENAI_API_TYPE =
  process.env.OPENAI_API_TYPE || 'openai';

export const OPENAI_API_VERSION =
  process.env.OPENAI_API_VERSION || '2023-03-15-preview';

export const OPENAI_ORGANIZATION =
  process.env.OPENAI_ORGANIZATION || '';

export const AZURE_DEPLOYMENT_ID =
  process.env.AZURE_DEPLOYMENT_ID || '';
