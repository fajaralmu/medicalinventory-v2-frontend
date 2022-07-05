

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
    filter: Filter;
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
        const date: Date = new Date();
        this.state.filter.year = this.state.filter.yearTo = date.getFullYear();
        this.state.filter.month = this.state.filter.monthTo = date.getMonth() + 1;
        this.state.filter.day = this.state.filter.dayTo = 1;
        this.state.filter.limit = 10;
        this.state.filter.fieldsFilter['name'] = "";
    }

    updateFilter = (e: ChangeEvent) => {
        const target: any = e.target;
        const name = target.getAttribute("name"), value = target.value;
        if (!name || !value) return;
        const filter = this.state.filter;
        filter[name] = parseInt(value);
        this.setState({ filter: filter });
    }
    setFilter = (e: FormEvent) => {
        e.preventDefault();
        this.loadRecords();
    }
    loadRecordsAtPage = (page: number) => {
        const filter = this.state.filter;
        filter.page = page;
        this.setState({ filter: filter }, this.loadRecords);
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
        const filter = this.state.filter;
        filter.fieldsFilter[target.name] = target.value;
        this.setState({ filter: filter });
    }

    render() {
        const products: Product[] | undefined = this.state.recordList;
        return (
            <div className="section-body container-fluid">
                {this.titleTag()}
                <Modal title="Periode" >
                    <form onSubmit={this.setFilter}>
                        <PeriodFilter withDay fullPeriod filter={this.state.filter} onChange={this.updateFilter} />
                        <FormGroup label="Limit" >
                            <input value={this.state.filter.limit ?? 5} type="number" min={1}
                                name="limit" className="form-control" onChange={this.updateFilter}
                            />
                        </FormGroup>
                        <FormGroup label="Search by name">
                            <input value={this.state.filter.fieldsFilter['name'] ?? ""} onChange={this.updateFieldsFilter} name="name" className="form-control" />
                        </FormGroup>
                        <button type="submit" className="btn btn-dark">Apply</button>
                    </form>
                </Modal>
                <NavigationButtons
                    activePage={this.state.filter.page ?? 0}
                    limit={this.state.filter.limit ?? 10}
                    totalData={this.state.totalData}
                    onClick={this.loadRecordsAtPage} />

                {products ?
                    <ProductList products={products} startNumber={(this.state.filter.page ?? 0) * (this.state.filter.limit ?? 10)} /> :
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
)(ProductStat))