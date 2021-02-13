

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseComponent from '../../../BaseComponent';
import MasterDataService from '../../../../services/MasterDataService';
import Filter from '../../../../models/Filter';
import HealthCenter from '../../../../models/HealthCenter';
import ProductStock from '../../../../models/ProductStock';
import WebResponse from '../../../../models/WebResponse';
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
import { beautifyNominal } from '../../../../utils/StringUtil';
class IState {
    productStocks: ProductStock[] = new Array();
    loading: boolean = false;
    filter: Filter = new Filter();
    totalData: number = 0;
    totalItems: number = 0;
    healthCenters: HealthCenter[] = [];
    selectedHealthCenter: HealthCenter = new HealthCenter();
    configuration: Configuration = new Configuration();
}

class ProductStocks extends BaseComponent {
    masterDataService: MasterDataService;
    inventoryService: InventoryService;
    state: IState = new IState();
    constructor(props: any) {
        super(props, true);
        this.state.filter.limit = 10;
        this.masterDataService = this.getServices().masterDataService;
        this.inventoryService = this.getServices().inventoryService;
    }

    componentDidMount() {
        this.setPageTitle("Stok Produk");
        this.validateLoginStatus(this.loadHealthCenter);
    }

    updateFilterExpDate = (e: ChangeEvent) => {
        const input = getHtmlInputElement(e);
        let value;
        if (input.type == 'date') {
            const selectedDate = new Date(input.value)
            const diffDay = getDiffDays(new Date(), selectedDate);
            value = diffDay;
            console.debug("diffDay: ", diffDay);
        } else {
            value = input.value;
        }
        const config = this.state.configuration;
        config.expiredWarningDays = parseInt(value);
        this.setState({ configuration: config });
    }

    healthCentersLoaded = (response: WebResponse) => {

        if (!response.entities) { return; }
        this.masterDataService.setHealthCenters(response.entities ?? []);
        this.setState({
            healthCenters: response.entities, selectedHealthCenter:
                this.getMasterHealthCenter()
        },
            this.loadProducts);
    }

    productLoaded = (response: WebResponse) => {
        const config = response.configuration ?? new Configuration();
        if (this.state.filter.filterExpDate) {
            config.expiredWarningDays = this.state.configuration.expiredWarningDays;
        }
        this.setState({
            totalItems: response.totalItems,
            configuration: config, loading: false,
            totalData: response.totalData,
            productStocks: response.generalList
        });
    }

