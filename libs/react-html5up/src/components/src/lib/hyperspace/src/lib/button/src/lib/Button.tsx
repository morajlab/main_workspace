import React, { FunctionComponent, HTMLAttributes } from 'react';
import { ButtonStyles } from './Button.style';

export interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
  title: string;
  size?: 'small' | 'default' | 'large';
  primary?: boolean;
  disable?: boolean;
}

export const Button: FunctionComponent<IButtonProps> = ({
  primary,
  size,
  disable,
  title,
  ...rest
}) => {
  return (
    <button
      type="button"
      {...rest}
      {...ButtonStyles({
        disable: disable ?? false,
        size: size ?? 'default',
        primary: primary ?? false,
      })}
    >
      {title}
    </button>
  );
};

export default Button;
