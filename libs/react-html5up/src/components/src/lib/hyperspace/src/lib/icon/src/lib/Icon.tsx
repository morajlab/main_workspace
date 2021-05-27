import React, { FunctionComponent } from 'react';
import { renderToString } from 'react-dom/server';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

export * from '@fortawesome/free-solid-svg-icons';

export interface IIconProps extends FontAwesomeIconProps {}

export const Icon: FunctionComponent<IIconProps> = (props) => {
  return <FontAwesomeIcon {...props} />;
};

// Used from https://github.com/FortAwesome/react-fontawesome/issues/72#issuecomment-408848755
export const iconURL = (props: IIconProps): string => {
  return `data:image/svg+xml,${encodeURIComponent(
    renderToString(<Icon {...props} />)
  )}`;
};

export default Icon;
