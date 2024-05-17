import { createContext, useContext } from 'react';

import {
  BotValueMappedDto,
  BotValueMappedDtoFailed,
  BotValueMappedDtoSuccessful,
} from './bot-value-mapped.dto';
import {
  ActionPanelStatus,
  Draft,
  PreferencesFormValueValidated,
  PreferencesFormValue,
} from '../control-panel';

export type ControlPanelTransportStatus = ActionPanelStatus;

export type ControlPanelStatusMappedDto = {
  status: ControlPanelTransportStatus;
  payload?: PreferencesFormValueValidated;
};

export type BotValueUpdater = (value: PreferencesFormValueValidated) => Promise<
BotValueMappedDto & (
  | BotValueMappedDtoSuccessful
  | BotValueMappedDtoFailed
)
>;

export interface ControlPanelTransport {
  check: () => Promise<boolean>;

  getDraft: (draftUuid: string) => Draft<PreferencesFormValue> | undefined;
  getAllDrafts: () => Array<Draft<PreferencesFormValue>>;
  saveDraft: (draft: Draft<PreferencesFormValue>) => void;
  setDrafts: (allDrafts: Array<Draft<PreferencesFormValue>>) => void;

  getStatus: () => Promise<ControlPanelStatusMappedDto>;
  startBot: BotValueUpdater;
  stopBot: () => Promise<BotValueMappedDto>;
  updateBot: BotValueUpdater;
  /**
   * Unique ID of this transport. Needed for request caching.
   */
  uuid: string;
}

export const ControlPanelTransportContext = createContext<
ControlPanelTransport | null
>(null);

export function useTransport(): ControlPanelTransport {
  const transport = useContext(ControlPanelTransportContext);

  if (!transport) {
    throw new Error('ControlPanelTransportContext should be set!');
  }

  return transport;
}
