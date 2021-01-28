
import React, { Component, Fragment } from 'react';
import HeaderProps from './../../../models/HeaderProps';
export default class DataTableHeader extends Component<{fieldsFilter:any, orderButtonOnClick(e:any):void, headerProps: HeaderProps[], filterOnChange(e:any):void}, any>
{
    constructor(props) {
        super(props);
    }
    render(){
       
        const props = this.props;
        const headerProps: HeaderProps[] = props.headerProps;
        const fieldsFilter = props.fieldsFilter;
        return (<thead>
            <tr>
                <th>No</th>
                {headerProps.map((headerProp, i) => {
                    const isDate = headerProp.isDate;
                    const headerName = headerProp.value;
                    return (
                        <th key={"dth-"+i+"-"+headerName} >
                            <p>{headerProp.label}</p>
                            <div>
                                {isDate ?
                                    <Fragment>
                                        <input key={"filter-day-"+headerName} autoComplete="off" defaultValue={fieldsFilter[headerName]} onChange={props.filterOnChange} name={headerName + "-day"}
                                            className="input-filter" placeholder={"day"} />
                                        <input key={"filter-month-"+headerName} autoComplete="off" defaultValue={fieldsFilter[headerName]} onChange={props.filterOnChange} name={headerName + "-month"}
                                            className="input-filter" placeholder={"month"} />
                                        <input key={"filter-year-"+headerName} autoComplete="off" defaultValue={fieldsFilter[headerName]} onChange={props.filterOnChange} name={headerName + "-year"}
                                            className="input-filter" placeholder={"year"} />
                                    </Fragment>
                                    :
                                    <input key={"filter-common-"+headerName}  autoComplete="off" defaultValue={fieldsFilter[headerName]} onChange={props.filterOnChange} placeholder={headerProp.label}
                                        className="input-filter" name={headerName} />
                                }</div>
                            <div className="btn-group">
                                <button data-ordertype="asc" onClick={props.orderButtonOnClick} data-orderby={headerName} className="btn btn-outline-secondary btn-sm">
                                    <i data-ordertype="asc" onClick={props.orderButtonOnClick} data-orderby={headerName} className="fas fa-angle-up" /></button>
                                <button data-ordertype="desc" onClick={props.orderButtonOnClick} data-orderby={headerName} className="btn btn-outline-secondary btn-sm">
                                    <i data-ordertype="desc" onClick={props.orderButtonOnClick} data-orderby={headerName} className="fas fa-angle-down" /></button>
                            </div>
                        </th>
                    )
                })}
                <th>Action</th>
            </tr>
        </thead>)
    }
}