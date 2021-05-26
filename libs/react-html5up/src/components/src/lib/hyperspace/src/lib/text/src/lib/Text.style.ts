import { css } from 'glamor';

export interface ITextStyleProps {
  element: 'p' | 'sub' | 'sup' | 'b' | 'i';
}

export const TextStyles = ({ element }: ITextStyleProps) => {
  let styles = {};

  if (element === 'b') {
    styles = {
      color: '#ffffff',
      fontWeight: 'bold',
    };
  }

  if (element === 'i') {
    styles = { fontStyle: 'italic' };
  }

  if (element === 'p') {
    styles = { margin: '0 0 2em 0' };
  }

  if (element === 'sub' || element === 'sup') {
    styles = {
      fontSize: '0.8em',
      position: 'relative',
      top: `${element === 'sup' ? '-' : ''}0.5em`,
    };
  }

  if (element !== 'b') {
    Object.assign(styles, { color: 'rgba(255,255,255,0.55)' });
  }

  return css(styles);
};

export default TextStyles;
