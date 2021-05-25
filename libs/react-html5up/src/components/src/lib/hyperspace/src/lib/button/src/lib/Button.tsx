import React, { FunctionComponent, HTMLAttributes } from 'react';
import { ButtonStyles } from './Button.style';

export interface IButtonProps extends HTMLAttributes<HTMLAnchorElement> {
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
    <a
      {...rest}
      {...ButtonStyles({
        disable: disable ?? false,
        size: size ?? 'default',
        primary: primary ?? false,
      })}
    >
      {title}
    </a>
  );
};

export default Button;
