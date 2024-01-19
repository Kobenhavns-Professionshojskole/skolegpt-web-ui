export interface HFModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
}

export enum SkoleModelID {
  LLAMA2_13B = 'llama2-13b'
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = SkoleModelID.LLAMA2_13B;

export const SkoleModels: Record<SkoleModelID, HFModel> = {
  [SkoleModelID.LLAMA2_13B]: {
    id: SkoleModelID.LLAMA2_13B,
    name: 'Llama2 13B',
    maxLength: 12000,
    tokenLimit: 1024,
  }
};
