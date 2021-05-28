import React, { FunctionComponent, HTMLAttributes, ReactElement } from 'react';
import { FooterStyles } from './Footer.style';

export interface IFooterProps extends HTMLAttributes<HTMLDivElement> {
  list: (string | ReactElement)[];
}

export const Footer: FunctionComponent<IFooterProps> = ({ list, ...rest }) => {
  const { inner, menu, root } = FooterStyles({});

  return (
    <footer {...rest} {...root}>
      <div {...inner}>
        <ul {...menu}>
          {list.map((item, key) => (
            <li key={key}>{item}</li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
