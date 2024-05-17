import {
  ActionPanelStatus,
  PreferencesFormValueValidated,
} from '../control-panel';
import { ErrorDetail } from '../error-detail';

export {
  PreferencesFormValueValidated,
} from '../control-panel';

export type ControlPanelTransportStatus = Omit<
ActionPanelStatus, 'check-failed'
>;

export type ControlPanelStatusMappedDto = {
  status: ControlPanelTransportStatus;
  payload?: PreferencesFormValueValidated;
};

export interface BotValueMappedDto {
  success: boolean;
}

export interface BotValueMappedDtoSuccessful {
  success: true;
  payload: PreferencesFormValueValidated;
}

export interface BotValueMappedDtoFailed {
  success: false;
  errorDetails?: ErrorDetail[];
}
