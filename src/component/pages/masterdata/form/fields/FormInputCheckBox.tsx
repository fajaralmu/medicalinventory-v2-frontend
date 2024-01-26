import React, { Component, Fragment } from 'react';
import EntityElement from '../../../../../models/settings/EntityElement';
import ToggleButton from '../../../../navigation/ToggleButton';
import BaseField from './BaseField';
import FieldProp from './../FieldProp';

export default class FormInputCheckbox extends BaseField<FieldProp, { checked: boolean }> {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
  }
  prepopulateForm = () => {
    if (!this.props.recordToEdit) {
      return;
    }
    const fieldName = this.getEntityElement().id;
    let recordValue = this.props.recordToEdit[fieldName];

    if (!recordValue) return;

    this.setState({ checked: recordValue === true })
  }
  render() {
    const element = this.getEntityElement();
    const checked = this.state.checked;
    return (
      <Fragment>
        <input type="hidden" name={element.id} value={checked ? 'true' : 'false'} />
        <ToggleButton
          active={checked}
          onClick={(val: boolean) => this.setState({ checked: val })}
          yesLabel="Ya"
          noLabel="Tidak"
        />
      </Fragment>
    )
  }

}
