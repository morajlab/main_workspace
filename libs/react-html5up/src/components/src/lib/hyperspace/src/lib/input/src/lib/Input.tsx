import React, { FunctionComponent, HTMLAttributes } from 'react';
import { InputStyles } from './Input.style';

export interface IInputProps extends HTMLAttributes<HTMLInputElement> {
  type?: HTMLInputElement['type'];
}

export const Input: FunctionComponent<IInputProps> = ({ type, ...rest }) => {
  return <input type={type ?? 'text'} {...rest} {...InputStyles({})} />;
};

export default Input;
