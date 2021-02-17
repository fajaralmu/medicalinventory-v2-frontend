import React, { ChangeEvent, Component, Fragment } from 'react'
import FormGroup from '../../../form/FormGroup';
import Filter from './../../../../models/Filter';
import { MONTHS } from './../../../../utils/DateUtil';
interface Props {
    filter: Filter;
    onChange(e: ChangeEvent): any;
    fullPeriod: boolean;
}
export default class PeriodFilter extends Component<Props, any> {


    render = () => {
        const filter: Filter = this.props.filter;
        return (
            <Fragment>
                <FormGroup label="Month">
                    <select onChange={this.props.onChange} value={filter.month} name="month" className="form-control">
                        {MONTHS
                            .map((name, i) => {
                                return (
                                    <option key={"filter-month-from-" + i} value={i + 1}>{name}</option>
                                )
                            })}
                    </select>
                </FormGroup>
                <FormGroup label="Year">
                    <input onChange={this.props.onChange} name="year" type="number" value={filter.year} className="form-control" />
                </FormGroup>
                {this.props.fullPeriod ?
                    <Fragment>
                        <FormGroup label="Month To">
                            <select onChange={this.props.onChange} value={filter.monthTo} name="monthTo" className="form-control">
                                {MONTHS
                                    .map((name, i) => {
                                        return (
                                            <option key={"filter-month-from-" + i} value={i + 1}>{name}</option>
                                        )
                                    })}
                            </select>
                        </FormGroup>
                        <FormGroup label="Year To">
                            <input onChange={this.props.onChange} name="yearTo" type="number" value={filter.yearTo} className="form-control" />
                        </FormGroup>
                    </Fragment> : null
                }
            </Fragment>
        )
    }
}