
import React, { Component } from 'react';
export default class FormGroup extends Component<any, any>
{
    constructor(props) {
        super(props);
    }
    render() {
        const orientation = this.props.orientation == 'vertical' ? 'vertical' : 'horizontal';
        return (
            <div className={"form-group "+ this.props.className+ " " + (orientation == 'vertical' ? '' : 'row')}>
                <label className={(orientation == 'vertical' ? '' : 'col-sm-3')}><strong>{this.props.label ? this.props.label : null}</strong></label>
                <div className={(orientation == 'vertical' ? '' : 'col-sm-9')}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}