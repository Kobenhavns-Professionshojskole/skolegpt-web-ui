import { KeyValuePair } from './data';

export interface Plugin {
  id: PluginID;
  name: PluginName;
  requiredKeys: KeyValuePair[];
}

export interface PluginKey {
  pluginId: PluginID;
  requiredKeys: KeyValuePair[];
}

export enum PluginID {
  GOOGLE_SEARCH = 'google-search',
  SKOLE_GPT = "skolegpt"
}

export enum PluginName {
  GOOGLE_SEARCH = 'Google Search',
  SKOLE_GPT = 'SkoleGPT',
}

export const Plugins: Record<PluginID, Plugin> = {
  [PluginID.GOOGLE_SEARCH]: {
    id: PluginID.GOOGLE_SEARCH,
    name: PluginName.GOOGLE_SEARCH,
    requiredKeys: [
      {
        key: 'GOOGLE_API_KEY',
        value: '',
      },
      {
        key: 'GOOGLE_CSE_ID',
        value: '',
      },
    ],
  },
  [PluginID.SKOLE_GPT]: {
    id: PluginID.SKOLE_GPT,
    name: PluginName.SKOLE_GPT,
    requiredKeys: [],
  }
};

export const PluginList = Object.values(Plugins);
