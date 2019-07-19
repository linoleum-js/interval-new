import { ActivityType } from "./IActivityType";

export interface IScheduleItemData {
  start: number;
  end: number;
  type: ActivityType;
  id: string;
}