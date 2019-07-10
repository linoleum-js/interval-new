import { IRangeItemData } from "./IRangeItemData";


export const REQUEST_RANGE_LIST = 'REQUEST_RANGE_LIST';
export const RECEIVE_RANGE_LIST = 'RECEIVE_RANGE_LIST';
export const UPDATE_RANGE_LIST = 'FETCH_RANGE_LIST';

export interface RequestRangeList {
  type: typeof REQUEST_RANGE_LIST
}

export interface ReceiveRangeList {
  type: typeof RECEIVE_RANGE_LIST,
  payload: Array<IRangeItemData>
}

export interface UpdateRange {
  type: typeof RECEIVE_RANGE_LIST,
  payload: IRangeItemData
}

export type RangeActionType =
  RequestRangeList |
  ReceiveRangeList |
  UpdateRange;
