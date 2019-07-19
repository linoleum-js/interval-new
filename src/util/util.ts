import { MovementData } from "@models/MovementData";
import { Direction } from "@models/Direction";


export const pad2 = (value: string) => {
  return value.length === 2 ? value : `0${value}`;
};

const msInMinute = 60 * 1000;

export const msToHHMM = (timeMs: number): string => {
  const totalMinutes = timeMs / msInMinute;
  const hours = String(Math.floor(totalMinutes / 60));
  const minutes = String(Math.floor(totalMinutes % 60));
  return `${pad2(hours)}:${pad2(minutes)}`;
};

export const getMovementdata = (x1: number, x0: number, step: number): MovementData => {
  // console.log(x1, x0, step);
  const diff: number = x1 - x0;
  const distance: number = Math.abs(diff);
  const distanceInSteps: number = Math.floor(distance / step);
  const direction: Direction = diff > 0 ? Direction.Right : Direction.Left;
  const nextStepDone: number = distance % distanceInSteps;
  // console.log('nextStepDone', nextStepDone);
  const newLastX = direction === Direction.Right ?
    x1 - nextStepDone:
    x1 + nextStepDone;

  return {
    nextStepDone,
    direction,
    distanceInSteps,
    lastX: newLastX
  };
};