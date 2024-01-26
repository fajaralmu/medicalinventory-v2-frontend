

import { resolve } from 'inversify-react';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../../../constant/stores';
import WebRequest from '../../../../../models/common/WebRequest';
import WebResponse from '../../../../../models/common/WebResponse';
import MasterDataService from '../../../../../services/MasterDataService';
import { uniqueId } from '../../../../../utils/StringUtil';
import Filter from './../../../../../models/common/Filter';
import AnchorWithIcon from './../../../../navigation/AnchorWithIcon';
import FieldProp from './../FieldProp';
import BaseField from './BaseField';
interface IState {
  inputList: any[];
  searchValue: string;
}
class FormInputDropDownDynamic extends BaseField<FieldProp, IState> {
  @resolve(MasterDataService)
  private masterDataService: MasterDataService;
  private readonly ref = React.createRef<HTMLSelectElement>();
  private readonly inputRef = React.createRef<HTMLDivElement>();
  constructor(props) {
    super(props);
    this.state = {
      inputList: [],
      searchValue: '',
    };
  }

  inputListLoaded = (response: WebResponse) => {
    if (!response.entities || response.entities.length === 0) {
      throw new Error(this.getEntityElement().labelName + " Not found");
    }
    this.setState({ inputList: response.entities }, () => {
      if (this.inputRef.current) {
        this.inputRef.current.focus();
      }
    });
  }
  loadInputList = () => {
    const element = this.getEntityElement();
    const { entityReferenceClass: code, optionItemName: searchKey } = element;

    if (!searchKey) { return; }
    const request: WebRequest = Object.assign(new WebRequest(), {
      entity: code,
      filter: Object.assign(new Filter(), {
        limit: 0, page: 0,
        fieldsFilter: {
          [searchKey]: this.inputRef.current?.innerHTML
        }
      }
      )
    });
    this.commonAjax(
      this.masterDataService.loadItems,
      this.inputListLoaded,
      this.showCommonErrorAlert,
      request
    )
  }

  prepopulateForm = () => {
    const { recordToEdit } = this.props;
    if (!recordToEdit || !this.ref.current) {
      return;
    }
    const fieldName = this.getEntityElement().id;
    let recordValue = recordToEdit[fieldName];
    if (!recordValue) return;
    this.setState({ inputList: [recordValue], searchValue: '' }, () => {
      let defaultInputValue = undefined;
      const optionValueName = this.getEntityElement().optionValueName;
      if (!optionValueName) return;
      defaultInputValue = recordValue[optionValueName];
      if (defaultInputValue && this.ref.current) {
        this.ref.current.value = defaultInputValue;
      }
    });
  }

  search = (event) => {
    if (event.keyCode === 13) {
      if (this.inputRef.current) {
        const div = this.inputRef.current;
        div.innerHTML = new String(div.innerText).trim();
      }
      event.preventDefault();
      this.loadInputList();
      return false;
    }
  }

  render() {
    const element = this.getEntityElement();
    const {
      id,
      optionValueName: optionItemValue,
      optionItemName,
      entityReferenceClass,
    } = element;
    const options = this.state.inputList;
    console.debug('options: ', options);
    const placeholder = entityReferenceClass + ' ' + optionItemName;
    return (
      <div>
        <div className="input-group mb-3">
          <div className="input-group-append">
            <span className="input-group-text">{placeholder}</span>
          </div>
          <div
            onKeyDown={this.search}
            ref={this.inputRef}
            contentEditable={true}
            className="form-control"
          />
          <div className="input-group-append">
            <AnchorWithIcon
              onClick={this.loadInputList}
              className="btn btn-secondary"
              children="Search"
            />
            <AnchorWithIcon
              show={this.props.recordToEdit != undefined}
              onClick={this.prepopulateForm}
              iconClassName="fas fa-sync-alt"
              className="btn btn-secondary"
            />
          </div>
        </div>
        <select
          {...this.getRequiredAttr()}
          ref={this.ref}
          className="form-control"
          name={id}
        >
          {options.map(option => {
            if (!optionItemName || !optionItemValue) { return null; }
            return (
              <option
                key={`fid-${uniqueId()}`}
                value={option[optionItemValue]}
              >
                {option[optionItemName]}
              </option>
            )
          })}
        </select>
      </div>
    );
  }
}

export default withRouter(connect(
  mapCommonUserStateToProps,
)(FormInputDropDownDynamic));
