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

export interface IButtonStyleProps {
  size: IButtonProps['size'];
  primary: IButtonProps['primary'];
  disable: IButtonProps['disable'];
  icon: IButtonProps['icon'] | boolean;
}
