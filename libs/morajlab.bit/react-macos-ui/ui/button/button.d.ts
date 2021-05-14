import type { HTMLAttributes, CSSProperties, FunctionComponent } from 'react';

export interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
  title: string;
  type?: 'flat' | 'gradient' | 'link';
}

export interface ICSSProperties extends CSSProperties, Object {}

export interface IButtonStyles extends CSSProperties {
  [key: string]: ICSSProperties;
}
export interface IButtonStyleProps {
  type: IButtonProps['type'];
}
export type ButtonStyleFunction = (props: IButtonStyleProps) => IButtonStyles;
export type ButtonComponent = FunctionComponent<IButtonProps>;
