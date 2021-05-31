import { IResetStyleProps } from './reset.types';
import { readFileSync } from 'fs';

export const resetStyle = (props: IResetStyleProps) => {
  const styles = props;

  const content = readFileSync('reset.module.scss', {
    encoding: 'utf8',
  });

  console.log(content);

  return styles;
};

export default resetStyle;
