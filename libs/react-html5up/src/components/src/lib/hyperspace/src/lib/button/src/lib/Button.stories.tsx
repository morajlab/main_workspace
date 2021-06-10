import React from 'react';
import { Story } from '@storybook/react';
import { StoryGroups } from '@react-html5up-components/hyperspace/.storybook/app';
import { Button } from './Button';
import { faGift } from '@react-html5up-components/hyperspace/icon';
import * as docs from './Button.stories.mdx';
import type { IButtonProps } from './Button.types';
import 'reset-css/reset.css';

export default {
  component: Button,
  title: StoryGroups().UIComponents('Button'),
  parameters: {
    docs: {
      page: docs,
    },
  },
  argTypes: {
    title: {
      type: { name: 'string', required: true },
      description: 'Button title',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

const DefaultTemplate: Story<IButtonProps> = ({ title }) => (
  <Button title={title} />
);
const PrimaryTemplate: Story<IButtonProps> = ({ title, primary }) => (
  <Button title={title} primary={primary} />
);
const SizeTemplate: Story<IButtonProps> = ({ title, size }) => (
  <Button title={title} size={size} />
);
const DisableTemplate: Story<IButtonProps> = ({ title, disable }) => (
  <Button title={title} disable={disable} />
);
const IconTemplate: Story<IButtonProps> = ({ title, icon }) => (
  <Button title={title} icon={icon} />
);
const LinkTemplate: Story<IButtonProps> = ({ title, as, to }) => (
  <Button title={title} as={as} to={to} />
);

export const Default = DefaultTemplate.bind({});
export const Primary = PrimaryTemplate.bind({});
export const Size = SizeTemplate.bind({});
export const Disable = DisableTemplate.bind({});
export const Icon = IconTemplate.bind({});
export const Link = LinkTemplate.bind({});

Default.args = {
  title: 'Default Button',
};

Primary.args = {
  title: 'Primary Button',
  primary: true,
};
Primary.argTypes = {
  primary: {
    type: { name: 'boolean', required: false },
    defaultValue: false,
    description: 'Button primary type status',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
    },
  },
};

Size.args = {
  title: 'Different Button Size',
  size: 'default',
};
Size.argTypes = {
  size: {
    description: 'Button size',
    options: ['small', 'large', 'default'],
    control: {
      type: 'select',
    },
    defaultValue: 'default',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'default' },
    },
  },
};

Disable.args = {
  title: 'Disabled Button',
  disable: true,
};
Disable.argTypes = {
  disable: {
    type: { name: 'boolean', required: false },
    defaultValue: false,
    description: 'Button disablement status',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },
};

Icon.args = {
  title: 'Icon Button',
  icon: faGift,
};
Icon.argTypes = {
  icon: {
    type: { name: 'Icon', required: false },
    defaultValue: 'null',
    description: 'Button icon object',
    table: {
      type: { summary: 'Icon' },
      defaultValue: {
        summary: 'null',
      },
    },
  },
};

Link.args = {
  title: 'Link Button',
  as: 'link',
  to: 'https://github.com/morteza-jamali/react-html5up-templates',
};
Link.argTypes = {
  as: {
    options: ['link', 'button'],
    control: {
      type: 'radio',
    },
  },
};
