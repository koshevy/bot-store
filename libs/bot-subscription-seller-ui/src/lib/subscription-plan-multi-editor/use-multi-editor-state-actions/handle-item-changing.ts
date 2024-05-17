export default function handleItemChanging<TValueItem extends { uuid: string; }>(
  this: {
    value: readonly TValueItem[];
    onChange: (value: readonly TValueItem[]) => void;
  },
  changingItemValue: Partial<TValueItem> | undefined,
  changingUuid: string,
): void {
  const {
    onChange,
    value,
  } = this;

  const index = value?.findIndex(({ uuid }) => uuid === changingUuid);
  const newItems = [...value ?? []];

  if (index === -1 || index === undefined) {
    throw new Error('Can\'t find changing subscription plan in editor state!');
  }

  newItems[index] = { ...changingItemValue, uuid: changingUuid } as TValueItem;

  onChange(newItems);
}
