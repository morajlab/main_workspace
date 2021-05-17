import type { HTMLAttributes, FunctionComponent } from 'react';
import type { IComponentStyles } from '@react-macos-ui/types';

export interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
  title: string;
  type?: 'flat' | 'gradient' | 'link';
}
export interface IButtonStyleProps {
  type: IButtonProps['type'];
}
export type ButtonStyleFunction = (
  props: IButtonStyleProps
) => IComponentStyles;
export type ButtonComponent = FunctionComponent<IButtonProps>;
