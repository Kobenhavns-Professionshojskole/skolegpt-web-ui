import { IconFileExport, IconSettings } from '@tabler/icons-react';
import { useContext, useState, useRef, useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/pages/api/home/home.context';

import { SettingDialog } from '@/components/Settings/SettingDialog';

import { Import } from '../../Settings/Import';
import { Key } from '../../Settings/Key';
import { SidebarButton } from '../../Sidebar/SidebarButton';
import ChatbarContext from '../Chatbar.context';
import { ClearConversations } from './ClearConversations';
import { PluginKeys } from './PluginKeys';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE, DEFAULT_TOP_P } from '@/utils/app/const';

export const ChatbarSettings = () => {
  const { t } = useTranslation('sidebar');
  const [isSettingDialogOpen, setIsSettingDialog] = useState<boolean>(false);

  const {
    state: {
      apiKey,
      lightMode,
      serverSideApiKeyIsSet,
      serverSidePluginKeysSet,
      conversations,
      selectedConversation
    },
    handleUpdateConversation,
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const {
    handleClearConversations,
    handleImportConversations,
    handleExportData,
    handleApiKeyChange,
  } = useContext(ChatbarContext);

  const lastConversation = conversations[conversations.length - 1];
  const [value, setValue] = useState<string>('');
  const [temperature, setTemperature] = useState(
    lastConversation?.temperature ?? DEFAULT_TEMPERATURE,
  );
  const [topP, setTopP] = useState(
    lastConversation?.topP ?? DEFAULT_TOP_P,
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selectedConversation?.prompt) {
      setValue(selectedConversation.prompt);
    } else {
      setValue("");
    }
  }, [selectedConversation]);


  const onChangeParameter = (key: string, val: number|string) => {
    if (selectedConversation) {
      // console.log("updating conversation")
      handleUpdateConversation(selectedConversation, {
        key: key,
        value: val,
      });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValue(value);
    onChangeParameter('prompt', value)
  };

  const handleTemperatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    // console.log("CHANGING TEMP TO", newValue)
    setTemperature(newValue)
    onChangeParameter('temperature', newValue)
  };

  const handleTopPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    // console.log("CHANGING TOP P TO", newValue)
    setTopP(newValue)
    onChangeParameter('topP', newValue)
  };


  return (
    <div>
      <div className="flex flex-col border-t border-white/20 pt-2 pb-2 text-sm">
        <label className="mb-2 text-left text-white text-[14px] text-neutral-700 dark:text-white">
          {t('System Prompt')}
        </label>
        <textarea
          ref={textareaRef}
          className="w-full rounded-lg border border-neutral-200 bg-transparent px-4 py-3 text-[10px] text-neutral-100 dark:text-white dark:border-neutral-600"
          style={{
            resize: 'none',
            bottom: `${textareaRef?.current?.scrollHeight}px`,
            minHeight: '150px',
            maxHeight: '300px',
            overflow: 'auto' 
            // `${
            //   textareaRef.current && textareaRef.current.scrollHeight > 400
            //     ? 'auto'
            //     : 'hidden'
            // }`,
          }}
          placeholder={
            t(`Enter a prompt or type "/" to select a prompt...`) || ''
          }
          value={t(value) || ''}
          rows={1}
          onChange={handleChange}
        />


        <label className="mt-2 text-left text-white text-[14px] text-neutral-700 dark:text-white">
          {t('Temperature')}
        </label>
        <span className="text-center text-white text-[12px] dark:text-neutral-100">
          {temperature.toFixed(1)}
        </span>
        <input
          className="cursor-pointer"
          type="range"
          min={0.1}
          max={1}
          step={0.1}
          value={temperature}
          onChange={handleTemperatureChange}
        />

        <label className="mt-2 text-left text-white text-[14px] text-neutral-700 dark:text-white">
          {t('Top P')}
        </label>
        <span className="text-center text-white text-[12px] dark:text-neutral-100">
          {topP.toFixed(2)}
        </span>
        <input
          className="cursor-pointer"
          type="range"
          min={0.05}
          max={0.95}
          step={0.05}
          value={topP}
          onChange={handleTopPChange}
        />

      </div>
      <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
        {conversations.length > 0 ? (
          <ClearConversations onClearConversations={handleClearConversations} />
        ) : null}

        {/* <Import onImport={handleImportConversations} />

        <SidebarButton
          text={t('Export data')}
          icon={<IconFileExport size={18} />}
          onClick={() => handleExportData()}
        /> */}

        <SidebarButton
          text={t('Settings')}
          icon={<IconSettings size={18} />}
          onClick={() => setIsSettingDialog(true)}
        />

        {/* {!serverSideApiKeyIsSet ? (
          <Key apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
        ) : null} */}

        {/* {!serverSidePluginKeysSet ? <PluginKeys /> : null} */}

        <SettingDialog
          open={isSettingDialogOpen}
          onClose={() => {
            setIsSettingDialog(false);
          }}
        />
      </div>
    </div>
  );
};
