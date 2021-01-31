

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseComponent from './../../BaseComponent';
import MasterDataService from './../../../services/MasterDataService';
import Filter from './../../../models/Filter';
import HealthCenter from './../../../models/HealthCenter';
import ProductStock from './../../../models/ProductStock';
import WebResponse from './../../../models/WebResponse';
import InventoryService from './../../../services/InventoryService';
import FormGroup from '../../form/FormGroup';
import Spinner from '../../loader/Spinner';
import Card from '../../container/Card';
import { tableHeader } from './../../../utils/CollectionUtil';
import ProductStocksTable from './ProductStocksTable';
import NavigationButtons from '../../navigation/NavigationButtons';
class IState {
    productStocks: ProductStock[] = new Array();
    loading: boolean = false;
    filter: Filter = new Filter();
    totalData: number = 0;
    healthCenters: HealthCenter[] = [];
    selectedHealthCenter: HealthCenter = new HealthCenter()
}

class ProductStocks extends BaseComponent {
    masterDataService: MasterDataService;
    inventoryService: InventoryService;
    state: IState = new IState();
    constructor(props: any) {
        super(props, true);
        this.masterDataService = this.getServices().masterDataService;
        this.inventoryService = this.getServices().inventoryService;
    }

    componentDidMount() {
        this.loadHealthCenter();
    }

    healthCentersLoaded = (response: WebResponse) => {
        if (!response.entities) { return; }
        this.masterDataService.setHealthCenters(response.entities ?? []);
        this.setState({  healthCenters: response.entities, selectedHealthCenter: response.entities[0] });
        this.loadProducts();
    }

    productLoaded = (response: WebResponse) => {
        this.setState({totalData: response.totalData, productStocks: response.generalList });
    }

    loadProductsAt = (page:number) => {
        const filter = this.state.filter;
        filter.page = page;
        this.setState({filter: filter});
        this.loadProducts();
    }
    loadProducts = () => {
        this.commonAjaxWithProgress(
            this.inventoryService.getProductsInHealthCenter,
            this.productLoaded, this.showCommonErrorAlert,
            this.state.filter, this.state.selectedHealthCenter
        )
    }
    updateSelectedHealthCenter = (e: ChangeEvent) => {
        const input = e.target as HTMLSelectElement;
        const healthCenters: HealthCenter[] = this.state.healthCenters.filter(h => h.id?.toString() == input.value);
        
        this.showConfirmation("Change Location?").then((ok) => {
            if (!ok) return; 
            if (healthCenters.length > 0) {
                this.setState({  selectedHealthCenter: healthCenters[0] });
                console.debug("selectedHealthCenter: ", this.state.selectedHealthCenter);
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

    render() {
        if (this.state.healthCenters.length == 0) {
            return (
                <div id="ProductStocks" className="container-fluid">
                    <h2>Product Stocks</h2><Spinner />
                </div>
            )
        }
        return (
            <div id="ProductStocks" className="container-fluid">
                <h2>Product Stocks</h2>
                <form onSubmit={e=>{e.preventDefault(); this.loadProducts()}} className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.displayName}</strong>
                    <FormGroup label="Location">
                        <select key="select-health-center" onChange={this.updateSelectedHealthCenter} value={this.state.selectedHealthCenter.id} className="form-control">
                            {this.state.healthCenters.map((healthCenter,i)=>{

                                return <option key={"select-location-stock-"+i}value={healthCenter.id} >{healthCenter.name}</option>
                            })}
                        </select>
                    </FormGroup>
                    <FormGroup>
                        <input type="submit" className="btn btn-success" />
                    </FormGroup>
                </form>
                <p/>
                <Card title="Product List">
                    <NavigationButtons
                        activePage={this.state.filter.page??0}
                        limit={this.state.filter.limit??5} totalData={this.state.totalData}
                        onClick={this.loadProductsAt} />
                   <ProductStocksTable productStocks = {this.state.productStocks} />
                </Card>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(ProductStocks))