import React, { FunctionComponent } from 'react';
import { Styles } from './Button.styles';
import type { IButtonProps } from './Button.types';

export const Button: FunctionComponent<IButtonProps> = ({}) => {
  return <button {...Styles({})}>Default Button</button>;
};

export default Button;