    loadProductsAt = (page: number) => {
        const filter = this.state.filter;
        filter.page = page;
        this.setState({ filter: filter }, this.loadProducts);

    }
    productLoadingError = (e: any) => {
        this.showCommonErrorAlert(e);
        this.setState({ loading: false });
    }
    loadProducts = (page: number = -1) => {
        this.setState({ loading: true }, () => {
            if (page >= 0) {
                const filter = this.state.filter;
                filter.page = page;
                this.setState({ filter: filter }, this.doLoadProduct)
            } else {
                this.doLoadProduct();
            }
        }
        );
    }
    doLoadProduct = () => {
        const filter = this.state.filter;
        if (filter.filterExpDate && filter.ignoreEmptyValue == true) {
            filter.day = this.state.configuration.expiredWarningDays;
        }
        this.commonAjaxWithProgress(
            this.inventoryService.getProductsInHealthCenter,
            this.productLoaded, this.productLoadingError,
            filter, this.state.selectedHealthCenter
        )
    }
    updateLocation = (e: ChangeEvent) => {
        const input = e.target as HTMLSelectElement;
        const healthCenters: HealthCenter[] = this.state.healthCenters.filter(h => h.id?.toString() == input.value);

        this.showConfirmation("Ubah Lokasi? *muat ulang untuk melihat perubahan").then((ok) => {
            if (!ok) return;
            if (healthCenters.length > 0) {
                this.setState({ selectedHealthCenter: healthCenters[0] });
            }
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
    getDisplayedRecordOptions = () => {
        if (this.state.totalData <= 10) { return [10] }
        const range = this.state.totalData / 10;
        const options: number[] = [];
        let counter = 10;
        for (let i = 0; i < range; i++) {
            options.push(counter);
            counter += 10;
        }
        if (counter < this.state.totalData) {
            options.push(this.state.totalData);
        }
        return options;
    }
    setIgnoreEmpty = (value: boolean) => {
        const filter = this.state.filter;
        filter.ignoreEmptyValue = value;
        this.setState({ filter: filter });
    }
    setFilterExpDate = (value: boolean) => {
        const filter = this.state.filter;
        filter.filterExpDate = value;
        this.setState({ filter: filter });
    }
    updateLimit = (e: any) => {
        const value = e.target.value;
        this.showConfirmation("Ubah jumlah tampilan?").then((ok) => {
            if (!ok) return;
            const filter = this.state.filter;
            filter.limit = value;
            filter.page = 0;
            this.setState({ filter: filter }, this.loadProducts);
        });
    }
    render() {
        if (this.state.healthCenters.length == 0) {
            return (
                <div id="ProductStocks" className="container-fluid">
                    <h2>Stok Produk</h2><Spinner />
                </div>
            )
        }
        const ignoreEmptyValue = this.state.filter.ignoreEmptyValue;
        const filterExpDate = this.state.filter.filterExpDate;
        const expDateFilterWithin = addDays(new Date(), this.state.configuration.expiredWarningDays);
        return (
            <div id="ProductStocks" className="container-fluid">
                <h2>Stok Produk</h2>
                <form onSubmit={e => { e.preventDefault(); this.loadProducts(0) }} className="alert alert-info">
                    Selamat Datang, <strong>{this.getLoggedUser()?.displayName}</strong>
                    <FormGroup label="Lokasi">
                        <select key="select-health-center" onChange={this.updateLocation} value={this.state.selectedHealthCenter.id} className="form-control">
                            {this.state.healthCenters.map((healthCenter, i) => {
                                return <option key={"select-location-stock-" + i} value={healthCenter.id} >{healthCenter.name}</option>
                            })}
                        </select>
                    </FormGroup>
                    <FormGroup label="Jumlah Tampilan">
                        <select key="select-displayed-record" onChange={this.updateLimit} value={this.state.filter.limit} className="form-control">
                            {this.getDisplayedRecordOptions().map((value, i) => {
                                return <option key={"select-displayed-record-" + i + "-" + value} value={value} >{value}</option>
                            })}
                        </select>
                    </FormGroup>
                    <FormGroup label="Total Stok">
                        <strong >{beautifyNominal(this.state.totalItems)}</strong>
                    </FormGroup>
                    <FormGroup label="Abaikan Stok Kosong">
                        <ToggleButton active={ignoreEmptyValue == true} onClick={this.setIgnoreEmpty} />
                    </FormGroup>
                    {ignoreEmptyValue == false ? null :
                        <FormGroup label="Maksimal Kadaluarsa">
                            <div className="row">
                                <div className="col-2">
                                    <ToggleButton active={filterExpDate == true} onClick={this.setFilterExpDate} />
                                </div>
                                {filterExpDate ? <div className="col-6 input-group">
                                    <input required type="number" className="form-control-sm" value={this.state.configuration.expiredWarningDays} onChange={this.updateFilterExpDate} />
                                    <input onChange={this.updateFilterExpDate} required type="date" className="form-control-sm" value={getInputReadableDate(expDateFilterWithin)} />
                                </div> : null}
                            </div>
                        </FormGroup>}

                    <FormGroup>
                        <button type="submit" className="btn btn-success" >
                            <i style={{ marginRight: '5px' }} className="fas fa-sync-alt" />Muat Ulang
                        </button>
                    </FormGroup>
                </form>
                <p />
                <Card title="Daftar Produk">
                    <NavigationButtons
                        activePage={this.state.filter.page ?? 0}
                        limit={this.state.filter.limit ?? 10} totalData={this.state.totalData}
                        onClick={this.loadProductsAt} />
                    {this.state.loading ? <Spinner /> :
                        <ProductStocksTable location={this.state.selectedHealthCenter} startingNumber={
                            ((this.state.filter.page ?? 0) * (this.state.filter.limit ?? 0) + 1)
                        } productStocks={this.state.productStocks} />
                    }
                </Card>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(ProductStocks))