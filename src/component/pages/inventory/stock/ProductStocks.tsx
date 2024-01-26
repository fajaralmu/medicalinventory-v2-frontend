

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseComponent from '../../../BaseComponent';
import MasterDataService from '../../../../services/MasterDataService';
import Filter from '../../../../models/common/Filter';
import HealthCenter from '../../../../models/HealthCenter';
import ProductStock from '../../../../models/stock/ProductStock';
import WebResponse from '../../../../models/common/WebResponse';
import InventoryService from '../../../../services/InventoryService';
import FormGroup from '../../../form/FormGroup';
import Spinner from '../../../loader/Spinner';
import Card from '../../../container/Card';
import ProductStocksTable from './ProductStocksTable';
import NavigationButtons from '../../../navigation/NavigationButtons';
import Configuration from './../../../../models/Configuration';
import { getHtmlInputElement } from './../../../../utils/ComponentUtil';
import ToggleButton from '../../../navigation/ToggleButton';
import { addDays, getDiffDays, getInputReadableDate } from './../../../../utils/DateUtil';
import { beautifyNominal, greeting } from '../../../../utils/StringUtil';
import BasePage from './../../../BasePage';
import { resolve } from 'inversify-react';

type State = {
  productStocks: ProductStock[];
  loading: boolean;
  filter;
  totalData: number;
  totalItems: number;
  healthCenters: HealthCenter[];
  selectedHealthCenter: HealthCenter;
  configuration: Configuration;
  productName: string;
}

class ProductStocks extends BasePage<any, State> {
  @resolve(MasterDataService)
  private masterDataService: MasterDataService;
  @resolve(InventoryService)
  private inventoryService: InventoryService;

  constructor(props: any) {
    super(props, 'Stok Produk');
    this.state = {
      productStocks: [],
      loading: false,
      filter: new Filter(),
      totalData: 0,
      totalItems: 0,
      healthCenters: [],
      selectedHealthCenter: new HealthCenter(),
      configuration: new Configuration(),
      productName: ''
    };
    this.state.filter.limit = 10;
  }

  componentDidMount() {
    this.scrollTop();
    this.loadHealthCenter();
  }

  updateFilterExpDate = (e: ChangeEvent) => {
    const input = getHtmlInputElement(e);
    let value;
    if (input.type === 'date') {
      const selectedDate = new Date(input.value)
      const diffDay = getDiffDays(new Date(), selectedDate);
      value = diffDay;
      console.debug("diffDay: ", diffDay);
    } else {
      value = input.value;
    }
    const { configuration } = this.state;
    configuration.expiredWarningDays = parseInt(value);
    this.setState({ configuration });
  }

  healthCentersLoaded = (response: any | WebResponse) => {
    this.masterDataService.setHealthCenters(response.entities);
    this.setState({
      healthCenters: response.entities,
      selectedHealthCenter: this.getMasterHealthCenter()
    }, this.loadProducts);
  }

  productLoaded = (response: WebResponse) => {
    const { configuration, filter } = this.state;
    const config = response.configuration ?? new Configuration();
    if (filter.filterExpDate) {
      config.expiredWarningDays = configuration.expiredWarningDays;
    }
    this.setState({
      totalItems: response.totalItems,
      configuration: config, loading: false,
      totalData: response.totalData,
      productStocks: response.generalList
    });
  }

  loadProductsAt = (page: number) => {
    const { filter } = this.state;
    filter.page = page;
    this.setState({ filter }, this.loadProducts);

  }
  productLoadingError = (e: any) => {
    this.showCommonErrorAlert(e);
    this.setState({ loading: false });
  }
  loadProducts = (page: number = -1) => {
    this.setState({ loading: true }, () => {
      if (page >= 0) {
        const { filter } = this.state;
        filter.page = page;
        this.setState({ filter }, this.doLoadProduct)
      } else {
        this.doLoadProduct();
      }
    }
    );
  }
  doLoadProduct = () => {
    const { filter, configuration, productName, selectedHealthCenter } = this.state;
    if (filter.filterExpDate && filter.ignoreEmptyValue === true) {
      filter.day = configuration.expiredWarningDays;
    }
    filter.fieldsFilter = {
      name: productName
    }
    this.commonAjaxWithProgress(
      this.inventoryService.getProductsInHealthCenter,
      this.productLoaded,
      this.productLoadingError,
      filter,
      selectedHealthCenter
    )
  }
  getLocations = () => {
    const allLocObject = new HealthCenter();
    allLocObject.id = 0;
    allLocObject.name = 'ALL';
    const locations = [allLocObject];
    const { healthCenters } = this.state;
    locations.push(...healthCenters);
    return locations;
  }
  updateLocation = (e: ChangeEvent) => {
    const input = e.target as HTMLSelectElement;
    const { filter } = this.state;
    if (input.value.toString() === (0).toString()) {
      filter.flag = Filter.FLAG_ALL;

    } else {
      filter.flag = Filter.FLAG_DEFAULT;
    }
    const healthCenters = this.getLocations().filter(h => h.id?.toString() === input.value);

    this.showConfirmation("Ubah Lokasi? *muat ulang untuk melihat perubahan").then((ok) => {
      if (!ok) return;
      if (healthCenters.length > 0) {
        this.setState({ filter, selectedHealthCenter: healthCenters[0] });
      }
    });
  }

