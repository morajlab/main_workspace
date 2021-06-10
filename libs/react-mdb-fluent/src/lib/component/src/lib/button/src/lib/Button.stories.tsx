import React from 'react';
import { Story } from '@storybook/react';
import { Button } from './Button';
import { Styles } from '@morajlab/react-mdb-fluent-styles';
import type { IButtonProps } from './Button.types';

Styles().Prism();

export default {
  title: 'Components/Button',
  component: { Button },
};

const DefaultTemplate: Story<IButtonProps> = (args) => <Button {...args} />;

export const Default = DefaultTemplate.bind({});
