import React from 'react';
import { Button } from './Button';

export default {
  component: Button,
  title: 'Button',
};

export const primary = () => {
  return <Button title="Default Button" />;
};
