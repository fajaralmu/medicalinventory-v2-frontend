

import React, { ChangeEvent, FormEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BasePage from '../../../BasePage';
import Filter from '../../../../models/common/Filter';
import PeriodFilter from './PeriodFilter';
import Modal from '../../../container/Modal';
import InventoryService from '../../../../services/InventoryService';
import WebResponse from '../../../../models/common/WebResponse';
import FormGroup from '../../../form/FormGroup';
import NavigationButtons from '../../../navigation/NavigationButtons';
import Product from './../../../../models/Product';
import SimpleError from '../../../alert/SimpleError';
import { tableHeader } from './../../../../utils/CollectionUtil';
import { beautifyNominal } from './../../../../utils/StringUtil';
import { resolve } from 'inversify-react';
interface State {
  filter;
  recordList: undefined | Product[];
  totalData: number;
}
class ProductStat extends BasePage<any, State> {
  @resolve(InventoryService)
  private inventoryService: InventoryService;

  constructor(props: any) {
    super(props, "Penggunaan Produk");
    this.state = {
      filter: new Filter(),
      recordList: undefined,
      totalData: 0,
    };
    const date = new Date();
    const { filter } = this.state;
    filter.year = filter.yearTo = date.getFullYear();
    filter.month = filter.monthTo = date.getMonth() + 1;
    filter.day = filter.dayTo = 1;
    filter.limit = 10;
    filter.fieldsFilter['name'] = '';
  }

  updateFilter = (e: ChangeEvent) => {
    const target: any = e.target;
    const name = target.getAttribute('name'), value = target.value;

    if (!name || !value)
      return;

    const { filter } = this.state;
    filter[name] = parseInt(value);
    this.setState({ filter });
  }
  setFilter = (e: FormEvent) => {
    e.preventDefault();
    this.loadRecords();
  }
  loadRecordsAtPage = (page: number) => {
    const { filter } = this.state;
    filter.page = page;
    this.setState({ filter }, this.loadRecords);
  }
  loadRecords = () => {
    this.commonAjaxWithProgress(
      this.inventoryService.getProductListWithUsage,
      this.usageDataLoaded,
      this.showCommonErrorAlert,
      this.state.filter
    )
  }
  usageDataLoaded = (response: WebResponse) => {
    this.setState({ recordList: response.entities, totalData: response.totalData });
  }
  updateFieldsFilter = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const { filter } = this.state;
    filter.fieldsFilter[target.name] = target.value;
    this.setState({ filter });
  }

  render() {
    const { filter, recordList: products, totalData } = this.state;
    return (
      <div className="section-body container-fluid">
        {this.titleTag()}
        <Modal title="Periode" >
          <form onSubmit={this.setFilter}>
            <PeriodFilter withDay fullPeriod filter={filter} onChange={this.updateFilter} />
            <FormGroup label="Limit" >
              <input
                value={filter.limit ?? 5}
                type="number"
                min={1}
                name="limit"
                className="form-control"
                onChange={this.updateFilter}
              />
            </FormGroup>
            <FormGroup label="Search by name">
              <input
                value={filter.fieldsFilter['name'] ?? ''}
                onChange={this.updateFieldsFilter}
                name="name"
                className="form-control"
              />
            </FormGroup>
            <button type="submit" className="btn btn-dark">Apply</button>
          </form>
        </Modal>
        <NavigationButtons
          activePage={filter.page ?? 0}
          limit={filter.limit ?? 10}
          totalData={totalData}
          onClick={this.loadRecordsAtPage} />
        {products ?
          <ProductList products={products} startNumber={(filter.page ?? 0) * (filter.limit ?? 10)} /> :
          <SimpleError>No data</SimpleError>
        }
      </div>
    )
  }
}

const ProductList = (props: { products: Product[], startNumber: number }) => {
  return (
    <table className="table table-striped" >
      {tableHeader("No", "Name", "Usage", "Unit")}
      <tbody>
        {props.products.map((product, i) => {
          return (
            <tr key={"product-stat-item-" + i}>
              <td>{props.startNumber + i + 1}</td>
              <td>{product.name}</td>
              <td>{beautifyNominal(product.count ?? 0)}</td>
              <td>{product.unit?.name}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
export default withRouter(connect(
  mapCommonUserStateToProps
)(ProductStat));
