

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseComponent from './../../BaseComponent';
import Filter from './../../../models/Filter';
import HealthCenter from './../../../models/HealthCenter';
import ReportService from './../../../services/ReportService';
import MasterDataService from './../../../services/MasterDataService';
import WebResponse from './../../../models/WebResponse';
import FormGroup from './../../form/FormGroup';
import { getInputReadableDate } from '../../../utils/DateUtil';
import AnchorButton from './../../navigation/AnchorButton';
import AttachmentInfo from './../../../models/AttachmentInfo';
const date = new Date();
class State {
    filter: Filter = new Filter();
    healthCenters: HealthCenter[] = [];
    selectedHealthCenter: HealthCenter = new HealthCenter();
    period: Date = date;
}
class Report extends BaseComponent {
    state: State = new State();
    masterDataService: MasterDataService;
    reportService: ReportService;
    constructor(props: any) {
        super(props, true);
        this.state.filter.day = date.getDay();
        this.state.filter.month = date.getMonth() + 1;
        this.state.filter.year = date.getFullYear();
        this.reportService = this.getServices().reportService;
        this.masterDataService = this.getServices().masterDataService;
    }
    componentDidMount() {
        this.validateLoginStatus();
        this.loadHealthCenter();

    }
    healthCentersLoaded = (response: WebResponse) => {

        if (!response.entities) { return; }
        this.masterDataService.setHealthCenters(response.entities ?? []);
        this.setState({
            healthCenters: response.entities, selectedHealthCenter:
                this.getMasterHealthCenter()
        });
    }
    loadHealthCenter = () => {
        if (this.masterDataService.getHealthCenters().length > 0) {
            this.healthCentersLoaded({ entities: this.masterDataService.getHealthCenters() });
            return;
        }
        this.commonAjax(
            this.masterDataService.loadHealthCenters,
            this.healthCentersLoaded,
            this.showCommonErrorAlert,
        )
    }
    updateLocation = (e: ChangeEvent) => {
        const input = e.target as HTMLSelectElement;
        const healthCenters: HealthCenter[] = this.state.healthCenters.filter(h => h.id?.toString() == input.value);
        if (healthCenters.length > 0) {
            this.setState({ selectedHealthCenter: healthCenters[0] });

        }
    }
    reportCreated =(attachment:AttachmentInfo) => {
        this.showConfirmation("Save "+attachment.name+ " ?")
        .then((ok) => {
            if(!ok) return;
            Object.assign(document.createElement('a'), {
                target: '_blank',
                download: attachment.name,
                style: {display: 'none'},
                href: attachment.dataUrl,
              }).click();
        })
       
    }
    updatePeriod = (e) => {
        const date = new Date(e.target.value);
        const filter = this.state.filter;
        filter.day = date.getDay();
        filter.month = date.getMonth() + 1;
        filter.year = date.getFullYear();
        this.setState({ period: date, filter: filter });
    }
    loadStockOpname = () => {
        const name = this.state.selectedHealthCenter.name;
        const date = getInputReadableDate(this.state.period);
        this.showConfirmation("Load stock opname " +date+ " in " + name + "?")
            .then((ok) => {
                if (!ok) return;
                this.commonAjaxWithProgress(
                    this.reportService.loadStockOpnameReport,
                    this.reportCreated,
                    this.showCommonErrorAlert,
                    this.state.filter, this.state.selectedHealthCenter
                )
            });
    }
    loadMontlyReport = () => {
        const date = (this.state.period.getMonth()+1)+ " - "+ this.state.period.getFullYear();
        this.showConfirmation("Load Montly Report "+date+"?")
            .then((ok) => {
                if (!ok) return;
                this.commonAjaxWithProgress(
                    this.reportService.loadMontlyReport,
                    this.reportCreated,
                    this.showCommonErrorAlert,
                    this.state.filter 
                )
            });
    }
    printReceiveRequestSheet = () => {
        const date = (this.state.period.getMonth()+1)+ " - "+ this.state.period.getFullYear();
        this.showConfirmation("Print Receive Request Sheet "+date+"?")
            .then((ok) => {
                if (!ok) return;
                this.commonAjaxWithProgress(
                    this.reportService.printReceiveRequestSheet,
                    this.reportCreated,
                    this.showCommonErrorAlert,
                    this.state.filter , this.state.selectedHealthCenter
                )
            });
    }
    render() {
        const period = this.state.period;
        return (
            <div id="Report" className="container-fluid">
                <h2>Report</h2>
                <div className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.displayName}</strong>
                    <form onSubmit={e => e.preventDefault()}>
                        <FormGroup label="Location">
                            <select autoComplete="off"  key="select-health-center" onChange={this.updateLocation} value={this.state.selectedHealthCenter.id} className="form-control">
                                {this.state.healthCenters.map((healthCenter, i) => {

                                    return <option key={"select-location-stock-" + i} value={healthCenter.id} >{healthCenter.name}</option>
                                })}
                            </select>
                        </FormGroup>
                        <FormGroup label="Period">
                            <input autoComplete="off" onChange={this.updatePeriod} type="date" className="form-control"
                                value={getInputReadableDate(period)}
                            />
                        </FormGroup>
                        <FormGroup label="Options">
                            <div className="btn-group">
                                <AnchorButton className="btn btn-dark" onClick={this.loadStockOpname} >Stock Opname</AnchorButton>
                                <AnchorButton className="btn btn-dark" onClick={this.loadMontlyReport} >Monthly Report</AnchorButton>
                                <AnchorButton className="btn btn-dark" onClick={this.printReceiveRequestSheet} >LPLPO</AnchorButton>
                            </div>
                        </FormGroup>
                    </form>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(Report))