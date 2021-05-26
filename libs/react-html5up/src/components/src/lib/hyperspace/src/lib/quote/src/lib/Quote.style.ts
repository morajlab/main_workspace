import { css } from 'glamor';

export interface IQuoteStyleProps {}

export const QuoteStyles = ({}: IQuoteStyleProps) => {
  return css({
    borderLeft: 'solid calc(1px * 4) rgba(255,255,255,0.15)',
    fontStyle: 'italic',
    margin: '0 0 2em 0',
    padding: 'calc(2em / 4) 0 calc(2em / 4) 2em',
    color: '#ffffff',
  });
};

export default QuoteStyles;
