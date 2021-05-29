import React from 'react';
import { Story } from '@storybook/react';
import { Button, IButtonProps } from './Button';

export default {
  component: Button,
  title: 'Components/Button',
  argTypes: {
    size: {
      options: ['small', 'large', 'default'],
      control: {
        type: 'select',
      },
    },
  },
};

const Template: Story<IButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});
export const Primary = Template.bind({});
export const Large = Template.bind({});
export const Small = Template.bind({});

Default.args = {
  title: 'Default Button',
  size: 'default',
};

Primary.args = {
  title: 'Primary Button',
  size: 'default',
  primary: true,
};

Large.args = {
  title: 'Large Button',
  size: 'large',
};

Small.args = {
  title: 'Small Button',
  size: 'small',
};
