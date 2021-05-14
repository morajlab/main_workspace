import type { ButtonStyleFunction, IButtonStyles } from './button.d';

export const buttonStyles: ButtonStyleFunction = ({ type }) => {
  const sharedStyles: IButtonStyles = {
    lineHeight: '16px',
    fontSize: '13px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    color: 'rgba(255, 255, 255, 1)',
    fontStyle: 'normal',
    fontWeight: 'normal',
    borderRadius: '6px',
    userSelect: 'none',
    cursor: 'default',
    outline: 'none',
    boxShadow: '0 1px rgba(0, 0, 0, .039)',
    padding: '4px 13px',
  };
  let styles: IButtonStyles = {};

  if (type === 'gradient') {
    styles = {
      backgroundImage: 'linear-gradient(to bottom, #6cb3fa 0%, #087eff 100%)',
      borderTopColor: '#4ca2f9',
      borderBottomColor: '#015cff',
      borderLeftColor: '#267ffc',
      borderRightColor: '#267ffc',
      borderWidth: '1px',
      borderStyle: 'solid',
      ':active': {
        backgroundImage: 'linear-gradient(to bottom, #4c98fe 0%, #0564e3 100%)',
        borderTopColor: '#247fff',
        borderBottomColor: '#003ddb',
        borderLeftColor: '#125eed',
        borderRightColor: '#125eed',
        color: 'rgba(255, 255, 255, .9)',
      },
    };
  } else if (type === 'flat') {
    styles = {
      background: 'rgba(1,122,255,1)',
      ':active': {},
    };
  }

  return Object.assign(styles, sharedStyles);
};
