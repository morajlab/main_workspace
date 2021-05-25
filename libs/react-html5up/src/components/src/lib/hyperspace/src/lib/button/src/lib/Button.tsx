import React, { FunctionComponent, HTMLAttributes } from 'react';
import { ButtonStyles } from './Button.style';

export interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
  title: string;
  type?: 'primary' | 'default';
  size?: 'small' | 'default' | 'large';
  disable?: boolean;
}

export const Button: FunctionComponent<IButtonProps> = ({
  type,
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
        type: type ?? 'default',
      })}
    >
      {title}
    </button>
  );
};

export default Button;
