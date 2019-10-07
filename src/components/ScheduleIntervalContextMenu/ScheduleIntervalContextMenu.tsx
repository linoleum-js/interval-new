import React, { useState, useEffect } from 'react';

import css from './ScheduleIntervalContextMenu.module.css';

export interface IScheduleIntervalContextMenuItem {
  name: string;
  label: string;
  onClick?: () => void;
  submenu?: IScheduleIntervalContextMenuItem[];
  attrs?: {
    color: string;
  };
}

export interface IScheduleIntervalContextMenuProps {
  items: IScheduleIntervalContextMenuItem[]
}

const ScheduleIntervalContextMenu = (props: IScheduleIntervalContextMenuProps) => {
  const { items } = props;

  return <ul
    className={css.ScheduleIntervalContextMenu}
  >
    {items.map((item: IScheduleIntervalContextMenuItem) => {
      const { onClick, label, name, attrs, submenu } = item;
      return <li
        onClick={onClick}
        key={name}
      >
        {label}
      </li>;
    })}
  </ul>;
};

export default ScheduleIntervalContextMenu;