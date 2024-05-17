export interface SubscriptionPlan {
  /**
   * Cost in RR
   */
  cost?: number | null;
  description?: string | null;
  /**
   * Infinity has no period.
   */
  isInfinity?: boolean | null;
  period?: number | null;
  periodUnit?: 'days' | 'weeks' | 'months' | null;
  title?: string | null;

  uuid: string;
}
