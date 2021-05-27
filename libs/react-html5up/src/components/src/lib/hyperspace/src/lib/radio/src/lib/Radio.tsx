import React, { FunctionComponent, HTMLAttributes, useState } from 'react';
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
  const [checkedState, setCheckState] = useState(false);

  return (
    <div className={`radio-button-container-${id}`}>
      <input
        type="radio"
        id={id}
        checked={checkedState}
        onChange={onChange ?? (() => {})}
        {...rest}
        {...RadioStyles({})}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Radio;
