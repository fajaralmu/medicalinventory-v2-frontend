import React, { ChangeEvent, Component } from 'react'
import { twoDigits } from '../../utils/StringUtil';
import { getInputReadableDate, getTime } from './../../utils/DateUtil';
import InputTime from './InputTime';
interface Props {
    onChange(date: Date): any,
    value: Date,
}
let d = new Date();

export default class InputDateTime extends Component<Props, any>{
    timeRef:React.RefObject<InputTime> = React.createRef();
    constructor(props) {
        super(props);

    }
    updateTime = (h: number, m: number, s: number) => {
        const time = [twoDigits(h), twoDigits[m], twoDigits(s)].join(":");
        const date = this.props.value;
        date.setHours(h);
        date.setMinutes(m);
        date.setSeconds(s);
        date.setMilliseconds(0);
        this.setState({
            date: date
        }, () => {
            this.props.onChange(this.props.value);
        });
    }
    updateDate = (e: ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        const inputDate = new Date(target.value);

        const date = this.props.value;
        date.setDate(inputDate.getDate());
        date.setMonth(inputDate.getMonth());
        date.setFullYear(inputDate.getFullYear());
        this.setState({
            date: date
        }, () => {
            this.props.onChange(this.props.value);
        });
    }
    componentDidUpdate(){
        if (this.timeRef.current) {
            this.timeRef.current.setDefaultValue();
        }
    }
    render() {
        const date = this.props.value;
        return (
            <div className="row">
                <div className="col-md-1 text-center d-flex align-items-center"><i className="far fa-calendar-alt"/></div>
                <div className="col-md-5">
                    <input onChange={this.updateDate} className="form-control" value={getInputReadableDate(date)} type="date" />
                </div>
                <div className="col-md-1 text-center d-flex align-items-center"><i className="far fa-clock"/></div>
                <div className="col-md-5">
                    <InputTime ref={this.timeRef} value={getTime(date)} onChange={this.updateTime} />
                </div>
            </div>
        )
    }
}