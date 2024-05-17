import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/joy/Card';
import CardOverflow, { cardOverflowClasses } from '@mui/joy/CardOverflow';
import IconButton from '@mui/joy/IconButton';
import { styled } from '@mui/joy/styles';
import Tooltip from '@mui/joy/Tooltip';

import { DragHandler, DragHandlerProps } from './drag-handler';
import {
  SubscriptionPlanForm,
  SubscriptionPlanFormProps,
} from './subscription-plan-form';

export const SubscriptionPlanPanelStyles = styled(Card)(({ theme }) => `
  background: rgba(255,255,255,.95);
  box-shadow: ${theme.vars.shadow.sm};

  .${cardOverflowClasses.root} {
    display: flex;
    padding: .4rem;
    justify-content: center;
    align-items: center;
    color: ${theme.vars.palette.neutral.solidBg};
  }

  .SubscriptionPlan__buttons {
    flex-flow: column;
    row-gap: 2rem;
    border-left: #efefef solid 3px;
  }
`);

export interface SubscriptionPlanPanelProps extends SubscriptionPlanFormProps {
  dragHandlerParams?: DragHandlerProps['dragHandlerParams'];
  isNonDeletable?: boolean;
  onDelete?: () => void;
}

export function SubscriptionPlanPanel({
  disabled,
  dragHandlerParams,
  errorDetails,
  isNonDeletable,
  maxDescriptionLength = 256,
  maxCost = 1000000,
  onChange,
  onDelete,
  value,
}: SubscriptionPlanPanelProps) {
  return (
    <SubscriptionPlanPanelStyles
      orientation="horizontal"
      variant="soft"
    >
      <CardOverflow variant="soft" color={errorDetails ? 'danger' : 'primary'}>
        <DragHandler
          dragHandlerParams={dragHandlerParams}
        />
      </CardOverflow>
      <SubscriptionPlanForm
        disabled={disabled}
        errorDetails={errorDetails}
        maxCost={maxCost}
        maxDescriptionLength={maxDescriptionLength}
        onChange={onChange}
        value={value}
      />
      <CardOverflow
        className="SubscriptionPlan__buttons"
      >
        <Tooltip title={!isNonDeletable ? 'Remove this subscription plan' : ''}>
          <IconButton
            color="neutral"
            disabled={disabled || isNonDeletable}
            variant="soft"
            size="sm"
            onClick={onDelete}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardOverflow>
    </SubscriptionPlanPanelStyles>
  );
}
