import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import FormLabel from '@mui/joy/FormLabel';
import Grid from '@mui/joy/Grid';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Switch from '@mui/joy/Switch';
import { ChangeEventHandler, useCallback } from 'react';

import { normalizeNumberString } from './normalize-number-string';
import { SubscriptionPlan } from './subscription-plan';
import { SubscriptionPlanFormStyles } from './subscription-plan-form.styles';
import {
  ErroredInput,
  ErroredMessageEditor,
} from '../errored-inputs';

export interface ErrorDescription {
  message?: string;
  type?: string;
}

export interface SubscriptionPlanFormProps {
  disabled?: boolean;
  errorDetails?: Partial<Record<keyof SubscriptionPlan | 'root', ErrorDescription>>;
  maxCost?: number;
  maxDescriptionLength?: number;
  onChange?: (value?: Partial<SubscriptionPlan>) => void;
  value?: Partial<SubscriptionPlan>;
}

const periodUnits = ['months', 'weeks', 'days'] as const;

export function SubscriptionPlanForm({
  disabled,
  errorDetails,
  maxDescriptionLength = 1024,
  maxCost = 1000000,
  onChange,
  value,
}: SubscriptionPlanFormProps) {
  const handlePeriodUnitChange = useCallback((_: unknown, newPeriodUnit: SubscriptionPlan['periodUnit'] | null) => {
    onChange?.({
      ...value,
      periodUnit: newPeriodUnit ?? periodUnits[0],
    });
  }, [
    onChange,
    value,
  ]);

  const handleCostChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => onChange?.({
      ...value,
      cost: normalizeNumberString(event.target.value, maxCost),
    }),
    [
      maxCost,
      onChange,
      value,
    ],
  );

  const handlePeriodChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => onChange?.({
      ...value,
      period: normalizeNumberString(event.target.value, 100),
    }),
    [onChange, value],
  );

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => onChange?.({
      ...value,
      title: event.target.value,
    }),
    [onChange, value],
  );

  const handleDescriptionChange = useCallback(
    (newDescription: string) => {
      onChange?.({
        ...value,
        description: newDescription,
      });
    },
    [onChange, value],
  );

  const handleIsInfinityChanged: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => onChange?.({
      ...value,
      isInfinity: event.target.checked,
    }),
    [onChange, value],
  );

  return (
    <SubscriptionPlanFormStyles>
      <Grid
        container
        spacing={2}
        columns={{
          lg: 22,
        }}
      >
        <Grid xs={12}>
          <FormLabel>Name of subscription plan</FormLabel>
          <ErroredInput
            disabled={disabled}
            errorMessage={errorDetails?.title?.message}
            onChange={handleTitleChange}
            placeholder="e.g. Monthly subscription"
            size="sm"
            value={value?.title ?? ''}
          />
        </Grid>
        <Grid xs={12} lg={10}>
          <FormLabel>Description</FormLabel>
          <ErroredMessageEditor
            className="SubscriptionPlanForm__description"
            disabled={disabled}
            errorMessage={errorDetails?.description?.message}
            compactMode
            maxSymbols={maxDescriptionLength}
            onChange={handleDescriptionChange}
            sx={{
              overflow: 'auto',
            }}
            value={value?.description ?? ''}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={4}>
          <FormLabel>Cost</FormLabel>
          <ErroredInput
            disabled={disabled}
            endDecorator={<CurrencyRubleIcon />}
            errorMessage={errorDetails?.cost?.message}
            onChange={handleCostChange}
            placeholder="e.g. 200"
            size="sm"
            type="number"
            value={value?.cost ?? ''}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={6}>
          <FormLabel>Period</FormLabel>
          <ErroredInput
            className="SubscriptionPlanForm__periodInput"
            disabled={disabled || !!value?.isInfinity}
            endDecorator={(
              <Select<NonNullable<SubscriptionPlan['periodUnit']>>
                disabled={!!value?.isInfinity}
                onChange={handlePeriodUnitChange}
                size="sm"
                value={value?.periodUnit ?? periodUnits[0]}
                variant="plain"
              >
                {periodUnits.map((unit) => (
                  <Option value={unit} key={unit}>{unit}</Option>
                ))}
              </Select>
            )}
            errorMessage={errorDetails?.period?.message}
            onChange={handlePeriodChange}
            size="sm"
            type="number"
            value={value?.period ?? ''}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={2}>
          <FormLabel>Infinity</FormLabel>
          <Switch
            disabled={disabled}
            checked={!!value?.isInfinity}
            variant="outlined"
            onChange={handleIsInfinityChanged}
            size="md"
          />
        </Grid>
      </Grid>
    </SubscriptionPlanFormStyles>
  );
}
