

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import { FieldType } from '../../../../models/FieldType';
import EntityElement from '../../../../models/settings/EntityElement';
import BaseComponent from './../../../BaseComponent';
import FormGroup from './../../../form/FormGroup';
import FormInputCommon from './fields/FormInputCoomon';
import FormInputDateTime from './fields/FormInputDateTime';
import FormInputDropDown from './fields/FormInputDropDown';
import FormInputDropDownDynamic from './fields/FormInputDropDownDynamic';
import FormInputTextEditor from './fields/FormInputTextEditor';
import FieldProp from './FieldProp';

class FormInputField extends BaseComponent<FieldProp, any> {
  getEntityElement = () => {
    return this.props.entityElement;
  }
  render() {
    const element = this.getEntityElement();
    let input = <p>{element.fieldType}</p>;
    if (element.editable) {
      switch (element.fieldType) {
        case FieldType.FIELD_TYPE_DYNAMIC_LIST:
          input = <FormInputDropDownDynamic recordToEdit={this.props.recordToEdit} entityElement={element} />
          break;
        case FieldType.FIELD_TYPE_FIXED_LIST:
          input = <FormInputDropDown recordToEdit={this.props.recordToEdit} entityElement={element} />
          break;
        case FieldType.FIELD_TYPE_TEXTEDITOR:
          input = <FormInputTextEditor recordToEdit={this.props.recordToEdit} entityElement={element} />
          break;
        case FieldType.FIELD_TYPE_DATETIME:
          input = <FormInputDateTime recordToEdit={this.props.recordToEdit} entityElement={element} />
          break;
        case FieldType.FIELD_TYPE_PLAIN_LIST:
        case FieldType.FIELD_TYPE_TEXTAREA:
        default:
          input = <FormInputCommon recordToEdit={this.props.recordToEdit} entityElement={element} />
      }
    } else {
      input = <FormInputCommon recordToEdit={this.props.recordToEdit} entityElement={element} />
    }
    const formLabel = (
      <span>
        {element.labelName}
        {element.editable && element.required ? <i className="text-danger">*</i> : null}
      </span>
    );
    return (
      <FormGroup orientation='vertical' label={formLabel}>
        {input}
      </FormGroup>
    );
  }
}

export default withRouter(connect(
  mapCommonUserStateToProps,
)(FormInputField))