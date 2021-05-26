import React, { FunctionComponent, HTMLAttributes } from 'react';
import { QuoteStyles } from './Quote.style';

export interface IQuoteProps extends HTMLAttributes<HTMLQuoteElement> {
  text: string;
}

export const Quote: FunctionComponent<IQuoteProps> = ({ text, ...rest }) => {
  return (
    <blockquote {...rest} {...QuoteStyles({})}>
      {text}
    </blockquote>
  );
};

export default Quote;
