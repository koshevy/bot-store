import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export interface HandleDragEndProps<TValueItem extends { uuid: string; }> {
  dragEvent: DragEndEvent;
  onChange: (value: readonly TValueItem[]) => void;
  value: readonly TValueItem[];
}

export default function handleDragEnd<TValueItem extends { uuid: string; }>({
  dragEvent: { over, active },
  onChange,
  value,
}: HandleDragEndProps<TValueItem>): void {
  if (!over || active.id === over.id) {
    return;
  }

  const oldIndex = value?.findIndex(({ uuid }) => uuid === active.id);
  const newIndex = value?.findIndex(({ uuid }) => uuid === over.id);

  if (oldIndex === -1 || oldIndex === undefined) {
    throw new Error(
      'Can\'t find moving item in list of subscription plans!',
    );
  }

  if (newIndex === -1 || newIndex === undefined) {
    throw new Error(
      'Can\'t find new position of moving item in list of subscription plans!',
    );
  }

  onChange(arrayMove([...value], oldIndex, newIndex));
}
