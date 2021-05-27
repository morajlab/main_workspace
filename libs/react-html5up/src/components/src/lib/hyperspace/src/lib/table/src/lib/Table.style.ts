import { css } from 'glamor';
import type { ITableProps } from './Table';

export interface ITableStyleProps {
  type: ITableProps['type'];
}

export const TableStyles = ({ type }: ITableStyleProps) => {
  const styles = {
    WebkitOverflowScrolling: 'touch',
    overflowX: 'auto',
    color: 'rgba(255,255,255,0.55)',
    '& table': Object.assign(
      {
        margin: '0 0 2em 0',
        width: '100%',
        borderSpacing: 0,
        '& tbody tr': Object.assign(
          {
            border: 'solid 1px rgba(255,255,255,0.15)',
            borderLeft: 0,
            borderRight: 0,
            '&:nth-child(2n + 1)': {
              backgroundColor: 'rgba(255,255,255,0.05)',
            },
          },
          {
            '& td': {
              border: 'solid 1px rgba(255,255,255,0.15)',
              borderLeftWidth: 0,
              borderTopWidth: 0,
              '&:first-child': {
                borderLeftWidth: '1px',
              },
            },
            '&:first-child': {
              '& td': {
                borderTopWidth: '1px',
              },
            },
          }
        ),
        '& td': {
          padding: '0.75em 0.75em',
        },
        '& th': {
          color: '#ffffff',
          fontSize: '1em',
          fontWeight: 'bold',
          padding: '0 0.75em 0.75em 0.75em',
          textAlign: 'left',
        },
        '& thead': {
          borderBottom:
            type === 'alternate'
              ? 0
              : 'solid calc(1px * 2) rgba(255,255,255,0.15)',
        },
        '& tfoot': {
          borderTop:
            type === 'alternate'
              ? 0
              : 'solid calc(1px * 2) rgba(255,255,255,0.15)',
        },
      },
      type === 'alternate'
        ? { borderCollapse: 'separate' }
        : {
            borderCollapse: 'collapse',
          }
    ),
  };

  return css(styles);
};

export default TableStyles;
