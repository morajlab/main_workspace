import React, { FunctionComponent, createElement, ReactElement } from 'react';
import { ListStyles } from './List.style';

export interface IListProps {
  type: 'ordered' | 'unordered' | 'alternate';
  items: (ReactElement | string)[];
}

export const List: FunctionComponent<IListProps> = ({
  type,
  items,
  ...rest
}) => {
  let element: 'ul' | 'ol' = 'ul';
  let children: ReactElement[] = [];

  if (type === 'ordered') {
    element = 'ol';
  }

  children = items.map((item) => createElement('li', {}, item));

  return createElement(element, { ...rest, ...ListStyles({ type }) }, children);
};

export default List;
