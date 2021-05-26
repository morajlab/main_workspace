import { css } from 'glamor';
import type { IListProps } from './List';

export interface IListStyleProps {
  type: IListProps['type'];
}

export const ListStyles = ({ type }: IListStyleProps) => {
  let styles = {};
  let liStyles: any = {
    paddingLeft: `${type === 'ordered' ? '0.25' : '0.5'}em`,
  };

  if (type === 'ordered') {
    styles = {
      listStyle: 'decimal',
      margin: '0 0 2em 0',
      paddingLeft: '1.25em',
    };
  }

  if (type === 'unordered') {
    styles = {
      listStyle: 'disc',
      margin: '0 0 2em 0',
      paddingLeft: '1em',
    };
  }

  if (type === 'alternate') {
    styles = {
      listStyle: 'none',
      paddingLeft: 0,
    };

    liStyles = {
      borderTop: 'solid 1px rgba(255,255,255,0.15)',
      padding: '0.5em 0',
      '&:first-child': {
        borderTop: 0,
        paddingTop: 0,
      },
    };
  }

  return css(
    css(Object.assign(styles, { color: 'rgba(255,255,255,0.55)' })),
    css({ '& li': liStyles })
  );
};

export default ListStyles;
