import React, { FunctionComponent, createElement, Fragment } from 'react';
import { ButtonStyles } from './Button.style';
import { Icon } from '@react-html5up-components/hyperspace/icon';
import type { IconDefinition } from '@react-html5up-components/hyperspace/icon';

export interface IButtonProps {
  title: string;
  size?: 'small' | 'default' | 'large';
  primary?: boolean;
  disable?: boolean;
  icon?: IconDefinition;
  as?: 'button' | 'link';
  to?: string;
}

export const Button: FunctionComponent<IButtonProps> = ({
  primary,
  size,
  disable,
  title,
  icon,
  as,
  to,
  ...rest
}) => {
  const element: 'a' | 'button' = as ? (as === 'link' ? 'a' : as) : 'button';

  return createElement(
    element,
    {
      ...rest,
      ...ButtonStyles({
        disable: disable ?? false,
        size: size ?? 'default',
        primary: primary ?? false,
        icon: icon ?? false,
      }),
      ...(element === 'a' ? { href: to } : { typeof: 'button' }),
    },
    <Fragment>
      {icon ? <Icon icon={icon} /> : null}
      {title}
    </Fragment>
  );
};

export default Button;
