import React, { useState, useEffect } from 'react';
import { find } from 'lodash';

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
  const [openSubmenuName, setOpenSubmenuName] = useState<string|null>(null);

  const onItemClick = (item: IScheduleIntervalContextMenuItem) => {
    const { onClick, submenu, name } = item;
    if (!submenu) {
      onClick!();
      return;
    }

    setOpenSubmenuName(name);
  };

  let currentItems: IScheduleIntervalContextMenuItem[] = items;
  if (openSubmenuName) {
    currentItems = find(items, { name: openSubmenuName })!.submenu!;
  }

  return <ul
    className={css.ScheduleIntervalContextMenu}
  >
    {currentItems.map((item: IScheduleIntervalContextMenuItem) => {
      const { onClick, label, name, attrs, submenu } = item;
      return <li
        onClick={() => onItemClick(item)}
        key={name}
      >
        {label}
        {attrs &&
          <span
            className={css.ScheduleIntervalContextMenuColor}
            style={{ backgroundColor: attrs.color }}
          ></span>
        }
      </li>;
    })}
  </ul>;
};

export default ScheduleIntervalContextMenu;