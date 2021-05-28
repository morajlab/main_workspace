import { css } from 'glamor';

export interface IIntroStyleProps {
  backgroundImage: string;
}

export const IntroStyles = ({ backgroundImage }: IIntroStyleProps) => {
  return {
    root: css({
      backgroundAttachment: 'fixed',
      backgroundImage: `url('${backgroundImage}')`,
      backgroundPosition: 'top right',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#5e42a6',
      position: 'relative',
      margin: 0,
      padding: 0,
      border: 0,
      color: 'rgba(255, 255, 255, 0.55)',
      fontFamily: 'Arial, Helvetica, sans-serif',
      '& p': {
        fontSize: '1.25em',
      },
    }),
    inner: css({
      transform: 'translateY(0)',
      transition: 'opacity 1s ease, transform 1s ease',
      opacity: '1.0',
      padding: '4em 4em 2em 4em',
      maxWidth: '100%',
      width: '75em',
      margin: 0,
      border: 0,
      '& h1': {
        fontSize: '2.75em',
        color: '#ffffff',
        fontWeight: 'bold',
        lineHeight: '1.5',
        margin: '0 0 0.5em 0',
        padding: 0,
        border: 0,
      },
      '& p': {
        fontSize: '1.25em',
        margin: '0 0 2em 0',
        padding: 0,
        border: 0,
      },
    }),
    actions: css({
      margin: 0,
      display: 'flex',
      cursor: 'default',
      listStyle: 'none',
      marginLeft: '-1em',
      paddingLeft: 0,
      padding: 0,
      border: 0,
      '& li': {
        padding: '0 0 0 1em',
        margin: 0,
        border: 0,
      },
    }),
  };
};

export default IntroStyles;
