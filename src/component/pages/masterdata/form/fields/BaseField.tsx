import React from 'react'
import BaseComponent from './../../../../BaseComponent';
import EntityElement from '../../../../../models/settings/EntityElement';

export default abstract class BaseField extends BaseComponent<any, any> {
    
    componentDidMount() {
        this.prepopulateForm();
    }
    abstract prepopulateForm: () => void;
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
}