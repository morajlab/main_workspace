import type { CSSProperties } from 'react';

export interface ICSSProperties extends CSSProperties, Object {}

export interface IComponentStyles extends CSSProperties {
  [key: string]: ICSSProperties;
}
