import React, { Component, Fragment }  from 'react';
import EntityElement from '../../../../../models/settings/EntityElement';
import BaseField from './BaseField';
import InputDateTime from './../../../../form/InputDateTime';


export default class FormInputDateTime extends BaseField {
    state = {
        checked: false,
        value: new Date()
    }
    inputRef:React.RefObject<InputDateTime> = React.createRef();
    constructor(props) {
        super(props);
    }
    prepopulateForm = () => {
         
        if (!this.props.recordToEdit) {
            return;
        }
        const fieldName = this.getEntityElement().id;
        let recordValue = this.props.recordToEdit[fieldName];
        
        if (!recordValue) {
            return;
        }
        
        this.setState({ value: new Date(recordValue) });
    }
    onChange = (date:Date) => {
        this.setState({value:date});
    }
    render() {
        const element: EntityElement = this.getEntityElement(); 
        console.debug("Date time value: ", this.state.value);
        return (
            <Fragment>
                <input type="hidden" name={element.id} value={this.state.value.getTime()} />
                <InputDateTime ref={this.inputRef} onChange={this.onChange} value={this.state.value}/>
            </Fragment>
        )
    }

}
