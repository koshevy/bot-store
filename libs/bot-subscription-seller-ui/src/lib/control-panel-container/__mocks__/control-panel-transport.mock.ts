import { nanoid } from 'nanoid';

import {
  Draft,
  PreferencesFormValue,
} from '../../control-panel';
import {
  createFilledFormValueFixture,
} from '../../preferences-form/__fixtures__';
import { createErrorDetailFixture } from '../__fixtures__';
import { PreferencesFormValueValidated } from '../bot-value-mapped.dto';
import {
  BotValueUpdater,
  ControlPanelStatusMappedDto,
  ControlPanelTransport,
  ControlPanelTransportStatus,
} from '../control-panel-transport';

export class ControlPanelTransportMock implements ControlPanelTransport {
  public uuid = nanoid();

  private status: ControlPanelTransportStatus;

  private initialFormValue?: PreferencesFormValueValidated;

  private lastUpdatedFormValue?: PreferencesFormValueValidated;

  private drafts = new Map<string, Draft<PreferencesFormValue>>();

  constructor(
    /**
     * Sequence of result types, if an array.
     * If not an array — always reproduce fixed result type.
     */
    private scenario: 'success' | 'fail' | Array<'success' | 'fail'>,
    private initialStatus: ControlPanelTransportStatus,
    private delay = 1000,
  ) {
    this.status = this.initialStatus;
    this.initialFormValue = createFilledFormValueFixture() as PreferencesFormValueValidated;
    this.lastUpdatedFormValue = undefined;
  }

  /**
   * **Note!**
   * Changes value of `this.status` and `this.lastUpdatedFormValue`
   * in successful scenario
   */
  private botValueUpdater: BotValueUpdater = async (
    payload,
  ) => {
    const scenarioStep = this.scenarioStep().next().value;

    await this.waitForDelay();

    // updates status as is the case of real backend
    if (scenarioStep === 'success') {
      this.status = 'running';
      this.lastUpdatedFormValue = payload;
    }

    if (!scenarioStep) {
      throw new Error('Scenario steps of mock transport are over!');
    }

    return scenarioStep === 'success'
      ? { success: true, payload }
      : {
        success: false,
        errorDetails: ([
          'publicToken',
          'privateChannelID',
          'paymentToken',
        ] as const).map(
          (field) => createErrorDetailFixture(payload, field),
        ),
      };
  };

  getDraft(draftUuid: string) {
    return this.drafts.get(draftUuid);
  }

  getAllDrafts() {
    return Array.from(this.drafts.values());
  }

  saveDraft(draft: Draft<PreferencesFormValue>) {
    this.drafts.set(draft.uuid, draft);
  }

  setDrafts(drafts: Array<Draft<PreferencesFormValue>>) {
    this.drafts.clear();
    drafts.forEach((draft) => {
      this.drafts.set(draft.uuid, draft);
    });
  }

  async check() {
    const scenarioStep = this.scenarioStep().next().value;

    await this.waitForDelay();

    return scenarioStep === 'success';
  }

  async getStatus(): Promise<ControlPanelStatusMappedDto> {
    const { status } = this;

    await this.waitForDelay();

    if (status === 'running') {
      const payload = this.lastUpdatedFormValue
        ?? this.initialFormValue;

      return {
        status,
        payload,
      };
    }

    return { status };
  }

  async startBot(payload: PreferencesFormValueValidated) {
    return this.botValueUpdater(payload);
  }

  async stopBot() {
    const scenarioStep = this.scenarioStep().next().value;

    await this.waitForDelay();
    this.status = 'stopped';

    return {
      success: scenarioStep === 'success',
    };
  }

  async updateBot(payload: PreferencesFormValueValidated) {
    return this.botValueUpdater(payload);
  }

  private* scenarioStep() {
    if (!Array.isArray(this.scenario)) {
      yield this.scenario;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const step of this.scenario) {
      yield step;
    }
  }

  private async waitForDelay(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), this.delay);
    });
  }
}
