import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo } from 'react';

import {
  SubscriptionPlanPanel,
  SubscriptionPlan,
  SubscriptionPlanPanelProps,
} from './subscription-plan';

export interface SortableSubscriptionPlanProps {
  disabled?: boolean;
  errorDetails?: SubscriptionPlanPanelProps['errorDetails'];
  isSole?: boolean;
  onChange?: (
    value: Partial<SubscriptionPlan> | undefined,
    uuid: string,
  ) => void;
  onDelete?: (uuid: string) => void;
  uuid: string;
  value?: Partial<SubscriptionPlan>;
}

export function SortableSubscriptionPlan({
  disabled,
  errorDetails,
  isSole,
  onChange,
  onDelete,
  uuid,
  value,
}: SortableSubscriptionPlanProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: uuid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandlerParams = !disabled && !isSole
    ? { ...attributes, ...listeners }
    : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      <SubscriptionPlanPanel
        disabled={disabled}
        errorDetails={errorDetails}
        isNonDeletable={isSole}
        dragHandlerParams={dragHandlerParams}
        onChange={(newValue) => onChange?.(newValue, uuid)}
        onDelete={() => onDelete?.(uuid)}
        value={value}
      />
    </div>
  );
}

export const SortableItemMemo = memo(SortableSubscriptionPlan);
