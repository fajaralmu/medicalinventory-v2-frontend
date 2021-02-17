

import React, { ChangeEvent, FormEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseMainMenus from '../../../layout/BaseMainMenus';
import ProductFormV2 from '../../transaction/ProductFormV2';
import Product from '../../../../models/Product';
import Filter from './../../../../models/Filter';
import PeriodFilter from './PeriodFilter';
import Modal from './../../../container/Modal';
import WebRequest from './../../../../models/WebRequest';
import InventoryService from './../../../../services/InventoryService';
import InventoryData from './../../../../models/InventoryData';
import WebResponse from './../../../../models/WebResponse';

class State {
    product?: Product;
    filter: Filter = new Filter();
    inventoriesData:InventoryData[] = [];

}
class ProductUsage extends BaseMainMenus {
    state: State = new State();
    inventoryService:InventoryService;
    constructor(props: any) {
        super(props, "Penggunaan Produk", true);
        const date: Date = new Date();
        this.state.filter.year = this.state.filter.yearTo = date.getFullYear();
        this.state.filter.month = this.state.filter.monthTo = date.getMonth() + 1;
        this.inventoryService = this.getServices().inventoryService;
    }
    setProduct = (p: Product) => {
        this.setState({ product: p });
    }
    updateFilter = (e: ChangeEvent) => {
        const target: any = e.target;
        const name = target.getAttribute("name");
        const value = target.value;
        if (!name || !value) return;
        const filter = this.state.filter;
        filter[name] = parseInt(value);
        this.setState({ filter: filter });
    }
    setFilter = (e: FormEvent) => {
        e.preventDefault();
        if (!this.state.product) {
            this.showError("Please select product");
            return;
        }
        const req:WebRequest = {
            product: this.state.product,
            filter:this.state.filter
        }
        this.commonAjax(
            this.inventoryService.getProductUsage,
            this.usageDataLoaded,
            this.showCommonErrorAlert,
            req
        )
    }
    usageDataLoaded = (response: WebResponse) => {
        this.setState({inventoriesData: response.inventoriesData});
    }
    render() {
        return (
            <div className="section-body container-fluid">
                <h2>Penggunaan Produk</h2>
                <div className="row">
                    <div className="col-md-6">
                        <Modal title="Periode" >
                            <form onSubmit={this.setFilter}>
                                <PeriodFilter fullPeriod filter={this.state.filter} onChange={this.updateFilter} />
                                {this.state.product? <button type="submit" className="btn btn-dark">Apply</button>:
                                <i>Silakan pilih produk</i>}
                            </form>
                        </Modal>
                    </div>
                    <div className="col-md-6">
                        <ProductFormV2 setProduct={this.setProduct} />
                    </div>

                </div>

            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(ProductUsage))