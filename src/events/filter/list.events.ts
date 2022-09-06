export enum EWhenEventFilter {
  All = 1,
  Today,
  Tomorrow,
  ThisWeek,
  NextWeek,
}

export class ListEvents {
  when?: EWhenEventFilter = EWhenEventFilter.All;
  page?: number = 1;
  limit?: number = 10;
}
