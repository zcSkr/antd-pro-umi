import * as React from 'react';

export interface ITrendProps {
  colorful?: boolean;
  flag: 'up' | 'down';
  style?: React.CSSProperties;
  reverseColor?: boolean;
}

export default class Trend extends React.PureComponent<ITrendProps, any> {}
