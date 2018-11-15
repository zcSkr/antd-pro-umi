import * as React from 'react';
export interface ICountDownProps {
  format?: (time: number) => void;
  target: Date | number;
  onEnd?: () => void;
  style?: React.CSSProperties;
}

export default class CountDown extends React.PureComponent<ICountDownProps, any> {}
