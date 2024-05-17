import { DragEndEvent } from '@dnd-kit/core';
import { useCallback } from 'react';

import handleDragEnd from './handle-drag-end';
import handleItemAdding from './handle-item-adding';
import handleItemChanging from './handle-item-changing';
import handleItemDeleting from './handle-item-deleting';

export interface UseMultiEditorStateProps<
  TValueItem extends { uuid: string; },
> {
  createBlankItem: (ThisParameterType<typeof handleItemAdding>)['createBlankItem'];
  onChange: (value: ReadonlyArray<{ uuid: string; }>) => void;
  value: readonly TValueItem[];
}

interface MultiEditorStateManager {
  handleDragEnd: (dragEvent: DragEndEvent) => void;
  handleItemAdding: typeof handleItemAdding;
  handleItemChanging: typeof handleItemChanging;
  handleItemDeleting: typeof handleItemDeleting;
}

export function useMultiEditorStateActions<
  TValueItem extends { uuid: string; },
>({
  createBlankItem,
  onChange,
  value,
}: UseMultiEditorStateProps<TValueItem>): MultiEditorStateManager {
  return {
    handleDragEnd: useCallback(
      (dragEvent: DragEndEvent) => handleDragEnd({
        dragEvent,
        onChange,
        value,
      }),
      [onChange, value],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    handleItemAdding: useCallback(
      handleItemAdding.bind({ createBlankItem, onChange, value }),
      [onChange, value],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    handleItemChanging: useCallback(
      handleItemChanging.bind({ onChange, value }),
      [onChange, value],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    handleItemDeleting: useCallback(
      handleItemDeleting.bind({ onChange, value }),
      [onChange, value],
    ),
  };
}
