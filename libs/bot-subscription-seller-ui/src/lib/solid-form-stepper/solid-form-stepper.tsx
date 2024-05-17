import styled from '@emotion/styled';
import Stepper from '@mui/joy/Stepper';

import { FormStep, FormStepProps } from './form-step';

export interface SolidFormStepperProps {
  steps?: FormStepProps[];
}

const SolidFormStepperStyles = styled(Stepper)`
  --Stepper-verticalGap: 2.5rem;
  --StepIndicator-size: 2.5rem;
  --Step-connectorInset: 0.5rem;
  --Step-connectorThickness: 4px;
`;

export function SolidFormStepper({
  steps,
}: SolidFormStepperProps) {
  if (!steps) {
    return null;
  }

  return (
    <SolidFormStepperStyles orientation="vertical">
      {steps.map((step) => (
        <FormStep key={step.title} {...step} />
      ))}
    </SolidFormStepperStyles>
  );
}
