import React, { ChangeEvent, Component } from 'react'
import { twoDigits } from '../../utils/StringUtil';
import { getInputReadableDate, getTime } from './../../utils/DateUtil';
import InputTime from './InputTime';
interface Props {
    onChange(date:Date):any,
    value:Date,
}
let d = new Date();
class State {
    date:Date  = d;
}

export default class InputDateTime extends Component<Props, State>{
    state:State = new State();
    constructor(props){
        super(props);
        this.state.date = this.props.value;
    }
    updateTime = (h:number, m:number, s:number) => {
        const time = [twoDigits(h), twoDigits[m], twoDigits(s)].join(":");
        const date = this.state.date;
        date.setHours(h);
        date.setMinutes(m);
        date.setSeconds(s);
        date.setMilliseconds(0);
        this.setState({
            date: date
        }, ()=>{
            this.props.onChange(this.state.date);
        });
    }
    updateDate = (e:ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        const inputDate = new Date(target.value);

        const date = this.state.date;
        date.setDate(inputDate.getDate());
        date.setMonth(inputDate.getMonth());
        date.setFullYear(inputDate.getFullYear());
        this.setState({
            date: date
        }, ()=>{
            this.props.onChange(this.state.date);
        });
    }
    render() {
        const date = this.state.date;
        return (
            <React.Fragment>
                <div className="input-group">
                <span className="form-control input-sm bg-light">Date</span>
                <input onChange={this.updateDate} className="form-control" value={getInputReadableDate(date)} type="date"/>
                <span className="form-control input-sm bg-light">Time</span>
                <InputTime value={getTime(date)} onChange={this.updateTime} />
                </div>
            </React.Fragment>
        )
    }
}