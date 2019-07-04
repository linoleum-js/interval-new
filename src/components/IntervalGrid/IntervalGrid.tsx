import React, { useEffect } from 'react';
import { throttle } from 'lodash';

import IntervalList, { IIntervalListProps } from '../IntervalList/IntervalList';

const IntervalGrid = (props: IIntervalListProps) => {

  const onResize = throttle((event: Event) => {
    console.log('resize', document.body.clientWidth);
  }, 150);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    
    console.log('useEffect');
    
    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  return <IntervalList
    {...props}
  />
};

export default IntervalGrid;