

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import MasterDataService from './../../../services/MasterDataService';
import AnchorButton from './../../navigation/AnchorButton';
import EntityProperty from '../../../models/EntityProperty';
import WebResponse from './../../../models/WebResponse';

class EditDeleteAction extends BaseComponent {
    masterDataService:MasterDataService;
    constructor(props: any) {
        super(props, true);
        this.masterDataService = this.getServices().masterDataService;
    }
    delete = (e) => {
        const app = this;
        this.showConfirmationDanger("Delete record?")
        .then(function(ok){
            if (ok) {
                app.doDelete();
            }
        });
    }
    doDelete = () => {
        const record = this.props.record;
        const entityProperty:EntityProperty = this.props.entityProperty;
        const recordId = EntityProperty.getRecordId(record, entityProperty);
        this.commonAjax(
            this.masterDataService.delete,
            this.recordDeleted,
            this.showCommonErrorAlert,
            entityProperty.entityName, recordId
        )
    }
    getRecordById = () => {
        const record = this.props.record;
        const entityProperty:EntityProperty = this.props.entityProperty;
        const recordId = EntityProperty.getRecordId(record, entityProperty);
        this.commonAjax(
            this.masterDataService.getById,
            this.recordLoaded,
            this.showCommonErrorAlert,
            entityProperty.entityName,
            recordId
        );
    }
    recordLoaded = (response:WebResponse) => {
        if (!response.entities || response.entities.length == 0){
            throw new Error("Record not found");
        }
        if(this.props.showEditForm) {
            this.props.showEditForm(response);
        }
    }
    recordDeleted = (response:WebResponse) => {
        this.showInfo("Record deleted");
        this.props.reload();
    }
    render() {
        if (this.props.show == false) return null;
        return (
            <div className="btn-group">
                <AnchorButton onClick={this.getRecordById} iconClassName="fas fa-edit" className="btn btn-warning btn-sm"></AnchorButton>
                <AnchorButton onClick={this.delete} className="btn btn-danger btn-sm" iconClassName="fas fa-times"></AnchorButton>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(EditDeleteAction))