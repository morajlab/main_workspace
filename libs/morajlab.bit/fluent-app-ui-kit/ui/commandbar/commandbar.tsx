import React from 'react';

export type CommandbarProps = {
  /**
   * a text to be rendered in the component.
   */
  text: string
};

export function Commandbar({ text }: CommandbarProps) {
  return (
    <div>
      {text}
    </div>
  );
}
