import { createContext } from 'react';

export const DefaultErrorMessagesContext = createContext<
Record<string, string>
>({
  required: 'This field is required',
});
