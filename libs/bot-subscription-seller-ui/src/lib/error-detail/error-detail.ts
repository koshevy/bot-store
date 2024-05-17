export interface ErrorDetail<T = unknown> {
  path: string;
  message: string;
  value: T;
}
