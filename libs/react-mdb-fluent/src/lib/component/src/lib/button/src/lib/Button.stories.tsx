import React from 'react';
import { Story } from '@storybook/react';
import { Button } from './Button';
import type { IButtonProps } from './Button.types';

export default {
  title: 'Components/Button',
  component: { Button },
};

const DefaultTemplate: Story<IButtonProps> = (args) => <Button {...args} />;

export const Default = DefaultTemplate.bind({});
