import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import { styled } from '@mui/joy/styles';
import { nanoid } from 'nanoid';
import {
  FocusEventHandler,
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ensureObjectsHasUuid } from './ensure-objects-has-uuid';
import {
  SortableItemMemo,
  SortableSubscriptionPlanProps,
} from './sortable-subscription-plan';
import { SubscriptionPlan } from './subscription-plan';
import {
  useMultiEditorStateActions,
  UseMultiEditorStateProps,
} from './use-multi-editor-state-actions';

export type SubscriptionPlanMultiEditorError = SortableSubscriptionPlanProps['errorDetails'];

export interface SubscriptionPlanMultiEditorProps extends Pick<UseMultiEditorStateProps<
SubscriptionPlan
>, 'onChange' | 'value'> {
  disabled?: boolean;
  maxPlans?: number;
  /**
   * Errors are related by UUID
   */
  errorDetails?: Record<string, SubscriptionPlanMultiEditorError>;
  onBlur?: (event: unknown) => void;
  /**
   * Necessary for testing. Used `nanoid` by default.
   */
  nonStable__uuidGeneratorFn?: (position: number) => string;
}

const SubscriptionPlanMultiEditorStyles = styled(Stack)`
  position: relative;

  > :has([aria-pressed]) {
    z-index: 100;
  }
`;

const defaultUuidGenerator = nanoid.bind({}, 12);

export const SubscriptionPlanMultiEditor = forwardRef<
HTMLDivElement,
SubscriptionPlanMultiEditorProps
>(({
  disabled,
  errorDetails,
  maxPlans = 6,
  onBlur,
  onChange,
  value: rawValue,
  nonStable__uuidGeneratorFn = defaultUuidGenerator,
}, ref) => {
  /** memoized to prevent redundant triggering in {@link useMultiEditorStateActions} */
  const createBlankItem = useCallback((position: number): SubscriptionPlan => ({
    uuid: nonStable__uuidGeneratorFn(position),
    period: 1,
    periodUnit: 'weeks',
  }), [nonStable__uuidGeneratorFn]);

  // memoized to prevent re-rendering when default value is used
  const defaultValue = useMemo<
  Array<Partial<SubscriptionPlan> & { uuid: string }>
  >(() => [
    createBlankItem(0),
  ], [createBlankItem]);

  const [actualValue, setActualValue] = useState(
    ensureObjectsHasUuid(rawValue, defaultValue),
  );

  useLayoutEffect(() => {
    setActualValue(
      ensureObjectsHasUuid(rawValue, defaultValue),
    );
  }, [
    defaultValue,
    rawValue,
  ]);

  const {
    handleDragEnd,
    handleItemAdding,
    handleItemChanging,
    handleItemDeleting,
  } = useMultiEditorStateActions<SubscriptionPlan>({
    createBlankItem,
    onChange,
    value: actualValue,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const rootRef = useRef<HTMLDivElement | null>(null);
  const handleBlur = useCallback<FocusEventHandler>((event) => {
    if (rootRef.current && !rootRef.current?.contains(event.relatedTarget)) {
      onBlur?.(event);
    }
  }, [
    rootRef,
    onBlur,
  ]);

  const addPlanButton = useMemo(() => (
    <Button
      disabled={disabled}
      onClick={handleItemAdding}
      startDecorator={<PriceChangeIcon />}
      variant="soft"
    >
      Add new subscription plan
    </Button>
  ), [
    disabled,
    handleItemAdding,
  ]);

  useEffect(() => {
    if (typeof ref === 'function') {
      ref(rootRef.current ?? null);
    }
  }, [
    ref,
  ]);

  return (
    <SubscriptionPlanMultiEditorStyles
      direction="column"
      spacing={2}
      onBlurCapture={handleBlur}
      ref={rootRef}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={actualValue?.map(({ uuid = nanoid() }) => uuid)}
          strategy={verticalListSortingStrategy}
        >
          {actualValue?.map(({ uuid }, index) => (
            <SortableItemMemo
              disabled={disabled}
              errorDetails={errorDetails?.[uuid]}
              isSole={actualValue.length < 2}
              key={uuid}
              onChange={handleItemChanging}
              onDelete={handleItemDeleting}
              uuid={uuid}
              value={actualValue?.[index]}
            />
          ))}
        </SortableContext>
      </DndContext>
      {actualValue.length < maxPlans ? addPlanButton : null}
    </SubscriptionPlanMultiEditorStyles>
  );
});
