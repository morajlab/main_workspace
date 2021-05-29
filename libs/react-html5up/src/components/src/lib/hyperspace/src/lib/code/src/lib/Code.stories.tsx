import React from 'react';
import { Story } from '@storybook/react';
import { StoryGroups } from '@react-html5up-components/hyperspace/.storybook/app';
import { Code as _Code, ICodeProps } from './Code';

export default {
  component: _Code,
  title: StoryGroups().UIComponents('Code'),
};

const Template: Story<ICodeProps> = (props) => <_Code {...props} />;

export const Code = Template.bind({});

Code.args = {
  content: `
  import React from 'react';
  import { Story } from '@storybook/react';
  import { StoryGroups } from '@react-html5up-components/hyperspace/.storybook/app';
  import { Code as _Code, ICodeProps } from './Code';

  const { UIComponents } = StoryGroups();

  export default {
    component: _Code,
    title: UIComponents('Code'),
  };

  const Template: Story<ICodeProps> = (props) => <_Code {...props} />;

  export const Code = Template.bind({});

  Code.args = {
    content: 'This is some code',
  };
  `,
};
