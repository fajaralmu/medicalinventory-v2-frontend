

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from '../../BaseComponent';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import MasterDataService from '../../../services/MasterDataService';
import WebResponse from '../../../models/WebResponse';
import EntityProperty from '../../../models/settings/EntityProperty';
import MasterDataList from './MasterDataList';
 
class MasterDataManagement extends BaseComponent {
    masterDataService: MasterDataService;
    code: string = "";
    loadingEntityProperty: boolean = false;
    entityProperty: undefined
    constructor(props: any) {
        super(props, true);
        this.masterDataService = this.getServices().masterDataService;
    }
    entityPropertyLoaded = (response: WebResponse) => {
        this.loadingEntityProperty = false;
        if (response.entityProperty == undefined) {
            return;
        }
        this.masterDataService.setEntityProperty(this.props.code, response.entityProperty);
        this.setState({ entityProperty: response.entityProperty });
        this.setTitle(response.entityProperty);
    }
    componentDidUpdate() {
        if (this.props.code != undefined && this.code != this.props.code) {
            this.code = this.props.code;
            this.loadEntityProperty();
        }
        console.debug("updated this.props.code: ", this.props.code);
    }
    setTitle = (entityProp: EntityProperty) => {
        document.title = new String(entityProp?.alias).toString();
    }
    componentDidMount() {
        if (this.props.code != undefined && this.code != this.props.code) {
            this.code = this.props.code;
            this.loadEntityProperty();
        }
    }
    startLoading() {
        //
    }
    endLoading() {
        //
    }
    loadEntityProperty() {

        if (undefined == this.code && this.loadingEntityProperty == true) {
            return;
        }
        const existingEntityProperty = this.masterDataService.getEntityProperty(this.code);
        if (existingEntityProperty != undefined) {
            this.loadingEntityProperty = false;
            this.setState({ entityProperty: existingEntityProperty });
            this.setTitle(existingEntityProperty);

            return;
        }
        this.loadingEntityProperty = true;
        this.setState({ entityProperty: undefined });
        this.commonAjax(
            this.masterDataService.loadEntityProperty,
            this.entityPropertyLoaded,
            (e: any) => { this.loadingEntityProperty = false; this.showCommonErrorAlert(e) },
            this.code
        )

    }
    render() {
        if (this.state.entityProperty == undefined) {
            return <div className="row">
                <div className="col-1"><div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                </div>
                <div className="col-10"><h4>Loading configuration</h4></div>
            </div>
        }
        return (
            <div id="MasterDataManagement" className="container-fluid">
                <h2>{this.state.entityProperty.alias}</h2>
                <MasterDataList  entityProperty={this.state.entityProperty} />
            </div>
        )
    }

} 
export default withRouter(connect(
    mapCommonUserStateToProps
)(MasterDataManagement))