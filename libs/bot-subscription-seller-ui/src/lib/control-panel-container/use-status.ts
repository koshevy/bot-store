import { useQuery } from '@tanstack/react-query';

import { useTransport } from './control-panel-transport';

export interface UseStatusProps {
  refetchInterval: number;
}

export function useStatus({
  refetchInterval,
}: UseStatusProps) {
  const transport = useTransport();

  return useQuery({
    queryKey: [`botSubscriptionSellerStatus-${transport.uuid}`],
    queryFn: transport.getStatus.bind(transport),
    refetchInterval,
  });
}
