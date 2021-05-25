import React, { FunctionComponent, HTMLAttributes } from 'react';
import { ButtonStyles } from './Button.style';
import { Icon } from '@react-html5up-components/hyperspace/icon';
import type { IconDefinition } from '@react-html5up-components/hyperspace/icon';

export interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
  title: string;
  size?: 'small' | 'default' | 'large';
  primary?: boolean;
  disable?: boolean;
  icon?: IconDefinition;
}

export const Button: FunctionComponent<IButtonProps> = ({
  primary,
  size,
  disable,
  title,
  icon,
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
        icon: icon ?? false,
      })}
    >
      {icon ? <Icon icon={icon} /> : null}
      {title}
    </button>
  );
};

export default Button;
