import CircularProgress from '@mui/joy/CircularProgress';

import { FieldGroupStatus } from '../preferences-form';
import { FormStepProps } from '../solid-form-stepper';

export function mapFieldGroupStatus({
  Icon,
  isValid,
  title,
  ref,
}: FieldGroupStatus): FormStepProps {
  return {
    icon: Icon
      ? <Icon />
      : (
        <CircularProgress
          color="neutral"
          determinate={false}
          size="sm"
          variant="soft"
        />
      ),
    onClick: () => ref?.focus?.(),
    status: isValid ? 'valid' : 'invalid',
    title,
  };
}
