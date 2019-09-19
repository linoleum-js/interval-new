
import { ActivityType } from '@models/ActivityType';

export const activityColor = {
  [ActivityType.Empty]: 'transparent',
  [ActivityType.Work]: 'rgb(72, 189, 84)',
  [ActivityType.Lunch]: 'rgb(255, 189, 72)',
  [ActivityType.Break]: 'rgb(255, 189, 72)',
};