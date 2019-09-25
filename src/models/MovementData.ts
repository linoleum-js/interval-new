import { Direction } from "./Direction";

export interface MovementData {
  direction: Direction;
  nextStepDone: number;
  distanceInSteps: number;
  diffInMs: number;
  lastX: number;
}