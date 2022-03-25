

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import Filter from '../../../models/common/Filter';
import HealthCenter from './../../../models/HealthCenter';
import ReportService from './../../../services/ReportService';
import MasterDataService from './../../../services/MasterDataService';
import WebResponse from '../../../models/common/WebResponse';
import FormGroup from './../../form/FormGroup';
import { getInputReadableDate } from '../../../utils/DateUtil';
import AnchorButton from './../../navigation/AnchorButton';
import AttachmentInfo from '../../../models/common/AttachmentInfo';
import InventoryService from './../../../services/InventoryService';
import Card from './../../container/Card';
import { MONTHS } from './../../../utils/DateUtil';
import { greeting } from '../../../utils/StringUtil';
import BasePage from './../../BasePage';
import { resolve } from 'inversify-react';
class State {
    filter: Filter = new Filter();
    healthCenters: HealthCenter[] = [];
    selectedHealthCenter: HealthCenter = new HealthCenter();
    period: Date = new Date();
}
class Report extends BasePage {
    state: State = new State();

    @resolve(MasterDataService)
    private masterDataService: MasterDataService;
    @resolve(ReportService)
    private reportService: ReportService;
    @resolve(InventoryService)
    private inventoryService: InventoryService;

    constructor(props: any) {
        super(props, "Laporan");
        const date = this.state.period;
        this.state.filter.day = date.getDate();
        this.state.filter.month = date.getMonth() + 1;
        this.state.filter.year = date.getFullYear();
    }
    componentDidMount() {
        this.loadHealthCenter();
        this.scrollTop();
    }
    healthCentersLoaded = (response: any|WebResponse) => {

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
    reportCreated = (attachment: AttachmentInfo) => {
        this.showConfirmation("Simpan " + attachment.name + " ?")
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
        const date = this.state.period.toLocaleDateString("ID");
        this.showConfirmation("Muat Stok Opname " + date + " : " + name + "?")
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
        const date = (this.state.period.getMonth() + 1) + " - " + this.state.period.getFullYear();
        this.showConfirmation("Muat Laporan Bulanan " + date + "?")
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
        const date = (this.state.period.getMonth() + 1) + " - " + this.state.period.getFullYear();
        this.showConfirmation("Muat LPLPO " + date + "?")
            .then((ok) => {
                if (!ok) return;
                this.commonAjaxWithProgress(
                    this.reportService.printReceiveRequestSheet,
                    this.reportCreated,
                    this.showCommonErrorAlert,
                    this.state.filter, this.state.selectedHealthCenter
                )
            });
    }
    adjustStocks = () => {
        this.showConfirmation("Kalkulasi Ulang Stok?")
            .then((ok) => {
                if (!ok) return;
                this.commonAjaxWithProgress(
                    this.inventoryService.adjustStocks,
                    () => this.showInfo("Success"),
                    this.showCommonErrorAlert,
                )
            });
    }
    render() {
        const period:Date = this.state.period;
        const filter:Filter = this.state.filter;
        const selectedMonthName = MONTHS[period.getMonth()];
        return (
            <div id="Report" className="container-fluid section-body">
                {this.titleTag()}
                <div className="alert alert-info">
                    {this.userGreeting()}
                    <form onSubmit={e => e.preventDefault()}>
                        <FormGroup label="Lokasi">
                            <select autoComplete="off" key="select-health-center" onChange={this.updateLocation} value={this.state.selectedHealthCenter.id??0} className="form-control">
                                {this.state.healthCenters.map((healthCenter, i) => {

                                    return <option key={"select-location-stock-" + i} value={healthCenter.id??0} >{healthCenter.name}</option>
                                })}
                            </select>
                        </FormGroup>
                        <FormGroup label="Periode">
                            <input autoComplete="off" onChange={this.updatePeriod} type="date" className="form-control"
                                value={getInputReadableDate(period)}
                            />
                        </FormGroup>
                    </form>
                </div>
                <div className="row">
                    <ReportButton onClick={this.loadStockOpname} description={["Tanggal",period.getDate(),selectedMonthName,filter.year].join(" ")}>
                        Stok Opname
                    </ReportButton>
                    <ReportButton onClick={this.loadMontlyReport} description={["Bulan",selectedMonthName,filter.year].join(" ")}>
                        Laporan Bulanan
                    </ReportButton>
                    <ReportButton onClick={this.printReceiveRequestSheet} description={["Bulan",selectedMonthName,filter.year].join(" ")}>
                        LPLPO
                    </ReportButton>
                    <ReportButton onClick={this.adjustStocks} description="">
                        Kalkulasi Ulang Stok
                    </ReportButton>
                </div>
            </div>
        )
    }
}

const ReportButton = (props: { onClick(): any, children: any, description:undefined|string }) => {
    return (
        <div className="col-md-3 text-center">
            <Card title={props.children}>  
                <p>{props.description}</p>     
                <AnchorButton iconClassName="far fa-file" onClick={props.onClick} >
                    Submit
                </AnchorButton>
            </Card>
        </div>
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(Report))