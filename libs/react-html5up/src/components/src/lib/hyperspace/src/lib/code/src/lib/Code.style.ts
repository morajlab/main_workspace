import { css } from 'glamor';
import type { ICodeProps } from './Code';

export interface ICodeStyleProps {
  inline: ICodeProps['inline'];
}

export const CodeStyles = ({ inline }: ICodeStyleProps) => {
  const code = {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '0.25em',
    border: '1px solid rgba(255,255,255,0.15)',
    fontFamily: "'Courier New', monospace",
    fontSize: '0.9em',
    margin: '0 0.25em',
    padding: inline ? '0.25em 0.65em' : '1em 1.5em',
    color: 'rgba(255,255,255,0.55)',
  };

  if (inline) {
    return css(code);
  }

  return css(
    css({
      WebkitOverflowScrolling: 'touch',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.9em',
      margin: '0 0 2em 0',
      color: 'rgba(255,255,255,0.55)',
    }),
    css({
      '& code': Object.assign(code, {
        display: 'block',
        lineHeight: '1.75em',
        overflowX: 'auto',
      }),
    })
  );
};

export default CodeStyles;
