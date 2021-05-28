import React, { FunctionComponent, HTMLAttributes } from 'react';
import { Button } from '@react-html5up-components/hyperspace/button';
import { IntroStyles } from './Intro.style';

export interface IIntroProps extends HTMLAttributes<HTMLDivElement> {
  backgroundImage: string;
  title: string;
  description: string;
  btnTitle: string;
  btnLink: string;
}

export const Intro: FunctionComponent<IIntroProps> = ({
  backgroundImage,
  title,
  description,
  btnLink,
  btnTitle,
  ...rest
}) => {
  const { root, inner, actions } = IntroStyles({ backgroundImage });

  return (
    <section {...rest} {...root}>
      <div {...inner}>
        <h1>{title}</h1>
        <p>{description}</p>
        <ul {...actions}>
          <li>
            <Button title={btnTitle} as="link" to="https://google.com" />
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Intro;
