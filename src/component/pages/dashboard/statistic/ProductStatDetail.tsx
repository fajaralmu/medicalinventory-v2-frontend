

import React, { ChangeEvent, FormEvent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BasePage from '../../../BasePage';
import ProductFormV2 from '../../transaction/ProductFormV2';
import Product from '../../../../models/Product';
import Filter from '../../../../models/common/Filter';
import PeriodFilter from './PeriodFilter';
import Modal from '../../../container/Modal';
import WebRequest from '../../../../models/common/WebRequest';
import InventoryService from '../../../../services/InventoryService';
import InventoryData from '../../../../models/stock/InventoryData';
import WebResponse from '../../../../models/common/WebResponse';
import SimpleError from '../../../alert/SimpleError';
import DashboardBarChart from './BarChart';
import Card from '../../../container/Card';
import FormGroup from '../../../form/FormGroup';
import { beautifyNominal } from '../../../../utils/StringUtil';
import PeriodicReviewResult from './../../../../models/stock/PeriodicReviewResult';
import { resolve } from 'inversify-react';

interface State {
  product: undefined | Product;
  filter;
  inventoriesData: undefined | InventoryData[];
  selectedItem: undefined | InventoryData;
  totalData: number;
  periodicReviewResult: undefined | PeriodicReviewResult
}
class ProductStatDetail extends BasePage<any, State> {
  @resolve(InventoryService)
  private inventoryService: InventoryService;

  constructor(props: any) {
    super(props, "Penggunaan Produk");
    this.state = {
      product: undefined,
      filter: new Filter(),
      inventoriesData: undefined,
      selectedItem: undefined,
      totalData: 0,
      periodicReviewResult: undefined,
    };
    const date = new Date();
    const { filter } = this.state;
    filter.year = filter.yearTo = date.getFullYear();
    filter.month = filter.monthTo = date.getMonth() + 1;
  }
  setProduct = (p: Product) => this.setState({ product: p });

  updateFilter = (e: ChangeEvent) => {
    const target: any = e.target;
    const name = target.getAttribute("name"), value = target.value;
    if (!name || !value) return;
    const { filter } = this.state;
    filter[name] = parseInt(value);
    this.setState({ filter });
  }
  setFilter = (e: FormEvent) => {
    e.preventDefault();
    if (!this.state.product) {
      this.showError("Please select product");
      return;
    }
    const req: WebRequest = new WebRequest();
    req.product = this.state.product;
    req.filter = this.state.filter;

    this.commonAjaxWithProgress(
      this.inventoryService.getProductUsage,
      this.usageDataLoaded,
      this.showCommonErrorAlert,
      req
    )
  }
  usageDataLoaded = (response: WebResponse) => {
    this.setState({ selectedItem: undefined, periodicReviewResult: response.inventoryData?.periodicReviewResult, inventoriesData: response.inventoriesData, totalData: response.totalData });
  }
  selectInventory = (index: number) => {
    if (this.state.inventoriesData === undefined) return;
    try {
      const selectedItem = this.state.inventoriesData[index];
      this.setState({ selectedItem });
    } catch (error) {

    }
  }
  render() {
    const { inventoriesData, periodicReviewResult, filter, selectedItem, product, totalData } = this.state;
    return (
      <div className="section-body container-fluid">
        {this.titleTag()}
        <div className="row">
          <div className="col-md-6">
            <Modal title="Periode" >
              <form onSubmit={this.setFilter}>
                <PeriodFilter fullPeriod filter={filter} onChange={this.updateFilter} />
                {product ?
                  <button type="submit" className="btn btn-dark">Apply</button> :
                  <i>Silakan pilih produk</i>}
              </form>
            </Modal>
          </div>
          <div className="col-md-6">
            <ProductFormV2 setProduct={this.setProduct} />
          </div>
        </div>
        <div>
          {inventoriesData ?
            (
              <UsageChart
                periodicReviewResult={periodicReviewResult}
                totalData={totalData}
                onClick={this.selectInventory}
                inventoriesData={inventoriesData}
              />
            )
            : <SimpleError>No data</SimpleError>}
        </div>
        {selectedItem && <UsageDetail item={selectedItem} />}
      </div>
    )
  }
}
const UsageDetail = (props: { item: InventoryData }) => {
  const item = Object.assign(new InventoryData, props.item);

  return <Card attributes={{ style: { marginTop: '10px' } }} title={"Detail Usage"} >
    <FormGroup label="Period">{item.getLabel()}</FormGroup>
    <FormGroup label="Amount">{beautifyNominal(item.getAmount())}</FormGroup>
  </Card>
}
const UsageChart = (props: { periodicReviewResult: undefined | PeriodicReviewResult, totalData: number, inventoriesData: InventoryData[], onClick(index: number): any }) => {

  return (
    <Card>
      <DashboardBarChart onClick={props.onClick} updated={new Date()}
        dataSet={InventoryData.toDataSets(props.inventoriesData)} />
      <div className="row">
        <div className="col-md-6">
          <FormGroup label="Total">{beautifyNominal(props.totalData)}</FormGroup>
        </div>
        <div className="col-md-6">
          {props.periodicReviewResult ?
            <PeriodicReviewResultContent periodicReviewResult={props.periodicReviewResult} />
            : null}
        </div>
      </div>
    </Card>
  )
}

const PeriodicReviewResultContent = (props: { periodicReviewResult: PeriodicReviewResult }) => {
  const review = props.periodicReviewResult;
  return (
    <Fragment>
      <FormGroup label="Safety stock">
        {review.safetyStock}
      </FormGroup>
      <FormGroup label="Target Stock Level">
        {review.targetStockLevel}
      </FormGroup>
      <FormGroup label="Order Size">
        {review.orderSize}
      </FormGroup>
      <FormGroup label="Description">
        {review.description}
      </FormGroup>
    </Fragment>
  )
}

export default withRouter(connect(
  mapCommonUserStateToProps
)(ProductStatDetail))