import type { HTMLAttributes, FunctionComponent } from 'react';
import type { IComponentStyles } from '../shared';

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
