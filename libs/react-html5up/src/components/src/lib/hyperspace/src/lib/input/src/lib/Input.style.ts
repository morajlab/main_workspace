import { css } from 'glamor';

export interface IInputStyleProps {}

export const InputStyles = ({}: IInputStyleProps) => {
  return css({
    height: '2.75em',
    appearance: 'none',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '0.25em',
    border: 'solid 1px rgba(255, 255, 255, 0.15)',
    color: 'rgba(255,255,255,0.55)',
    display: 'block',
    outline: 0,
    padding: '0 1em',
    textDecoration: 'none',
    width: '100%',
    fontSize: '13pt',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 'normal',
    lineHeight: '1.75',
    '&:invalid': {
      boxShadow: 'none',
    },

    '&:focus': {
      borderColor: '#ffffff',
      boxShadow: '0 0 0 1px #ffffff',
    },
  });
};

export default InputStyles;
