import { css } from 'glamor';

export interface ILinkStyleProps {}

export const LinkStyles = ({}: ILinkStyleProps) => {
  return css({
    transition: 'color 0.2s ease, border-bottom-color 0.2s ease',
    borderBottom: 'dotted 1px rgba(255,255,255,0.35)',
    color: 'rgba(255,255,255,0.55)',
    textDecoration: 'none',
    ':hover': {
      borderBottomColor: 'transparent',
      color: '#ffffff',
    },
  });
};

export default LinkStyles;
