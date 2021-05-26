import { css } from 'glamor';
import type { IHeadingProps } from './Heading';

export interface IHeadingStyleProps {
  number: IHeadingProps['number'];
}

export const HeadingStyles = ({ number }: IHeadingStyleProps) => {
  const fontSizeArray: string[] = ['2.75', '1.75', '1.1', '1', '0.8', '0.6'];

  return css({
    color: '#ffffff',
    fontWeight: 'bold',
    lineHeight: 1.5,
    margin: '0 0 calc(2em * 0.25) 0',
    fontSize: `${fontSizeArray[--number]}em`,
    '& a': {
      color: 'inherit',
      textDecoration: 'none',
    },
  });
};

export default HeadingStyles;
