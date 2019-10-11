
export enum ActivityType {
  Empty,
  Work,
  Lunch,
  Break
}

const { Empty, Work, Lunch, Break } = ActivityType;

export const activityTypeArray: ActivityType[] = [
  Empty, Work, Lunch, Break
];

export const activityTypeNames = {
  [Empty]: 'Empty',
  [Work]: 'Work',
  [Lunch]: 'Lunch',
  [Break]: 'Break',
};

export const activityColor = {
  [Empty]: 'rgb(217, 217, 217)',
  // [Empty]: 'green',
  [Work]: 'rgb(72, 189, 84)',
  [Lunch]: 'rgb(255, 189, 72)',
  [Break]: 'rgb(193, 69, 255)',
};

