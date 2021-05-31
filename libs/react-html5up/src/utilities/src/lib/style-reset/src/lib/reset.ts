import { IResetStyleProps } from './reset.types';
import * as resetSass from './reset.module.scss';

export const resetStyle = (props: IResetStyleProps) => {
  const styles = props;

  console.log(resetSass);

  return styles;
};

export default resetStyle;
