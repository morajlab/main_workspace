import { css } from 'glamor';
import { faCheck, iconURL } from '@react-html5up-components/hyperspace/icon';

export interface IRadioStyleProps {}

export const RadioStyles = ({}: IRadioStyleProps) => {
  return css({
    appearance: 'none',
    display: 'block',
    float: 'left',
    marginRight: '-2em',
    opacity: 0,
    width: '1em',
    zIndex: -1,
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.55)',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 'normal',
    lineHeight: '1.75',
    '& + label': {
      textDecoration: 'none',
      color: 'rgba(255,255,255,0.55)',
      cursor: 'pointer',
      display: 'inline-block',
      fontSize: '1em',
      fontWeight: 'normal',
      paddingLeft: 'calc((2.75em * 0.6) + 0.75em)',
      paddingRight: '0.75em',
      position: 'relative',
      lineHeight: '1.5',
      margin: 0,
      '&:before': {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '100%',
        border: 'solid 1px rgba(255,255,255,0.15)',
        content: "''",
        display: 'inline-block',
        fontSize: '0.8em',
        height: 'calc(2.75em * 0.75)',
        left: 0,
        lineHeight: 'calc(2.75em * 0.75)',
        position: 'absolute',
        textAlign: 'center',
        top: 0,
        width: 'calc(2.75em * 0.75)',
      },
    },
    '&:checked + label': {
      '&:before': {
        background: '#ffffff',
        borderColor: '#ffffff',
        color: '#b74e91',
        content: `url('${iconURL({ icon: faCheck })}')`,
        fontStyle: 'normal',
        fontVariant: 'normal',
        textRendering: 'auto',
        textTransform: 'none !important',
        fontWeight: 900,
        cursor: 'pointer',
      },
    },
    '&:focus + label': {
      '&:before': {
        borderColor: '#ffffff',
        boxShadow: '0 0 0 1px #ffffff',
      },
    },
  });
};

export default RadioStyles;
