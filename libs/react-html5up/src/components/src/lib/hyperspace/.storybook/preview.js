import { addParameters } from '@storybook/react';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import theme from './theme';

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});

export const parameters = {
  controls: { expanded: true },
  docs: {
    theme,
  },
  options: {
    storySort: {
      order: ['Docs', 'Components'],
    },
  },
};
