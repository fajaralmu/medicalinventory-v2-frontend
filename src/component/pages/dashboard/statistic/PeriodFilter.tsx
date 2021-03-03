import React, { ChangeEvent, Component, Fragment } from 'react'
import FormGroup from '../../../form/FormGroup';
import Filter from '../../../../models/common/Filter';
import { MONTHS, getMonthDays } from './../../../../utils/DateUtil';
const year = new Date().getFullYear();
interface Props {
    filter: Filter;
    onChange(e: ChangeEvent): any;
    fullPeriod: boolean;
    withDay?:boolean;
}
export default class PeriodFilter extends Component<Props, any> {

    getDayToArray = () => {
        const filter: Filter = this.props.filter;
        const count = getMonthDays(filter.monthTo??1, filter.yearTo??year);
        const days:number[] = [];
        for (let i = 1 ; i <= count; i++) {
            days.push(i);      
        }
        return days;
    }
    getDayFromArray = () => {
        const filter: Filter = this.props.filter;
        const count = getMonthDays(filter.month??1, filter.year??year);
        const days:number[] = [];
        for (let i = 1 ; i <= count; i++) {
            days.push(i);      
        }
        return days;
    }
    render = () => {
        const filter: Filter = this.props.filter;
        const withDay:boolean  = this.props.withDay == true;
        return (
            <Fragment>
                {withDay?
                <FormGroup label="Day">
                <select  onChange={this.props.onChange} name="day" value={filter.day??1} className="form-control" >
                    {this.getDayFromArray().map(day=>{
                        return <option key={"day-from-"+day} value={day} >{day}</option>
                    })}
                </select>
                </FormGroup>:null
                }
                <FormGroup label="Month">
                    <select onChange={this.props.onChange} value={filter.month??1} name="month" className="form-control">
                        {MONTHS
                            .map((name, i) => {
                                return (
                                    <option key={"filter-month-from-" + i} value={i + 1}>{name}</option>
                                )
                            })}
                    </select>
                </FormGroup>
                <FormGroup label="Year">
                    <input onChange={this.props.onChange} name="year" type="number" value={filter.year??year} className="form-control" />
                </FormGroup>
                {this.props.fullPeriod ?
                    <Fragment>
                         {withDay?
                        <FormGroup label="Day">
                         <select  onChange={this.props.onChange} name="dayTo" value={filter.dayTo??1} className="form-control" >
                            {this.getDayToArray().map(day=>{
                                return <option key={"day-from-"+day} value={day} >{day}</option>
                            })}
                        </select> </FormGroup>:null
                        }
                        <FormGroup label="Month To">
                            <select onChange={this.props.onChange} value={filter.monthTo??1} name="monthTo" className="form-control">
                                {MONTHS
                                    .map((name, i) => {
                                        return (
                                            <option key={"filter-month-from-" + i} value={i + 1}>{name}</option>
                                        )
                                    })}
                            </select>
                        </FormGroup>
                        <FormGroup label="Year To">
                            <input  onChange={this.props.onChange} name="yearTo" type="number" value={filter.yearTo??year} className="form-control" />
                        </FormGroup>
                    </Fragment> : null
                }
            </Fragment>
        )
    }
}