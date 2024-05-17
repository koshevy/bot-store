export type NonNever<T, TFallback = any> = [T] extends [never] ? TFallback : T;
