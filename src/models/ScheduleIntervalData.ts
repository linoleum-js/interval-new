import uuid from 'uuid';

import { ActivityType } from "./ActivityType";

export class ScheduleIntervalData {
  start: number;
  end: number;
  type: ActivityType;
  id: string;

  constructor(start: number, end: number, type: ActivityType, id?: string) {
    this.start = start;
    this.end = end;
    this.type = type;
    this.id = id ? id : uuid();
  }
}
