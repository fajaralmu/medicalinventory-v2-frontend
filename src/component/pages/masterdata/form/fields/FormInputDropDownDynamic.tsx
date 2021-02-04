

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../../constant/stores';
import MasterDataService from '../../../../../services/MasterDataService';
import WebResponse from '../../../../../models/WebResponse';
import BaseComponent from '../../../../BaseComponent';
import { uniqueId } from '../../../../../utils/StringUtil';
import BaseField from './BaseField';
import AnchorWithIcon from './../../../../navigation/AnchorWithIcon';
import WebRequest from './../../../../../models/WebRequest';
class IState {
    inputList: any[] = [];
    searchValue: string = ""
}
class FormInputDropDownDynamic extends BaseField {
    masterDataService: MasterDataService;
    state: IState = new IState();
    ref: React.RefObject<any> = React.createRef();
    constructor(props: any) {
        super(props);
        this.masterDataService = this.getServices().masterDataService;
    }

    inputListLoaded = (response: WebResponse) => {
        if (!response.entities || response.entities.length == 0) {
            throw new Error("Not found");
        }
        this.setState({ inputList: response.entities });
    }
    loadInputList = () => {
        const element = this.getEntityElement();

        const code = element.entityReferenceClass;
        const searchKey = element.optionItemName;
        if (!searchKey)  { return; }
        const request: WebRequest = {
            entity: code,
            filter: {
                limit: 0, page: 0,
                fieldsFilter: {
                    [searchKey]:this.state.searchValue
                }
            }
        }
        this.commonAjax(
            this.masterDataService.loadEntities,
            this.inputListLoaded,
            this.showCommonErrorAlert,
            request
        )
    }

    prepopulateForm = () => {
        if (!this.props.recordToEdit || !this.ref.current) {
            return;

        }
        const fieldName = this.getEntityElement().id;
        let recordValue = this.props.recordToEdit[fieldName];
        if (!recordValue) return;
        this.setState({inputList:[recordValue], searchValue: ""} , ()=>{
            let defaultInputValue = undefined;
            const optionValueName = this.getEntityElement().optionValueName;
            if (!optionValueName) return;
            defaultInputValue = recordValue[optionValueName]; 
            if (defaultInputValue) {
                this.ref.current.value = defaultInputValue;
            }
        });
    }

    updateSearchValue = (e) => {
        this.setState({searchValue:e.target.value});
    }

    render() {
        const element = this.getEntityElement();
        const optionItemValue = element.optionValueName;
        const optionItemName = element.optionItemName;
        const options = this.state.inputList;
        const placeholder:string = "Search " + element.entityReferenceClass+ " "+ optionItemName;
        return (
            <div>
                <div className="input-group mb-3">
                    <input key={"search-val-"+element.id} onChange={this.updateSearchValue} value={this.state.searchValue} type="text" className="form-control" 
                    placeholder={placeholder} />
                    <div className="input-group-append">
                        <AnchorWithIcon onClick={this.loadInputList} className="btn btn-secondary" children="Search"/>
                        <AnchorWithIcon show={this.props.recordToEdit != undefined} onClick={this.prepopulateForm} iconClassName="fas fa-sync-alt" className="btn btn-secondary"/>
          
                    </div>
                </div>
                <select  {...this.getRequiredAttr()} ref={this.ref} className="form-control" name={element.id} >
                    {options.map(option => {
                        if (!optionItemName || !optionItemValue) { return null; }
                        return (
                            <option key={"fid-" + uniqueId() + "-"} value={option[optionItemValue]} >{option[optionItemName]}</option>
                        )
                    })}
                </select>
                  </div>)
    }

}


export default withRouter(connect(
    mapCommonUserStateToProps,
)(FormInputDropDownDynamic))