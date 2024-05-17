import { useMutation } from '@tanstack/react-query';

import { useTransport } from './control-panel-transport';

export function useStartBot() {
  const transport = useTransport();

  return useMutation({
    mutationFn: transport.startBot.bind(transport),
    retry: false,
  });
}
