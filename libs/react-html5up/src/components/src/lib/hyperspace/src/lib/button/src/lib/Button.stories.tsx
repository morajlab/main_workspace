import React from 'react';
import { Story } from '@storybook/react';
import { StoryGroups } from '@react-html5up-components/hyperspace/.storybook/app';
import { Button, IButtonProps } from './Button';
import { faGift } from '@react-html5up-components/hyperspace/icon';

const { UIComponents } = StoryGroups();

export default {
  component: Button,
  title: UIComponents('Button'),
};

const Template: Story<IButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});
export const Primary = Template.bind({});
export const Size = Template.bind({});
export const Disable = Template.bind({});
export const Icon = Template.bind({});
export const Link = Template.bind({});

Default.args = {
  title: 'Default Button',
};

Primary.args = {
  title: 'Primary Button',
  primary: true,
};

Size.args = {
  title: 'Different Button Size',
  size: 'default',
};
Size.argTypes = {
  size: {
    options: ['small', 'large', 'default'],
    control: {
      type: 'select',
    },
  },
};

Disable.args = {
  title: 'Disabled Button',
  disable: true,
};

Icon.args = {
  title: 'Icon Button',
  icon: faGift,
  primary: false,
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
