import styled from '@emotion/styled';
import colors from '@mui/joy/colors';
import Step from '@mui/joy/Step';
import StepIndicator, { stepIndicatorClasses } from '@mui/joy/StepIndicator';
import Typography, { typographyClasses } from '@mui/joy/Typography';
import classNames from 'classnames';
import { ReactNode, useCallback, MouseEvent } from 'react';

export interface FormStepProps {
  icon: ReactNode;
  title: string;
  status: 'valid' | 'invalid' | 'preparing';
  onClick: () => void;
}

const FormStepStyles = styled(Step)`
  --StepIndicator-size: 2.5rem;
  --Step-gap: 1rem;
  --Step-connectorRadius: 1rem;

  &.FormStep__invalid {
    cursor: pointer;
  }

  .${typographyClasses['title-sm']} {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: .65rem;
    color: ${colors.grey['700']};
  }

  :last-of-type {
    &::after {
      display: none;
    }
  }

  .${stepIndicatorClasses.root} {
    transition: background-color .7s ease;
  }
`;

export function FormStep({
  icon,
  title,
  status,
  onClick,
}: FormStepProps) {
  const variant = status === 'preparing' ? 'soft' : 'solid';
  const color = ({
    valid: 'success',
    invalid: 'danger',
    preparing: 'neutral',
  } as const)[status];
  const label = ({
    valid: 'Complete',
    invalid: 'Incomplete',
    preparing: 'Preparing',
  } as const)[status];

  const handleClick = useCallback((event: MouseEvent<HTMLElement>) => {
    if (status === 'valid') {
      return;
    }

    onClick?.();
    event?.stopPropagation();
    event?.preventDefault();
  }, [
    onClick,
    status,
  ]);

  return (
    <FormStepStyles
      className={classNames({
        FormStep__invalid: status === 'invalid',
      })}
      indicator={(
        <StepIndicator
          variant={variant}
          color={color}
        >
          {icon}
        </StepIndicator>
      )}
      onClick={handleClick}
    >
      <div>
        <Typography level="title-sm">
          {label}
        </Typography>
        <Typography level="title-md">
          {title}
        </Typography>
      </div>
    </FormStepStyles>
  );
}
