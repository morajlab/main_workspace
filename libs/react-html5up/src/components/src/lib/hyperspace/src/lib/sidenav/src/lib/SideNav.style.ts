import { css } from 'glamor';

export interface ISideNavStyleProps {
  navsCount: number;
}

export const SideNavStyles = ({ navsCount }: ISideNavStyleProps) => {
  const liNthList = {};

  for (let i = 1; i <= navsCount; i++) {
    Object.assign(liNthList, {
      [`'&:nth-child(${i})'`]: {
        transitionDelay: `'${0.2 * i + 0.25}s'`,
      },
    });
  }

  return {
    activeItem: css({
      color: '#ffffff !important',
      '&:after': {
        maxWidth: '100% !important',
      },
    }),
    nav: css({
      display: 'block',
      margin: 0,
      padding: 0,
      border: 0,
      '& > ul': {
        listStyle: 'none',
        padding: 0,
        margin: '0 0 2em 0',
        border: 0,
        '& > li': {
          transform: 'translateY(0)',
          transition: 'opacity 0.15s ease, transform 0.75s ease',
          margin: '1.5em 0 0 0',
          opacity: 1,
          padding: 0,
          position: 'relative',
          border: 0,
          '&:first-child': {
            margin: 0,
          },
          ...Object.assign({}, { ...liNthList }),
        },
      },

      '& a': {
        transition: 'color 0.2s ease',
        border: 0,
        color: 'rgba(255, 255, 255, 0.35)',
        display: 'block',
        fontSize: '0.6em',
        fontWeight: 'bold',
        letterSpacing: '0.25em',
        lineHeight: 1.75,
        outline: 0,
        padding: '1.35em 0',
        position: 'relative',
        textDecoration: 'none',
        textTransform: 'uppercase',
        margin: 0,
        '&:before, &:after': {
          borderRadius: '0.2em',
          bottom: 0,
          content: "''",
          height: '0.2em',
          position: 'absolute',
          right: 0,
          width: '100%',
        },
        '&:before': {
          background: '#3c2c62',
        },
        '&:after': {
          backgroundImage: 'linear-gradient(to right, #5e42a6, #b74e91)',
          transition: 'max-width 0.2s ease',
          maxWidth: 0,
        },
        '&:hover': {
          color: 'rgba(255, 255, 255, 0.55)',
        },
      },
    }),
    inner: css({
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      transform: 'translateY(0)',
      transition: 'opacity 1s ease',
      minHeight: '100%',
      opacity: 1,
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      border: 0,
      cursor: 'default',
      textAlign: 'right',
    }),
    root: css({
      padding: '2.5em 2.5em 0.5em 2.5em',
      background: '#312450',
      cursor: 'default',
      height: '100vh',
      left: 0,
      overflowX: 'hidden',
      overflowY: 'auto',
      position: 'fixed',
      textAlign: 'right',
      top: 0,
      width: '18em',
      zIndex: '10000',
      display: 'block',
      margin: 0,
      border: 0,
      color: 'rgba(255, 255, 255, 0.55)',
      fontFamily: 'Arial, Helvetica, sans-serif',
    }),
  };
};

export default SideNavStyles;
