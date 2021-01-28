import React, { Component, Fragment }  from 'react';
import EntityElement from './../../../../models/EntityElement';


export default class FormInputCheckbox extends Component<{ element: EntityElement, recordToEdit: any, requiredAttr: any }, any> {
    state = {
        checked: false
    }
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.prepopulateForm();
    }
    prepopulateForm = () => {
         
        if (!this.props.recordToEdit) {
            return;
        }
        const fieldName = this.props.element.id;
        let recordValue = this.props.recordToEdit[fieldName];
        
        if (!recordValue) return;
        
        this.setState({ checked: recordValue == true })
    }
    render() {
        const element: EntityElement = this.props.element;
        const checked: boolean = this.state.checked;
        return (
            <Fragment>
                <input type="hidden" name={element.id} value={checked ? 'true' : 'false'} />
                <div className="btn-group">
                    <a className={checked?"btn btn-dark":"btn btn-light"} onClick={(e) => this.setState({ checked: true })} >Yes</a>
                    <a className={!checked?"btn btn-dark":"btn btn-light"} onClick={(e) => this.setState({ checked: false })} >No</a>
                </div>
            </Fragment>
        )
    }

}
