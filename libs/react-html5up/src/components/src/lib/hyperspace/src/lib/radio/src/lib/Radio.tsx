import React, { FunctionComponent, HTMLAttributes, Fragment } from 'react';
import { RadioStyles } from './Radio.style';

export interface IRadioProps extends HTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  checked?: boolean;
  name?: string;
  onChange?: () => void;
}

export const Radio: FunctionComponent<IRadioProps> = ({
  label,
  id,
  checked,
  name,
  onChange,
  ...rest
}) => {
  return (
    <Fragment>
      <input
        type="radio"
        id={id}
        checked={checked ?? false}
        onChange={onChange ?? (() => {})}
        {...rest}
        {...RadioStyles({})}
      />
      <label htmlFor={id}>{label}</label>
    </Fragment>
  );
};

export default Radio;
