import React from 'react';
import { buttonStyles } from './button.style';
import type { ButtonComponent } from './button.d';
import { useFela } from 'react-fela';
import { createRenderer } from 'fela';
import { RendererProvider } from 'react-fela';

const renderer = createRenderer();

const _Button: ButtonComponent = ({ title, type }) => {
  type = type ?? 'gradient';
  const { css } = useFela();

  return <button className={css(buttonStyles({ type }))}>{title}</button>;
};

export const Button: typeof _Button = (props) => {
  return (
    <RendererProvider renderer={renderer}>
      <_Button {...props} />
    </RendererProvider>
  );
};
