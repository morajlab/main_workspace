import React, { FunctionComponent, HTMLAttributes, createElement } from 'react';
import { TextStyles } from './Text.style';
import type { ITextStyleProps } from './Text.style';

export interface ITextProps extends HTMLAttributes<HTMLParagraphElement> {
  bold?: boolean;
  italic?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  text: string;
}

export const Text: FunctionComponent<ITextProps> = ({
  bold,
  italic,
  superscript,
  subscript,
  text,
  ...rest
}) => {
  let element: ITextStyleProps['element'] = 'p';

  if (bold) {
    element = 'b';
  }
  if (italic) {
    element = 'i';
  }
  if (superscript) {
    element = 'sup';
  }
  if (subscript) {
    element = 'sub';
  }

  return createElement(element, { ...rest, ...TextStyles({ element }) }, text);
};

export default Text;
