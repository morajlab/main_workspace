import { css } from 'glamor';

export interface ICodeStyleProps {}

export const CodeStyles = ({}: ICodeStyleProps) => {
  return css({
    WebkitOverflowScrolling: 'touch',
    fontFamily: "'Courier New', monospace",
    fontSize: '0.9em',
    margin: '0 0 2em 0',
    color: 'rgba(255,255,255,0.55)',
    '& code': {
      display: 'block',
      lineHeight: '1.75em',
      padding: '1em 1.5em',
      overflowX: 'auto',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '0.25em',
      border: '1px solid rgba(255,255,255,0.15)',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.9em',
      margin: '0 0.25em',
    },
  });
};

export default CodeStyles;
