import React, { Component } from 'react'
import { FieldType } from '../../../../../models/FieldType';
import { getInputReadableDate } from '../../../../../utils/DateUtil';
import FormGroup from '../../../../form/FormGroup';
import BaseField from './BaseField';

export default class FormInputCommon extends BaseField {
    ref: React.RefObject<any> = React.createRef();
    constructor(props) {
        super(props);
    }
    
    prepopulateForm = () => {
        if (!this.props.recordToEdit || !this.ref.current) {
            return;

        }
        const element = this.getEntityElement();
        const fieldName = element.id;
        let recordValue = this.props.recordToEdit[fieldName];
        if (!recordValue) return;

        const fieldType: FieldType = element.fieldType;
        let defaultInputValue: any = undefined;
        switch (fieldType) {
            case FieldType.FIELD_TYPE_DATE:
                const dateObj = new Date(recordValue);
                if (!dateObj) { break }
                defaultInputValue = getInputReadableDate(dateObj);
                break;

            default:
                defaultInputValue = recordValue;
                break;
        }
        if (defaultInputValue) {

            if (element.optionItemName && element.optionItemName != "") {
                const valueAsObj = defaultInputValue;
                this.ref.current.value = valueAsObj[element.optionItemName ?? "id"];
            } else {
                this.ref.current.value = defaultInputValue;
            }
        }
    }
    render() {
        const element = this.getEntityElement();
        const requiredAttr = this.getRequiredAttr();
        if (element.idField == true || element.editable == false) {
            return (
                <FormGroup orientation="vertical" label={element.lableName}>
                    <input {...requiredAttr} value="Generated" ref={this.ref} className="form-control" name={element.id} disabled />
                </FormGroup>
            )
        }
        let input = <p>{element.fieldType}</p>;
        switch (element.fieldType) {
            case FieldType.FIELD_TYPE_PLAIN_LIST:
                input = (
                    <select  {...requiredAttr} ref={this.ref} className="form-control" name={element.id} >
                        {element.plainListValues.map((value, i) => {
                            return (
                                <option key={"s-" + element.id + '-o-' + i} value={value}>{value}</option>
                            )
                        })}
                    </select>
                )
                break;
            case FieldType.FIELD_TYPE_TEXTAREA:
                input = <textarea {...requiredAttr} ref={this.ref} className="form-control" name={element.id} />
                break;
            default:
                input = <input type={element.type} {...requiredAttr} ref={this.ref} className="form-control" name={element.id} />
 
        }
         return (
            <FormGroup orientation='vertical' label={element.lableName}>
                { input}
            </FormGroup>
        )

    }
}