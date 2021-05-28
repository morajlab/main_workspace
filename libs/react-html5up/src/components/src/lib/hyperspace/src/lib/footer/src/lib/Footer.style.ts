import { css } from 'glamor';

export interface IFooterStyleProps {}

export const FooterStyles = ({}: IFooterStyleProps) => {
  return {
    root: css({
      marginLeft: '18em',
      backgroundColor: '#261c3e',
      position: 'relative',
      display: 'block',
      margin: 0,
      padding: 0,
      border: 0,
      fontFamily: 'Arial, Helvetica, sans-serif',
      color: 'rgba(255, 255, 255, 0.55)',
    }),
    menu: css({
      fontSize: '0.8em',
      color: 'rgba(255,255,255,0.15)',
      listStyle: 'none',
      padding: 0,
      margin: '0 0 2em 0',
      border: 0,
      '& li': {
        border: 0,
        borderLeft: 'solid 1px rgba(255, 255, 255, 0.15)',
        display: 'inline-block',
        lineHeight: 1,
        margin: '0 0 0 1.5em',
        padding: '0 0 0 1.5em',
        verticalAlign: 'baseline',
        listStyle: 'none',
        '&:first-child': {
          borderLeft: 0,
          margin: 0,
          paddingLeft: 0,
        },
      },
    }),
    inner: css({
      margin: '0 auto',
      padding: '4em 4em 2em 4em',
      maxWidth: '100%',
      width: '75em',
      border: 0,
      '& a': {
        border: 0,
        borderBottom: 'dotted 1px rgba(255,255,255,0.15)',
        transition: 'color 0.2s ease, border-bottom-color 0.2s ease',
        color: 'inherit',
        textDecoration: 'none',
        margin: 0,
        padding: 0,
        verticalAlign: 'baseline',
        '&:hover': {
          borderBottomColor: 'transparent',
          color: '#ffffff',
        },
      },
    }),
  };
};

export default FooterStyles;
