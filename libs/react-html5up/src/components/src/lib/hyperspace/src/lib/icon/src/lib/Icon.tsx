import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export * from '@fortawesome/free-solid-svg-icons';

export interface IIconProps {
  icon: IconDefinition;
}

export const Icon: FunctionComponent<IIconProps> = (props) => {
  return <FontAwesomeIcon {...props} />;
};

export default Icon;
