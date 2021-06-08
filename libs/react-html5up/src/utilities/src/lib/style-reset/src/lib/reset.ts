import { IResetStyleProps } from './reset.types';
import { styles as resetStyles } from '@morajlab/style-reset';

export const resetStyle = (props: IResetStyleProps) => {
  const styles = props;

  const k: any = {
    appearance: 'none',
    transition: 'border-color 0.2s ease',
    backgroundColor: '#dddddd',
    border: 'solid 1px !important',
    borderColor: 'rgba(255,255,255,0.15) !important',
    borderRadius: '3em',
    color: `#ffffff !important`,
    cursor: 'pointer',
    display: 'inline-block',
    fontSize: '14px',
    opacity: '1.0',
    pointerEvents: 'none',
    fontWeight: 'bold',
    height: 'calc(4.75em + 2px)',
    letterSpacing: '0.25em',
    lineHeight: '4.75em',
    outline: 0,
    padding: '0 3.75em',
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    ':hover': {
      borderColor: 'rgba(255,255,255,0.55) !important',
      ':after': {
        opacity: '0.05',
        transform: 'scale(1)',
      },
      ':active': {
        borderColor: '#ffffff !important',
        ':after': {
          opacity: '0.1',
        },
      },
    },
  };

  Object.keys(k).forEach((key) => {
    if (typeof k[key] === 'object') {
      ///
    }
  });

  return styles;
};

export default resetStyle;
