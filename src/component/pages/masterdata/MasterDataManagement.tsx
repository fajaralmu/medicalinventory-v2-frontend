

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from '../../BaseComponent';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import MasterDataService from '../../../services/MasterDataService';
import WebResponse from '../../../models/common/WebResponse';
import EntityProperty from '../../../models/settings/EntityProperty';
import MasterDataList from './MasterDataList';
import Filter from '../../../models/common/Filter';
import WebRequest from '../../../models/common/WebRequest';
import AttachmentInfo from '../../../models/common/AttachmentInfo';

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
            this.scrollTop();
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
    startLoading(withProgress: boolean) {
        if (withProgress == true) {
            super.startLoading(withProgress);
        }
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
    printRecord = (filter: Filter) => {
        const property = this.state.entityProperty;
        if (!property) return;
        this.showConfirmation("Print record? ")
            .then(ok => {
                if (!ok) return;
                const req: WebRequest = Object.assign(new WebRequest(), {
                    entity: property.entityName,
                    filter: filter
                });
                this.commonAjaxWithProgress(
                    this.masterDataService.generateReport,
                    this.reportCreated,
                    this.showCommonErrorAlert,
                    req);
            })
    }
    reportCreated = (attachment: AttachmentInfo) => {
        this.showConfirmation("Save File " + attachment.name + " ?")
            .then((ok) => {
                if (!ok) return;
                Object.assign(document.createElement('a'), {
                    target: '_blank',
                    download: attachment.name,
                    style: { display: 'none' },
                    href: attachment.dataUrl,
                }).click();
            })

    }
    render() {
        if (this.state.entityProperty == undefined) {
            return (
                <div className=" container-fluid section-body" style={{ paddingTop: '20px' }}>
                    <div className="row">
                        <div className="col-4 text-right">
                            <div className="spinner-border" role="status" />
                        </div>
                        <div className="col-8"><h4>Loading configuration</h4>
                        </div>
                    </div>
                </div>)
        }
        const title:string = this.state.entityProperty.alias;
        return (
            <div className="section-body container-fluid">
                <h2>{title}</h2>
                <hr/>
                <MasterDataList printRecord={this.printRecord} entityProperty={this.state.entityProperty} />
            </div>
        )
    }

}
export default withRouter(connect(
    mapCommonUserStateToProps
)(MasterDataManagement))