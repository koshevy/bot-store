import { useMutation } from '@tanstack/react-query';

import { useTransport } from './control-panel-transport';

export function useUpdateBot() {
  const transport = useTransport();

  return useMutation({
    mutationFn: transport.updateBot.bind(transport),
    retry: false,
  });
}
