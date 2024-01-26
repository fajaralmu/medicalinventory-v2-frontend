

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
import BasePage from './../../BasePage';
import { resolve } from 'inversify-react';
type State = {
  filter;
  healthCenters: HealthCenter[];
  selectedHealthCenter: HealthCenter;
  period: Date;
}
class Report extends BasePage<any, State> {

  @resolve(MasterDataService)
  private masterDataService: MasterDataService;
  @resolve(ReportService)
  private reportService: ReportService;
  @resolve(InventoryService)
  private inventoryService: InventoryService;

  constructor(props: any) {
    super(props, "Laporan");
    this.state = {
      filter: new Filter(),
      healthCenters: [],
      selectedHealthCenter: new HealthCenter(),
      period: new Date(),
    };
    const { period } = this.state;
    this.state.filter.day = period.getDate();
    this.state.filter.month = period.getMonth() + 1;
    this.state.filter.year = period.getFullYear();
  }
  componentDidMount() {
    this.loadHealthCenter();
    this.scrollTop();
  }
  healthCentersLoaded = (response: any | WebResponse) => {
    this.masterDataService.setHealthCenters(response.entities ?? []);
    this.setState({
      healthCenters: response.entities,
      selectedHealthCenter: this.getMasterHealthCenter(),
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
    const healthCenters: HealthCenter[] = this.state.healthCenters.filter(h => h.id?.toString() === input.value);
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
    const { filter } = this.state;
    filter.day = date.getDate();
    filter.month = date.getMonth() + 1;
    filter.year = date.getFullYear();
    this.setState({ period: date, filter });
  }
  loadStockOpname = () => {
    const { name } = this.state.selectedHealthCenter;
    const date = this.state.period.toLocaleDateString("ID");
    this.showConfirmation("Muat stok opname periode " + date + " - " + name + "?")
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
    const { period } = this.state;
    const date = `${(period.getMonth() + 1)} - ${period.getFullYear()}`;
    this.showConfirmation(`Muat laporan bulanan periode ${date}?`)
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
    const { period } = this.state;
    const date = `${(period.getMonth() + 1)} - ${period.getFullYear()}`;
    this.showConfirmation(`Muat LPLPO periode ${date}?`)
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
  printRecipeReport = () => {
    const { period } = this.state;
    const date = `${(period.getMonth() + 1)} - ${period.getFullYear()}`;
    this.showConfirmation(`Muat laporan kesesuaian resep periode ${date}?`)
      .then((ok) => {
        if (!ok) return;
        this.commonAjaxWithProgress(
          this.reportService.printRecipeReport,
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
    const { period, filter, healthCenters, selectedHealthCenter } = this.state;
    const selectedMonthName = MONTHS[period.getMonth()];
    return (
      <div id="Report" className="container-fluid section-body">
        {this.titleTag()}
        <div className="alert alert-info">
          {this.userGreeting()}
          <form onSubmit={e => e.preventDefault()}>
            <FormGroup label="Lokasi">
              <select
                autoComplete="off"
                key="select-health-center"
                onChange={this.updateLocation}
                value={selectedHealthCenter.id ?? 0}
                className="form-control"
              >
                {healthCenters.map((healthCenter, i) => {
                  return (
                    <option
                      key={`slct-loc-stk-${i}`}
                      value={healthCenter.id ?? 0}
                    >
                      {healthCenter.name}
                    </option>
                  );
                })}
              </select>
            </FormGroup>
            <FormGroup label="Periode">
              <input
                autoComplete="off"
                onChange={this.updatePeriod}
                type="date"
                className="form-control"
                value={getInputReadableDate(period)}
              />
            </FormGroup>
          </form>
        </div>
        <div className="row">
          <ReportButton
            onClick={this.loadStockOpname}
            description={["Tanggal", period.getDate(), selectedMonthName, filter.year].join(" ")
            }>
            Stok Opname
          </ReportButton>
          <ReportButton
            onClick={this.loadMontlyReport}
            description={["Bulan", selectedMonthName, filter.year].join(" ")}
          >
            Laporan Bulanan
          </ReportButton>
          <ReportButton
            onClick={this.printReceiveRequestSheet}
            description={["Bulan", selectedMonthName, filter.year].join(" ")}
          >
            LPLPO
          </ReportButton>
          <ReportButton
            onClick={this.printRecipeReport}
            description={["Bulan", selectedMonthName, filter.year].join(" ")}
          >
            Kesesuaian Resep
          </ReportButton>
          <ReportButton onClick={this.adjustStocks} description="">
            Kalkulasi Ulang Stok
          </ReportButton>
        </div>
      </div>
    )
  }
}

const ReportButton = (props: { onClick(): any, children: any, description: undefined | string }) => {
  return (
    <div className="col-md-3 mb-2 text-center">
      <Card title={props.children}>
        <p>{props.description}</p>
        <AnchorButton
          iconClassName="far fa-file-alt"
          onClick={props.onClick}
          children="Submit"
        />
      </Card>
    </div>
  )
}

export default withRouter(connect(
  mapCommonUserStateToProps
)(Report))