import { css } from 'glamor';
import { IButtonStyleProps } from './Button.types';
import { resetStyle } from '@react-html5up-utilities/style-reset';

export const ButtonStyles = ({
  size,
  disable,
  primary,
  icon,
}: IButtonStyleProps) => {
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

  if (primary) {
    backgroundColor = '#ffffff';
    color = '#312450';
  }

  if (disable) {
    cursor = 'default';
    opacity = '0.5';
    pointerEvents = 'none';
  }

  let styles = css({
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
  });

  if (!primary) {
    styles = css(
      styles,
      css({
        ':after': {
          transform: 'scale(0.25)',
          pointerEvents: 'none',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          background: '#ffffff',
          borderRadius: '3em',
          content: "''",
          height: '100%',
          left: 0,
          opacity: 0,
          position: 'absolute',
          top: 0,
          width: '100%',
        },
      })
    );
  }

  if (icon) {
    styles = css(
      styles,
      css({
        '& svg.svg-inline--fa': {
          marginRight: '0.75em',
        },
      })
    );
  }

  return resetStyle(styles);
};

export default ButtonStyles;
