import React, { FunctionComponent, HTMLAttributes } from 'react';
import { LinkStyles } from './Link.style';

export interface ILinkProps extends HTMLAttributes<HTMLAnchorElement> {
  text: string;
  to: string;
}

export const Link: FunctionComponent<ILinkProps> = ({ text, to, ...rest }) => {
  return (
    <a href={to} {...LinkStyles({})} {...rest}>
      {text}
    </a>
  );
};

export default Link;