  loadHealthCenter = () => {
    if (this.masterDataService.getHealthCenters().length > 0) {
      const r = { entities: this.masterDataService.getHealthCenters() };
      this.healthCentersLoaded(r);
      return;
    }
    this.commonAjax(
      this.masterDataService.loadHealthCenters,
      this.healthCentersLoaded,
      this.showCommonErrorAlert,
    )
  }
  getDisplayedRecordOptions = () => {
    const { totalData } = this.state;
    if (totalData <= 10) { return [10] }
    const range = totalData / 10;
    const options: number[] = [];
    let counter = 10;
    for (let i = 0; i < range; i++) {
      options.push(counter);
      counter += 10;
    }
    if (counter < totalData) {
      options.push(totalData);
    }
    return options;
  }
  setIgnoreEmpty = (value: boolean) => {
    const { filter } = this.state;
    filter.ignoreEmptyValue = value;
    this.setState({ filter });
  }
  setFilterExpDate = (value: boolean) => {
    const { filter } = this.state;
    filter.filterExpDate = value;
    this.setState({ filter });
  }
  updateLimit = (e: any) => {
    const value = e.target.value;
    this.showConfirmation("Ubah jumlah tampilan?").then((ok) => {
      if (!ok) return;
      const { filter } = this.state;
      filter.limit = value;
      filter.page = 0;
      this.setState({ filter }, this.loadProducts);
    });
  }
  render() {
    if (this.getLocations().length === 0) {
      return (
        <div id="ProductStocks" className="container-fluid section-body">
          <h2>Stok Produk</h2>
          <Spinner />
        </div>
      )
    }
    const { filter, totalItems, configuration, productName } = this.state;
    const { ignoreEmptyValue, filterExpDate } = filter;

    return (
      <div id="ProductStocks" className="container-fluid section-body">
        {this.titleTag()}

        <form onSubmit={e => { e.preventDefault(); this.loadProducts(0) }} className="alert alert-info">
          <p>{greeting()}, <strong>{this.getLoggedUser()?.displayName}</strong></p>
          <hr />
          <LocationSelect
            updateLocation={this.updateLocation}
            selectedLocation={this.state.selectedHealthCenter}
            locations={this.getLocations()}
          />
          <FormGroup label="Jumlah Tampilan">
            <select
              key="select-displayed-record"
              onChange={this.updateLimit}
              value={filter.limit ?? 5}
              className="form-control"
            >
              {this.getDisplayedRecordOptions().map((value, i) => {
                return (
                  <option key={`select-displayed-record-${i}-${value}`} value={value}>{value}</option>
                );
              })}
            </select>
          </FormGroup>
          <FormGroup label="Total Stok">
            <strong>{beautifyNominal(totalItems)}</strong>
          </FormGroup>
          <FormGroup label="Filter">
            <input
              className="form-control"
              placeholder="Name"
              name="productName"
              value={productName}
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <FormGroup label="Abaikan Stok Kosong">
            <ToggleButton active={ignoreEmptyValue === true} onClick={this.setIgnoreEmpty} />
          </FormGroup>
          {
            ignoreEmptyValue &&
            <ExpDateFilter
              active={filterExpDate === true}
              update={this.updateFilterExpDate}
              toggle={this.setFilterExpDate}
              expiredWarningDays={configuration.expiredWarningDays}
            />
          }
          <SubmitBtn />
        </form>
        <p />
        <Card title="Daftar Produk">
          <NavigationButtons
            activePage={filter.page ?? 0}
            onClick={this.loadProductsAt}
            limit={filter.limit ?? 10}
            totalData={this.state.totalData}
          />
          {
            this.state.loading ?
              <Spinner /> :
              <ProductStocksTable
                location={this.state.selectedHealthCenter}
                startingNumber={(filter.page ?? 0) * (filter.limit ?? 0) + 1}
                productStocks={this.state.productStocks}
              />
          }
        </Card>
      </div>
    )
  }
}
const ExpDateFilter = (props: {
  update(e: ChangeEvent): any,
  toggle(val: boolean): any,
  active: boolean,
  expiredWarningDays: number
}) => {
  const { expiredWarningDays, update } = props;
  const expDateFilterWithin = addDays(new Date(), expiredWarningDays);
  const dateValue = getInputReadableDate(expDateFilterWithin);
  const _class = 'form-control-sm';
  return (
    <FormGroup label="Kadaluarsa">
      <div className="row">
        <div className="col-2">
          <ToggleButton active={props.active === true} onClick={props.toggle} />
        </div>
        {
          props.active &&
          (
            <div className="col-10 input-group">
              <span className={_class}>Dalam ({expDayLabel(expiredWarningDays)})</span>
              <input required type="number" className={_class} value={expiredWarningDays} onChange={update} />
              <span className={_class}>Max Tanggal</span>
              <input onChange={props.update} required type="date" className={_class} value={dateValue} />
            </div>
          )
        }
      </div>
    </FormGroup>
  )
}
const expDayLabel = (days: number) => {
  if (days < 0) {
    return `${Math.abs(days)} Hari yang lalu`;
  }
  return `${days} Hari`;
}
const SubmitBtn = (props) => {
  return (
    <FormGroup>
      <button type="submit" className="btn btn-success">
        <i className="fas fa-sync-alt mr-2" />
        <span>Muat Ulang</span>
      </button>
    </FormGroup>
  )
}
const LocationSelect = (props: { updateLocation(e): any, selectedLocation: HealthCenter, locations: HealthCenter[] }) => {
  return (
    <FormGroup label="Lokasi">
      <select
        key="select-health-center"
        onChange={props.updateLocation}
        value={props.selectedLocation.id ?? ''}
        className="form-control"
      >
        {props.locations.map((location, i) => {
          return <option key={`slct-loc-stk-${i}`} value={location.id ?? ''}>{location.name}</option>
        })}
      </select>
    </FormGroup>
  )
}
export default withRouter(connect(
  mapCommonUserStateToProps
)(ProductStocks))