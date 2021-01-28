

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import EntityElement from '../../../../models/EntityElement'; 
import { FieldType } from '../../../../models/FieldType'; 
import FormInputImage from './FormInputImage';
import FormInputImageMultiple from './FormInputImageMultiple';
import BaseComponent from './../../../BaseComponent';
import FormGroup from './../../../form/FormGroup';
import FormInputDropDown from './FormInputDropDown';
import FormInputTextEditor from './FormInputTextEditor';
interface IState { 
    singlePreviewData?: string,
    inputElements: number[]
}
class FormInputField extends BaseComponent { 
    state: IState = { 
        singlePreviewData: undefined,
        inputElements: [1]
    }
    ref: React.RefObject<any> = React.createRef();
    constructor(props: any) {
        super(props, false);
    }
    getEntityElement = (): EntityElement => {
        return this.props.entityElement;
    }
    getRequiredAttr = () => {
        const requiredAttr = { required: this.getEntityElement().required == true }
        return (
            // null
            requiredAttr
        )
    }

    componentDidMount() { 
        this.prepopulateForm();
    }

    prepopulateForm = () => {
        if (!this.props.recordToEdit || !this.ref.current) {
            return;

        }
        const fieldName = this.getEntityElement().id;
        let recordValue = this.props.recordToEdit[fieldName];
        if (!recordValue) return;

        const fieldType: FieldType = this.getEntityElement().fieldType;
        let defaultInputValue = undefined;
        switch (fieldType) {
            default:
                defaultInputValue = recordValue;
                break;
        }
        if (defaultInputValue) {
            this.ref.current.value = defaultInputValue;
        }
    }

    render() {
        const element = this.getEntityElement();
        const requiredAttr = this.getRequiredAttr();
        
        if (element.idField == true) {
            return (
                <FormGroup orientation="vertical" label={element.lableName}>
                    <input {...requiredAttr} value="Generated" ref={this.ref} className="form-control" name={element.id} disabled />
                </FormGroup>
            )
        }
        let input = <p>{element.fieldType}</p>;
        switch (element.fieldType) {
            case FieldType.FIELD_TYPE_DYNAMIC_LIST:
            case FieldType.FIELD_TYPE_FIXED_LIST:
                input = <FormInputDropDown recordToEdit={this.props.recordToEdit}   entityElement={element} />
                break;
            case FieldType.FIELD_TYPE_TEXTEDITOR:
                input = <FormInputTextEditor recordToEdit={this.props.recordToEdit}   entityElement={element} />
                break;
                case FieldType.FIELD_TYPE_PLAIN_LIST:
                    input = (
                        <select  {...requiredAttr} ref={this.ref} className="form-control" name={element.id} >
                            {element.plainListValues.map((value,i)=>{
                                return (
                                    <option value={value}>{value}</option>
                                )
                            })}
                        </select>
                    )   
                    break;
            case FieldType.FIELD_TYPE_IMAGE:
                input = element.multiple ?
                    <FormInputImageMultiple  recordToEdit={this.props.recordToEdit} element={element} />
                    :
                    <FormInputImage  recordToEdit={this.props.recordToEdit} element={element} />
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
export default withRouter(connect(
    mapCommonUserStateToProps,
)(FormInputField))