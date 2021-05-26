import React, { FunctionComponent, createElement } from 'react';
import { CodeStyles } from './Code.style';

export interface ICodeProps {
  content: string;
  inline?: boolean;
}

export const Code: FunctionComponent<ICodeProps> = ({
  content,
  inline,
  ...rest
}) => {
  let _content: any = content;
  let element: 'pre' | 'code' = 'code';

  if (!inline) {
    element = 'pre';
    _content = <code>{content}</code>;
  }

  return createElement(
    element,
    { ...rest, ...CodeStyles({ inline }) },
    _content
  );
};

export default Code;
