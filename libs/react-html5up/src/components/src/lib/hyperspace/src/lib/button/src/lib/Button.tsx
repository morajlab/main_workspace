import React, { FunctionComponent, HTMLAttributes } from 'react';
import { ButtonStyles } from './Button.style';

export interface IButtonProps extends HTMLAttributes<HTMLInputElement> {
  title: string;
}

export const Button: FunctionComponent<IButtonProps> = ({ title, ...rest }) => {
  return <input type="button" value={title} {...rest} {...ButtonStyles} />;
};

export default Button;
