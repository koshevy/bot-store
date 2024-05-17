import { useMutation } from '@tanstack/react-query';

import { useTransport } from './control-panel-transport';

export function useStopBot() {
  const transport = useTransport();

  return useMutation({
    mutationFn: transport.stopBot.bind(transport),
    retry: false,
  });
}
