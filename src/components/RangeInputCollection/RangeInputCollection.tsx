import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IRangeData } from '@models/IRangeData';
import { IRangeListState } from '@redux/rangeLists/RangeListsStore';
import { fetchList } from '@redux/rangeLists/RangeListsStore';
import { IAppState } from '@redux/store';
import RangeInput from '../RangeInput/RangeInput';

export interface IRangeInputCollectionProps {
}

const RangeInputCollection = (props: IRangeInputCollectionProps) => {
  const listState: IRangeListState = useSelector((state: IAppState) =>
    state.rangeLists
  );
  const { isLoading, list } = listState;

  const dispatch = useDispatch();
  useEffect(() => {
    
  });

  console.log('listState', listState);

  return <div>
    {list.map((item: IRangeData) => {
      return <RangeInput
        data={item}
      />
    })}
  </div>;
};

export default RangeInputCollection;