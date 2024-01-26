import React, { Fragment } from 'react';
import EntityElement from '../../../../../models/settings/EntityElement';
import InputDateTime from './../../../../form/InputDateTime';
import FieldProp from './../FieldProp';
import BaseField from './BaseField';

export default class FormInputDateTime extends BaseField<FieldProp, { checked: boolean, value: Date }> {
  private readonly ref = React.createRef<InputDateTime>();
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      value: new Date()
    };
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
  onChange = (value: Date) => {
    this.setState({ value });
  }
  render() {
    const { value } = this.state;
    const element = this.getEntityElement();
    console.debug('Date time value: ', value);
    return (
      <Fragment>
        <input
          type="hidden"
          name={element.id}
          value={value.getTime()}
        />
        <InputDateTime
          ref={this.ref}
          onChange={this.onChange}
          value={value}
        />
      </Fragment>
    )
  }

}
