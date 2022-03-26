
import React, { Component } from 'react';
const FormGroup = (props: {
    label?: any,
    show?: boolean,
    orientation?: 'vertical' | 'horizontal',
    style?: any,
    className?: string,
    children: any,
}) => {
    if (props.show === false) {
        return null;
    }
    const orientation = props.orientation == 'vertical' ? 'vertical' : 'horizontal';
    return (
        <div style={props.style} className={"form-group " + props.className + " " + (orientation == 'vertical' ? '' : 'row')}>
            <label className={(orientation == 'vertical' ? '' : 'col-sm-3')}>
                <strong>{props.label ?? null}
                </strong>
            </label>
            <div className={(orientation == 'vertical' ? '' : 'col-sm-9')}>
                {props.children}
            </div>
        </div>
    )
}

export default FormGroup;