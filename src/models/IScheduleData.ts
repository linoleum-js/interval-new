import { IScheduleIntervalData } from "./IScheduleIntervalData";

export interface IScheduleData {
  id: string;
  list: Array<IScheduleIntervalData>;
}