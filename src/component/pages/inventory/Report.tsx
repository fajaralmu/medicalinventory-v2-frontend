

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
import InventoryService from './../../../services/InventoryService';
class State {
    filter: Filter = new Filter();
    healthCenters: HealthCenter[] = [];
    selectedHealthCenter: HealthCenter = new HealthCenter();
    period: Date = new Date();
}
class Report extends BaseComponent {
    state: State = new State();
    masterDataService: MasterDataService;
    reportService: ReportService;
    inventoryService: InventoryService;
    constructor(props: any) {
        super(props, true);
        const date = this.state.period;
        this.state.filter.day = date.getDate();
        this.state.filter.month = date.getMonth() + 1;
        this.state.filter.year = date.getFullYear();
        this.reportService = this.getServices().reportService;
        this.masterDataService = this.getServices().masterDataService;
        this.inventoryService = this.getServices().inventoryService;
    }
    componentDidMount() {
        this.setPageTitle("Laporan");
        this.validateLoginStatus(this.loadHealthCenter);

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
        this.showConfirmation("Simpan "+attachment.name+ " ?")
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
        filter.day = date.getDate();
        filter.month = date.getMonth() + 1;
        filter.year = date.getFullYear();
        this.setState({ period: date, filter: filter });
    }
    loadStockOpname = () => {
        const name = this.state.selectedHealthCenter.name;
        const date = this.state.period.toDateString();
        this.showConfirmation("Muat Stok Opname " +date+ " : " + name + "?")
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
        this.showConfirmation("Muat Laporan Bulanan "+date+"?")
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
        this.showConfirmation("Cetak LPLPO "+date+"?")
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
    adjustStocks = () => { 
        this.showConfirmation("Kalkulasi Ulang Stok?")
            .then((ok) => { if (!ok) return;
                this.commonAjaxWithProgress(
                    this.inventoryService.adjustStocks,
                    ()=> this.showInfo("Success"),
                    this.showCommonErrorAlert, 
                )
            });
    }
    render() {
        const period = this.state.period;
        return (
            <div id="Report" className="container-fluid section-body">
                <h2>Report {period.toDateString()}</h2>
                <div className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.displayName}</strong>
                    <form onSubmit={e => e.preventDefault()}>
                        <FormGroup label="Lokasi">
                            <select autoComplete="off"  key="select-health-center" onChange={this.updateLocation} value={this.state.selectedHealthCenter.id} className="form-control">
                                {this.state.healthCenters.map((healthCenter, i) => {

                                    return <option key={"select-location-stock-" + i} value={healthCenter.id} >{healthCenter.name}</option>
                                })}
                            </select>
                        </FormGroup>
                        <FormGroup label="Periode">
                            <input autoComplete="off" onChange={this.updatePeriod} type="date" className="form-control"
                                value={getInputReadableDate(period)}
                            />
                        </FormGroup>
                        <FormGroup  >
                            <div className="btn-group">
                                <AnchorButton className="btn btn-dark" onClick={this.loadStockOpname} >Stok Opname</AnchorButton>
                                <AnchorButton className="btn btn-dark" onClick={this.loadMontlyReport} >Laporan Bulanan</AnchorButton>
                                <AnchorButton className="btn btn-dark" onClick={this.printReceiveRequestSheet} >LPLPO</AnchorButton>
                                <AnchorButton className="btn btn-dark" onClick={this.adjustStocks} >Kalkulasi Ulang Stok</AnchorButton>
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