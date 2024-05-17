export default function handleItemAdding<TValueItem extends {
  uuid: string;
}>(this: {
  createBlankItem: (position: number) => TValueItem;
  onChange: (value: readonly TValueItem[]) => void,
  value: readonly TValueItem[];
}): void {
  const { createBlankItem, onChange, value } = this;

  onChange([
    ...value ?? [],
    Object.freeze<TValueItem>({
      ...createBlankItem(value?.length ?? 0),
    } as TValueItem),
  ]);
}
