export default function handleItemDeleting<
  TValueItem extends { uuid: string; },
>(
  this: {
    onChange: (value: readonly TValueItem[]) => void;
    value: readonly TValueItem[];
  },
  deletingUuid: string,
): void {
  const { onChange, value } = this;

  onChange(
    value.filter(({ uuid }) => uuid !== deletingUuid),
  );
}
