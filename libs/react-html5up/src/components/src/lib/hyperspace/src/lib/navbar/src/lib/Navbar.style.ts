import { css } from 'glamor';

export interface INavbarStyleProps {}

export const NavbarStyles = ({}: INavbarStyleProps) => {
  return css({
    display: 'flex',
    backgroundColor: '#5e42a6',
    cursor: 'default',
    padding: '1.75em 2em',
    margin: 0,
    border: 0,
    fontFamily: 'Arial, Helvetica, sans-serif',
    '& a': {
      transition: 'color 0.2s ease, border-bottom-color 0.2s ease',
      textDecoration: 'none',
    },
    '& > [data-title]': {
      border: 0,
      color: '#ffffff',
      display: 'block',
      fontSize: '1.25em',
      fontWeight: 'bold',
    },
    '& > nav': {
      flex: 1,
      textAlign: 'right',
      display: 'block',
      margin: 0,
      padding: 0,
      border: 0,
      '& > ul': {
        margin: 0,
        padding: 0,
        '& > li': {
          display: 'inline-block',
          marginLeft: '1.75em',
          padding: 0,
          verticalAlign: 'middle',
          '&:first-child': {
            marginLeft: 0,
          },
          '& a': {
            border: 0,
            color: 'rgba(255,255,255,0.35)',
            display: 'inline-block',
            fontSize: '0.6em',
            fontWeight: 'bold',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            '&:hover': {
              color: 'rgba(255,255,255,0.55)',
            },
            '&[data-active="true"]': {
              color: '#ffffff',
            },
          },
        },
      },
    },
  });
};

export default NavbarStyles;
