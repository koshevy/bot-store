import {
  defaultWidgetMeta,
  WidgetMeta,
} from '@bot-store/ui-dynamic-form';

import { mapSubscriptionPlanErrors } from './map-subscription-plan-errors';
import { MessageEditor } from '../message-editor';
import {
  SubscriptionPlanMultiEditor,
  SubscriptionPlanMultiEditorError,
  SubscriptionPlanMultiEditorProps,
} from '../subscription-plan-multi-editor';

const subscriptionPlanMultiEditor: WidgetMeta<
Pick<SubscriptionPlanMultiEditorProps, 'disabled' | 'maxPlans'>,
SubscriptionPlanMultiEditorError
> = {
  widget: {
    // todo fix types of WidgetMeta.Constructor
    Constructor: SubscriptionPlanMultiEditor as any,
    defaultProps: {
      maxPlans: 10,
    },
    defaultValue: [] as SubscriptionPlanMultiEditorProps['value'],
    mapError: mapSubscriptionPlanErrors,
    noBuiltInErrorTooltip: true,
  },
};

const messageEditor: WidgetMeta<Record<string, any>> = {
  widget: {
    // todo fix types of WidgetMeta.Constructor
    Constructor: MessageEditor as any,
    defaultValue: '',
  },
};

export const preferencesFormMeta = {
  ...defaultWidgetMeta,
  messageEditor,
  subscriptionPlanMultiEditor,
};
