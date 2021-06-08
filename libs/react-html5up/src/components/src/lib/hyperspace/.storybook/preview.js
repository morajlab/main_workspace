import { addParameters } from '@storybook/react';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});

export const parameters = {
  controls: { expanded: true },
  options: {
    storySort: {
      order: ['Docs', 'Components'],
    },
  },
};
