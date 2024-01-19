import { HfInferenceEndpoint } from '@huggingface/inference'

import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';

const isModelRunning = async (org: string, modelName: string, accessToken: string) => {
  const url = `https://api.endpoints.huggingface.cloud/v2/endpoint/${org}/${modelName}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  // Parsing the JSON response
  const result = await response.json();
  const running = result.status.state === 'running';
  return running
};

export class HFModelNotReady extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HFModelNotReady';
  }
}

export const HuggingFaceStream = async (
  temperature: number, 
  topP: number, 
  formattedMessages: string
) => {
  // Load endpoint and accessToken from Env Variables
  const endpoint = process.env.SKOLE_ENDPOINT || '';
  const accessToken = process.env.SKOLE_ACCESS_TOKEN || '';
  const org = process.env.SKOLE_HF_ORGANIZATION || '';
  const modelName = process.env.SKOLE_HF_MODEL_NAME || '';

  //generation parameter
  const gen_kwargs = {
    max_new_tokens: 1024,
    top_k: 50,
    top_p: topP,
    temperature: temperature,
    stop_sequences: ['</s>'],
  }
  const hf = new HfInferenceEndpoint(endpoint, accessToken)
  const HFstream = hf.textGenerationStream({ inputs: formattedMessages, parameters: gen_kwargs })
  // Check if model is running
  const modelRunning = await isModelRunning(org, modelName, accessToken)
  if (!modelRunning) {
    // wake model by sending a sync request, this will throw a bad gateway error which we can ignore
    try {
      await hf.textGeneration({ inputs: formattedMessages, parameters: gen_kwargs })
    } catch (error) {
      if ((error as Error).message != "Bad Gateway"){
        throw error;
      }
    }
    throw new HFModelNotReady('Modellen er igang med at starte op. Vent 5 min og prøv igen');
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          try {
            const json = JSON.parse(data);
            if (json.token.special == true || json.generated_text != null) {
              // console.log("CLOSING STREAM")
              controller.close();
              return;
            }
            const text = json.token.text;
            if (text.length !== 0) {
              // console.log("SEDNING TEXT '" + text + "'")
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            }
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of HFstream as any) {
        // console.log("data: " + JSON.stringify(chunk));
        parser.feed("data: " + JSON.stringify(chunk) + "\n\n");
      }
    },
  });

  return stream;
};
