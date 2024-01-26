import React, { Component } from 'react'
import { FieldType } from '../../../../../models/FieldType';
import { getInputReadableDate } from '../../../../../utils/DateUtil';
import BaseField from './BaseField';
import FieldProp from './../FieldProp';

export default class FormInputCommon extends BaseField<FieldProp, any> {
  private ref: React.RefObject<any> = React.createRef();
  prepopulateForm = () => {
    const { recordToEdit } = this.props;
    if (!recordToEdit || !this.ref.current) {
      return;
    }
    const element = this.getEntityElement();
    const fieldName = element.id;
    let recordValue = recordToEdit[fieldName];
    if (undefined === recordValue) {
      console.debug(fieldName, ' is undefined ', recordToEdit, recordToEdit[fieldName]);
      return;
    }

    const { fieldType } = element;
    let defaultInputValue: any = undefined;
    switch (fieldType) {
      case FieldType.FIELD_TYPE_DATE:
        const dateObj = new Date(recordValue);
        if (!dateObj) { break }
        defaultInputValue = getInputReadableDate(dateObj);
        break;
      case FieldType.FIELD_TYPE_NUMBER:
        defaultInputValue = new String(recordValue);
        break;
      default:
        defaultInputValue = recordValue;
        break;
    }
    const { optionItemName } = element;
    if (defaultInputValue) {
      if (optionItemName && optionItemName != '') {
        const valueAsObj = defaultInputValue;
        this.ref.current.value = valueAsObj[optionItemName ?? 'id'];
      } else {
        this.ref.current.value = defaultInputValue;
      }
    }
  }
  render() {
    const element = this.getEntityElement();
    const requiredAttr = this.getRequiredAttr();
    
    const { id, type, fieldType, editable, identity, plainListValues } = element;

    if (identity === true || editable === false) {
      return (
        <input
          {...requiredAttr}
          value="Generated"
          ref={this.ref}
          className="form-control"
          name={id}
          disabled
        />
      );
    }
    let input;
    switch (fieldType) {
      case FieldType.FIELD_TYPE_PLAIN_LIST:
        input = (
          <select {...requiredAttr} ref={this.ref} className="form-control" name={id} >
            {plainListValues.map((value, i) => {
              return (
                <option key={`s-${id}-o-${i}`} value={value}>{value}</option>
              );
            })}
          </select>
        );
        break;
      case FieldType.FIELD_TYPE_TEXTAREA:
        input = <textarea {...requiredAttr} ref={this.ref} className="form-control" name={id} />
        break;
      case FieldType.FIELD_TYPE_NUMBER:
        input = (
          <input
            {...requiredAttr}
            type={type}
            step={0.001}
            ref={this.ref}
            className="form-control"
            name={element.id}
          />
        );
        break;
      default:
        input = (
          <input
            {...requiredAttr}
            type={type}
            ref={this.ref}
            className="form-control"
            name={id}
          />
        );

    }
    return input;
  }
}
