import React, { FunctionComponent } from 'react';
import { CodeStyles } from './Code.style';

export interface ICodeProps {
  content: string;
}

export const Code: FunctionComponent<ICodeProps> = ({ content, ...rest }) => {
  return (
    <pre {...rest} {...CodeStyles({})}>
      <code>{content}</code>
    </pre>
  );
};

export default Code;
