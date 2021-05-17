import { FunctionComponent, HTMLAttributes, Component } from 'react';
import { IComponentStyles, ICSSProperties } from '@react-macos-ui/types';

export interface ICheckboxProps extends HTMLAttributes<HTMLInputElement> {
  label: string;
  isWindowFocused?: boolean;
}
export interface ICheckboxStates {
  checked: boolean;
  transition: boolean;
}
export interface ICheckboxStyleProps {
  state?: string;
  transition?: ICSSProperties['transition'];
}
export type CheckboxStyleFunction = (
  props: ICheckboxStyleProps
) => IComponentStyles;
export class CheckboxComponent extends Component<
  ICheckboxProps,
  ICheckboxStates
> {}

export interface ICheckmarkProps extends HTMLAttributes<HTMLDivElement> {
  show: boolean;
  color: string;
  shadowColor: string;
}
export type CheckmarkComponent = FunctionComponent<ICheckmarkProps>;
export interface ICheckmarkStyleProps {
  show: ICheckmarkProps['show'];
}
export type CheckmarkStyleFunction = (
  props: ICheckmarkStyleProps
) => IComponentStyles;
