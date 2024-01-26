import React from 'react'
import BaseComponent from '../../../../BaseComponent';
import EntityElement from '../../../../../models/settings/EntityElement';

type Props = {
  entityElement: EntityElement;
}

export default abstract class BaseField<T extends Props, S> extends BaseComponent<T, S> {
  componentDidMount() {
    this.prepopulateForm();
  }
  abstract prepopulateForm: () => void;
  getEntityElement = () => {
    return this.props.entityElement;
  }
  getRequiredAttr = () => {
    const requiredAttr = { required: this.getEntityElement().required === true }
    return (
      // null
      requiredAttr
    )
  }
}