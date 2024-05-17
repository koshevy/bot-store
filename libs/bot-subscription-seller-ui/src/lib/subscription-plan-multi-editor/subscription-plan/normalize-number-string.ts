export function normalizeNumberString(
  stringNumber: string,
  max: number,
  min = 1,
): number {
  let result = parseInt(stringNumber, 10) || 0;

  if (result < min) {
    result = min;
  }

  if (result > max) {
    result = max;
  }

  return result;
}
