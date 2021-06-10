import { css } from 'glamor';
import type { IButtonStyleProps } from './Button.types';

export const Styles = ({}: IButtonStyleProps) => {
  return css({
    color: 'red',
  });
};

export default Styles;
