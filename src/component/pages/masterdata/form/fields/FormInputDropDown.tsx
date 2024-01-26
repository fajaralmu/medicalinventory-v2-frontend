

import { resolve } from 'inversify-react';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../../../constant/stores';
import WebResponse from '../../../../../models/common/WebResponse';
import MasterDataService from '../../../../../services/MasterDataService';
import { uniqueId } from '../../../../../utils/StringUtil';
import BaseField from './BaseField';
import FieldProp from './../FieldProp';

interface IState {
  inputList: any[],
  singlePreviewData?: undefined | string,
}
class FormInputDropDown extends BaseField<FieldProp, IState> {
  @resolve(MasterDataService)
  private masterDataService: MasterDataService;

  private readonly ref = React.createRef<HTMLSelectElement>();
  constructor(props) {
    super(props);
    this.state = {
      inputList: [],
      singlePreviewData: undefined,
    };
  }

  inputListLoaded = (response: WebResponse) => {
    if (!response.entities || response.entities.length === 0) {
      throw new Error("Not found");
    }
    this.setState({ inputList: response.entities });
    this.prepopulateForm();
  }
  loadInputList = () => {
    const element = this.getEntityElement();
    // if (element.jsonList &&  element.jsonList != '') {
    //     const list = JSON.parse(element.jsonList);
    //     this.inputListLoaded({entities:list})
    //     return;
    // }

    const code = element.entityReferenceClass;
    this.commonAjax(
      this.masterDataService.loadAllEntities,
      this.inputListLoaded,
      this.showCommonErrorAlert,
      code
    )
  }

  isNotReady = () => {
    return this.state.inputList.length === 0;
  }
  validateInputType = () => {
    console.debug("validateInputType");
    if (this.isNotReady()) {
      this.loadInputList();
    }
  }
  componentDidUpdate() {
    this.validateInputType();
  }
  componentDidMount() {
    this.validateInputType();
    this.prepopulateForm();
  }

  prepopulateForm = () => {
    if (!this.props.recordToEdit || !this.ref.current) {
      return;
    }
    const fieldName = this.getEntityElement().id;
    let recordValue = this.props.recordToEdit[fieldName];
    if (!recordValue) return;

    let defaultInputValue = undefined;

    if (this.state.inputList.length === 0) {
      return;
    }
    const { optionValueName } = this.getEntityElement();
    if (!optionValueName)
      return;

    defaultInputValue = recordValue[optionValueName];
    if (defaultInputValue) {
      this.ref.current.value = defaultInputValue;
    }
  }

  render() {
    const element = this.getEntityElement();
    if (this.isNotReady()) {
      return <div className="form-group">Loading...</div>;
    }
    const { inputList: options } = this.state;
    return (
      <select ref={this.ref} className="form-control" name={element.id} >
        {options.map(option => {
          const { optionItemName, optionValueName } = element;
          if (!optionItemName || !optionValueName) { return null; }
          return (
            <option
              key={`fid-${uniqueId()}`}
              value={option[optionValueName]}
            >
              {option[optionItemName]}
            </option>
          )
        })}
      </select>
    );
  }
}


export default withRouter(connect(
  mapCommonUserStateToProps,
)(FormInputDropDown))