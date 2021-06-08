

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
class IState {
    productStocks: ProductStock[] = new Array();
    loading: boolean = false;
    filter: Filter = new Filter();
    totalData: number = 0;
    totalItems: number = 0;
    healthCenters: HealthCenter[] = [];
    selectedHealthCenter: HealthCenter = new HealthCenter();
    configuration: Configuration = new Configuration();
    productName:string = ""
}

class ProductStocks extends BasePage {
    masterDataService: MasterDataService;
    inventoryService: InventoryService;
    state: IState = new IState();
    constructor(props: any) {
        super(props, "Stok Produk", true);
        this.state.filter.limit = 10;
        this.masterDataService = this.getServices().masterDataService;
        this.inventoryService = this.getServices().inventoryService;
    }

    componentDidMount() {
        this.validateLoginStatus(() => {
            this.loadHealthCenter();
            this.scrollTop();
        });
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

    healthCentersLoaded = (response: any |WebResponse) => {
        this.masterDataService.setHealthCenters(response.entities);
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
        filter.fieldsFilter = {
            name:this.state.productName
        }
        this.commonAjaxWithProgress(
            this.inventoryService.getProductsInHealthCenter,
            this.productLoaded, this.productLoadingError,
            filter, this.state.selectedHealthCenter
        )
    }
    getLocations = () => {
        const allLocObject = new HealthCenter();
        allLocObject.id = 0;
        allLocObject.name = "ALL";
        const locations: HealthCenter[] = [allLocObject];
        const stateLocations: HealthCenter[] = this.state.healthCenters;
        locations.push(...stateLocations);
        return locations;
    }
    updateLocation = (e: ChangeEvent) => {
        const input = e.target as HTMLSelectElement;
        const filter: Filter = this.state.filter;
        if (input.value.toString() == "0") {
            filter.flag = Filter.FLAG_ALL;

        } else {
            filter.flag = Filter.FLAG_DEFAULT;
        }
        const healthCenters: HealthCenter[] = this.getLocations().filter(h => h.id?.toString() == input.value);

        this.showConfirmation("Ubah Lokasi? *muat ulang untuk melihat perubahan").then((ok) => {
            if (!ok) return;
            if (healthCenters.length > 0) {
                this.setState({ filter: filter, selectedHealthCenter: healthCenters[0] });
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
        if (this.getLocations().length == 0) {
            return (
                <div id="ProductStocks" className="container-fluid section-body">
                    <h2>Stok Produk</h2><Spinner />
                </div>
            )
        }
        const ignoreEmptyValue = this.state.filter.ignoreEmptyValue;
        const filterExpDate = this.state.filter.filterExpDate;

        return (
            <div id="ProductStocks" className="container-fluid section-body">
               {this.titleTag()}
                
                <form onSubmit={e => { e.preventDefault(); this.loadProducts(0) }} className="alert alert-info">
                    {greeting()}, <strong>{this.getLoggedUser()?.displayName}</strong><hr/>
                    <LocationSelect updateLocation={this.updateLocation}
                        selectedLocation={this.state.selectedHealthCenter} locations={this.getLocations()} />
                    <FormGroup label="Jumlah Tampilan">
                        <select key="select-displayed-record" onChange={this.updateLimit} value={this.state.filter.limit??5} className="form-control">
                            {this.getDisplayedRecordOptions().map((value, i) => {
                                return <option key={"select-displayed-record-" + i + "-" + value} value={value} >{value}</option>
                            })}
                        </select>
                    </FormGroup>
                    <FormGroup label="Total Stok">
                        <strong >{beautifyNominal(this.state.totalItems)}</strong>
                    </FormGroup>
                    <FormGroup label="Filter">
                            <input className="form-control" placeholder="Name" name="productName" value={this.state.productName}
                             onChange={this.handleInputChange} />
                    </FormGroup>
                    <FormGroup label="Abaikan Stok Kosong">
                        <ToggleButton active={ignoreEmptyValue == true} onClick={this.setIgnoreEmpty} />
                    </FormGroup>
                    {ignoreEmptyValue == false ? null :
                        <ExpDateFilter active={filterExpDate == true}
                            update={this.updateFilterExpDate} toggle={this.setFilterExpDate}
                            expiredWarningDays={this.state.configuration.expiredWarningDays} />}
                    <SubmitBtn />
                </form>
                <p />
                <Card title="Daftar Produk">
                    <NavigationButtons activePage={this.state.filter.page ?? 0} onClick={this.loadProductsAt}
                        limit={this.state.filter.limit ?? 10} totalData={this.state.totalData} />
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
const ExpDateFilter = (props: { update(e: ChangeEvent): any, toggle(val: boolean): any, active: boolean, expiredWarningDays: number }) => {
    const expDateFilterWithin = addDays(new Date(), props.expiredWarningDays);
    return (
        <FormGroup label="Kadaluarsa">
            <div className="row">
                <div className="col-2">
                    <ToggleButton active={props.active == true} onClick={props.toggle} />
                </div>
                {props.active ? <div className="col-10 input-group">
                    <span className="form-control-sm">Dalam ({expDayLabel(props.expiredWarningDays)})</span>
                    <input required type="number" className="form-control-sm" value={props.expiredWarningDays} onChange={props.update} />
                    <span className="form-control-sm">Max Tanggal</span>
                    <input onChange={props.update} required type="date" className="form-control-sm" value={getInputReadableDate(expDateFilterWithin)} />
                </div> : null}
            </div>
        </FormGroup>
    )
}
const expDayLabel = (days: number) => {
    if (days < 0) {
        return Math.abs(days) + " Hari yang lalu";
    }
    return days + " Hari";
}
const SubmitBtn = (props) => {
    return (
        <FormGroup>
            <button type="submit" className="btn btn-success" >
                <i style={{ marginRight: '5px' }} className="fas fa-sync-alt" />Muat Ulang
                        </button>
        </FormGroup>
    )
}
const LocationSelect = (props: { updateLocation(e): any, selectedLocation: HealthCenter, locations: HealthCenter[] }) => {
    return (
        <FormGroup label="Lokasi">
            <select key="select-health-center" onChange={props.updateLocation} value={props.selectedLocation.id??""} className="form-control">

                {props.locations.map((location, i) => {
                    return <option key={"select-location-stock-" + i} value={location.id??""} >{location.name}</option>
                })}
            </select>
        </FormGroup>
    )
}
export default withRouter(connect(
    mapCommonUserStateToProps
)(ProductStocks))