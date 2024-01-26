import React, { Component, ChangeEvent } from 'react';
import { twoDigits } from './../../utils/StringUtil';
interface Props {
  onChange(h: number, m: number, s: number): any,
  value: string,
}
interface State {
  hour: number;
  minute: number;
  second: number;
}
const hours: number[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
];
const minutesOrSeconds = (): number[] => {
  const arr: number[] = [];
  for (let i = 1; i < 60; i++) {
    arr.push(i);
  }
  return arr;
}
export default class InputTime extends Component<Props, State> {
  minutes: number[];
  seconds: number[];
  constructor(props) {
    super(props);
    const date = new Date();
    this.state = {
      hour : date.getHours(),
      minute : date.getMinutes(),
      second : date.getSeconds(),
    };
    this.minutes = minutesOrSeconds();
    this.seconds = minutesOrSeconds();
  }
  setDefaultValue = () => {
    try {
      const val = this.props.value.split(":");
      this.setState({ hour: parseInt(val[0]), minute: parseInt(val[1]), second: parseInt(val[2]) });
    } catch (error) {

    }
  }
  updateValue = (e: ChangeEvent) => {
    const target = e.target as HTMLSelectElement;
    if (target) {
      const name = target.name;
      this.setState({ [name]: target.value } as any, this.onChange);
    }
  }
  setNow = () => {
    const date = new Date();
    this.setState({
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    }, this.onChange)
  }
  onChange = () => {
    const { hour, minute, second } = this.state;
    this.props.onChange(hour, minute, second);
  }
  render() {
    const { hour, minute, second } = this.state;
    return (<div className="form-control bg-light">
      <select name="hour" style={{ border: 'none' }} value={hour} onChange={this.updateValue} >
        {hours.map((h) => {
          return <option key={"HOUR-" + h} value={h}>{twoDigits(h)}</option>
        })}
      </select>
      <select name="minute" style={{ border: 'none' }} value={minute} onChange={this.updateValue}>
        {this.minutes.map((min) => {
          return <option key={"MIN-" + min} value={min}>{twoDigits(min)}</option>
        })}
      </select>
      <select name="second" style={{ border: 'none' }} value={second} onChange={this.updateValue}>
        {this.seconds.map((sec) => {
          return <option key={"SEC-" + sec} value={sec}>{twoDigits(sec)}</option>
        })}
      </select>
      <a style={{ marginLeft: 5 }} onClick={this.setNow} ><i className="fas fa-history" /></a>
    </div>)
  }
}