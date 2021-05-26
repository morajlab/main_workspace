import React, { FunctionComponent, HTMLAttributes, createElement } from 'react';
import { HeadingStyles } from './Heading.style';

export interface IHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  number: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

export interface IHProps extends HTMLAttributes<HTMLHeadingElement> {
  text: string;
}

export const Heading: FunctionComponent<IHeadingProps> = ({
  number,
  text,
  ...rest
}) => {
  return createElement(
    `h${number}`,
    { ...rest, ...HeadingStyles({ number }) },
    text
  );
};

export const H1: FunctionComponent<IHProps> = (props) => (
  <Heading number={1} {...props} />
);

export const H2: FunctionComponent<IHProps> = (props) => (
  <Heading number={2} {...props} />
);

export const H3: FunctionComponent<IHProps> = (props) => (
  <Heading number={3} {...props} />
);

export const H4: FunctionComponent<IHProps> = (props) => (
  <Heading number={4} {...props} />
);

export const H5: FunctionComponent<IHProps> = (props) => (
  <Heading number={5} {...props} />
);

export const H6: FunctionComponent<IHProps> = (props) => (
  <Heading number={6} {...props} />
);

export default Heading;
