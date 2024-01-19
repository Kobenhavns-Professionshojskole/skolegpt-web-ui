import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE, DEFAULT_TOP_P } from '@/utils/app/const';
import { HFModelNotReady } from '@/utils/server/huggingface';
import { HuggingFaceStream } from '@/utils/server/huggingface';

import { ChatBody, Message } from '@/types/chat';

// import llamaTokenizer from 'llama-tokenizer-js'

const llamaTokenizer = require('llama-tokenizer-js').default;

export const config = {
  runtime: 'edge',
};

// Message format:
// 
// <s>[INST] <<SYS>>
// {{ system_prompt }}
// <</SYS>>

// {{ user_msg_1 }} [/INST] {{ model_answer_1 }} </s><s>[INST] {{ user_msg_2 }} [/INST]


const llama2Format = (sysPrompt: string, msgs: Message[]): string => {
  let result = "<s>[INST] <<SYS>>\n"
  result += sysPrompt
  result += "\n<</SYS>>\n\n"

  for (const msg of msgs) {
    result += msg.content
    result += msg.role === "assistant" ? "</s><s>[INST]" : "[/INST]";
  }
  return result
};


const handler = async (req: Request): Promise<Response> => {
  try {
    const { model, messages, prompt, temperature, topP } = (await req.json()) as ChatBody;
    let promptToSend = prompt;
    // if (!promptToSend) {
    //   promptToSend = DEFAULT_SYSTEM_PROMPT;
    // }
    let temperatureToUse = temperature;
    if (temperatureToUse == null) {
      temperatureToUse = DEFAULT_TEMPERATURE;
    }
    let topPToUse = topP;
    if (topPToUse == null) {
      topPToUse = DEFAULT_TOP_P;
    }

    let messagesToSend: Message[] = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const tokens = llamaTokenizer.encode(llama2Format(promptToSend, [message, ...messagesToSend]))
      if (tokens.length > model.tokenLimit - 25) {
        break;
      }
      messagesToSend = [message, ...messagesToSend];
    }
    if (messagesToSend.length === 0){
      throw new RangeError('Den sendte besked er for lang. Forsøg igen med en kortere tekst');
    }
    // console.log({model, promptToSend, temperatureToUse, key, messagesToSend})

    // console.log("FROM THE FORMATTER::::")
    // console.log(llama2Format(promptToSend, messagesToSend))
    const formattedMessages = llama2Format(promptToSend, messagesToSend)
    console.log("Sending request of token length:", formattedMessages.length)
    const stream = await HuggingFaceStream(temperatureToUse, topPToUse, formattedMessages);

    return new Response(stream);
  } catch (error) {
    console.log("Encountered the following error in skole.ts")
    console.log(error)
    if (error instanceof HFModelNotReady || error instanceof RangeError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else if (error instanceof Error) {
      const errText = error?.message || "Error with no message";
      return new Response('Error', { status: 500, statusText: errText});
    }
    else {
      return new Response('Error', { status: 500 })
    }
  }
};

export default handler;
