export interface Draft<TPayload extends object> {
  dateTime: string;
  payload: TPayload;
  uuid: string;
}
