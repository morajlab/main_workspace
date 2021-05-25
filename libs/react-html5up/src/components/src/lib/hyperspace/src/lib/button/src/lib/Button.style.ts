import { css, after } from 'glamor';
import { IButtonProps } from './Button';

export interface IButtonStyleProps {
  size: IButtonProps['size'];
  type: IButtonProps['type'];
  disable: IButtonProps['disable'];
}

export const ButtonStyles = ({ size, disable, type }: IButtonStyleProps) => {
  let fontSize = '0.6em';
  let backgroundColor = 'transparent';
  let color = '#ffffff';
  let cursor = 'pointer';
  let opacity = '1';
  let pointerEvents = 'initial';

  if (size === 'large') {
    fontSize = '0.8em';
  } else if (size === 'small') {
    fontSize = '0.4em';
  }

  if (type === 'primary') {
    backgroundColor = '#ffffff';
    color = '#312450';
  }

  if (disable) {
    cursor = 'default';
    opacity = '0.5';
    pointerEvents = 'none';
  }

  let styles: any = {
    appearance: 'none',
    transition: 'border-color 0.2s ease',
    backgroundColor,
    border: 'solid 1px !important',
    borderColor: 'rgba(255,255,255,0.15) !important',
    borderRadius: '3em',
    color: `${color} !important`,
    cursor,
    display: 'inline-block',
    fontSize,
    opacity,
    pointerEvents,
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
      ...after({
        opacity: '0.05',
        transform: 'scale(1)',
      }),
      ':active': {
        borderColor: '#ffffff !important',
        ...after({
          opacity: '0.1',
        }),
      },
    },
  };

  if (type !== 'primary') {
    styles = css(styles, {
      ...after({
        transform: 'scale(0.25)',
        pointerEvents: 'none',
        transition: 'opacity 0.2 ease, transform 0.2 ease',
        background: '#ffffff',
        borderRadius: '3em',
        content: '',
        height: '100%',
        left: 0,
        opacity: 0,
        position: 'absolute',
        top: 0,
        width: '100%',
      }),
    });
  }

  return styles;
};

export default ButtonStyles;
