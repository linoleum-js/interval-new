import { IScheduleItemData } from "./IScheduleItemData";

export interface IScheduleData {
  id: string;
  list: Array<IScheduleItemData>;
}