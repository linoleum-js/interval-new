
import React, { CSSProperties, useEffect, useState, useRef, Ref } from 'react';
import { useSelector } from 'react-redux';

import ScheduleIntervalHandle from '../ScheduleIntervalHandle/ScheduleIntervalHandle';
import ScheduleIntervalBody from '../ScheduleIntervalBody/ScheduleIntervalBody';
import ScheduleIntervalContextMenu from '../ScheduleIntervalContextMenu/ScheduleIntervalContextMenu';
import { Direction } from '@models/Direction';
import { MovementData } from '@models/MovementData';
import { ScheduleIntervalData } from '@models/ScheduleIntervalData';
import { ActivityType } from '@models/ActivityType';
import { IUiState } from '@redux/uiState/uiStateStore';
import { IAppState } from '@redux/store';
import { stepSizeInMs, scheduleLength } from '@constants/constants';
import { activityColor } from '@constants/schedule';

import css from './ScheduleInterval.module.css';

export interface IScheduleIntervalProps {
  data: ScheduleIntervalData;
  onChangeFinish: () => void;
  intervalId: string;
  inputId: string;
  onResizeLeft: (movementData: MovementData, id: string) => void;
  onResizeRight: (movementData: MovementData, id: string) => void;
  onMove: (movementData: MovementData, id: string) => void;
  onFocus: (id: string) => void;
  onMenuOpen: (id: string|null) => void;
  isInFocus: boolean;
  isMenuOpen: boolean;
  onRemove: (id: string) => void;
  onCreate: (id: string, position: Direction) => void;
  onTypeChange: (id: string, type: ActivityType) => void;
  canCreateInside: boolean;
}

const ScheduleInterval = (props: IScheduleIntervalProps) => {
  const uiState: IUiState = useSelector((state: IAppState) => state.uiState);
  const [menuPosition, setMenuPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const element: Ref<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const { onChangeFinish, onFocus, isInFocus, onMove, onMenuOpen,
    isMenuOpen, onRemove, onCreate, onTypeChange, canCreateInside } = props;
  const { data } = props;

  const { start, end, type, id } = data;
  const isEmpty: boolean = type === ActivityType.Empty;
  const { stepSizeInPixels } = uiState;

  const toPixels = (value: number): number => {
    return value * stepSizeInPixels / stepSizeInMs;
  };
  
  const style: CSSProperties = {
    left: toPixels(start),
    width: toPixels(end - start),
    backgroundColor: activityColor[type],
  };

  const onResizeLeft = (movementData: MovementData) => {
    props.onResizeLeft(movementData, id);
  };

  const onResizeRight = (movementData: MovementData) => {
    props.onResizeRight(movementData, id);
  };

  const onBodyMove = (movementData: MovementData) => {
    if (isEmpty) {
      return;
    }
    onMove(movementData, id);
  };

  const onContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY } = event;
    setMenuPosition({ x: clientX, y: clientY });
    event.preventDefault();
    onMenuOpen(id);
  };

  const getCreationPosition = (): Direction => {
    const { x, width } = element.current!.getBoundingClientRect() as DOMRect;
    const diff: number = menuPosition.x - x;
    return diff < width / 2 ? Direction.Left : Direction.Right;
  };

  const onDocumentContextMenu = () => {
    onMenuOpen(null);
  };

  useEffect(() => {
    document.addEventListener('contextmenu', onDocumentContextMenu);
    return () => {
      document.removeEventListener('contextmenu', onDocumentContextMenu);
    };
  });

  let contextMenuItems = [{
    name: 'typeChange',
    label: 'Change type',
    onClick: () => {
      console.log('change type');
    }
  }];

  if (canCreateInside) {
    contextMenuItems = [{
      name: 'create',
      label: 'Create',
      onClick: () => onCreate(id, getCreationPosition())
    }, ...contextMenuItems];
  }

  if (!isEmpty) {
    contextMenuItems = [{
      name: 'remove',
      label: 'Remove',
      onClick: () => onRemove(id)
    }, ...contextMenuItems];
  }

  return <div
    className={css.ScheduleInterval}
    style={style}
    onPointerDown={() => onFocus(id)}
    onContextMenu={onContextMenu}
    ref={element}
  >
    {!isEmpty && isInFocus &&
      <>
        <ScheduleIntervalHandle
          direction={Direction.Left}
          value={start}
          onMove={onResizeLeft}
          onMoveEnd={onChangeFinish}
        />
        <ScheduleIntervalHandle
          direction={Direction.Right}
          value={end}
          onMove={onResizeRight}
          onMoveEnd={onChangeFinish}
        />
      </>
    }

    <ScheduleIntervalBody
      onMove={onBodyMove}
      onMoveEnd={() => {
        if (isEmpty) {
          return;
        }
        onChangeFinish();
      }}
    />

    {isMenuOpen &&
      <ScheduleIntervalContextMenu
        items={contextMenuItems}
      />
    }

    {/* {id} */}
  </div>;
};

export default ScheduleInterval;