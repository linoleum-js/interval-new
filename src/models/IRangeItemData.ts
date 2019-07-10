import { ActivityType } from "./IActivityType";

export interface IRangeItemData {
  start: number;
  end: number;
  type: ActivityType;
  id: string;
}