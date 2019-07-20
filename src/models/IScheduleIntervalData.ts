import { ActivityType } from "./IActivityType";

export interface IScheduleIntervalData {
  start: number;
  end: number;
  type: ActivityType;
  id: string;
}