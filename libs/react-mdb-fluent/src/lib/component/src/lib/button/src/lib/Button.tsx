import React, { FunctionComponent } from 'react';
import { Styles } from './Button.styles';
import type { IButtonProps } from './Button.types';

export const Button: FunctionComponent<IButtonProps> = ({}) => {
  return (
    <button
      type="button"
      className="btn btn-primary ripple-surface"
      {...Styles({})}
    >
      Default Button
    </button>
  );
};

export default Button;
