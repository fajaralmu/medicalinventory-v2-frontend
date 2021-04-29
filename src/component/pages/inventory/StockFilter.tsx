

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BasePage from '../../BasePage';
import { greeting } from '../../../utils/StringUtil';
import MasterDataService from './../../../services/MasterDataService';
import WebResponse from './../../../models/common/WebResponse';
import EntityProperty from './../../../models/settings/EntityProperty';
import SimpleError from './../../alert/SimpleError';
import AnchorButton from './../../navigation/AnchorButton';
import Filter from './../../../models/common/Filter';
import DataTableHeader from './../masterdata/DataTableHeader';
import HeaderProps from './../../../models/common/HeaderProps';
import Spinner from './../../loader/Spinner';
import Modal from './../../container/Modal';
import InventoryService from './../../../services/InventoryService';
import EntityElement from './../../../models/settings/EntityElement';
import ProductFlow from './../../../models/ProductFlow';
import NavigationButtons from './../../navigation/NavigationButtons';
import Configuration from './../../../models/Configuration';
const DEFAULT_LIMIT:number = 20;
class State {
    entityProperty: EntityProperty | undefined;
    entityPropertyNotLoaded: boolean = false;
    filter: Filter = new Filter();
    items:ProductFlow[] = [];
    inventoryConfig:Configuration = new Configuration();
    totalData:number = 0;
}
class StockFilter extends BasePage {
    state: State = new State();
    masterDataService: MasterDataService;
    inventoryService: InventoryService;
    headerProps: HeaderProps[] = [];
    constructor(props: any) {
        super(props, "Inventory", true);
        this.masterDataService = this.getServices().masterDataService;
        this.inventoryService = this.getServices().inventoryService;
        this.state.filter.limit = DEFAULT_LIMIT;
    }

    entityPropertyLoaded = (response: WebResponse) => {
        if (!response.entityProperty) {
            throw new Error("Invalid property!");
        }
        const prop =  this.adjustProperty(response.entityProperty);
        this.setState({ entityProperty: prop, entityPropertyNotLoaded: false },
            ()=>{ this.loadItems(0)});
    }
    adjustProperty = (entityProperty: EntityProperty): EntityProperty => {
        const prop: EntityProperty = Object.assign(new EntityProperty(), entityProperty);
        prop.keepProperties(
            "id", "product", "stock", "expiredDate"
            //  "count", "usedCount"
        );
        const el: EntityElement = new EntityElement();
        el.id = 'location';
        el.labelName = 'Location';
        el.orderable = false;
        prop.addElement(el);
        prop.setOrder("product", "stock", "expiredDate", "location", "id");
        return prop;
    }
    entityPropertyNotLoaded = (e: any) => {
        this.setState({ entityProperty: undefined, entityPropertyNotLoaded: true });
    }
    loadEntityProperty = () => {
        this.commonAjax(
            this.masterDataService.loadEntityProperty,
            this.entityPropertyLoaded,
            this.entityPropertyNotLoaded,
            'productflow'
        )
    }
    loadItems = (page: number | undefined) => {
        const filter = Object.assign(new Filter(), this.state.filter);
        filter.page = page ?? filter.page;
        Filter.validateFieldsFilter(filter);
        this.commonAjax(
            this.inventoryService.filterStocks,
            this.itemsLoaded,
            this.showCommonErrorAlert,
            filter
        );

    }
    itemsLoaded = (response: WebResponse) => {
        this.setState({
            items:response.entities, totalData:response.totalData,
            filter:response.filter, config:response.configuration
        })
    }

    componentDidMount() {
        this.validateLoginStatus(() => {
            this.scrollTop();
            this.loadEntityProperty();
        });
    }
    filterOnChange = (e: ChangeEvent) => {
        e.preventDefault();
        const filter = this.state.filter;
        Filter.setFieldsFilterValueFromInput(filter, e.target ); 
        this.setState({ filter: filter });
    }
    orderButtonOnClick = (e) => {
        const filter = this.state.filter;
        Filter.setOrderPropertyFromDataSet(filter,  e.target.dataset);
        this.setState({ filter: filter }, () => {this.loadItems(0);});
    }
    getHeaderProps = (): HeaderProps[] => {
        if (!this.state.entityProperty) {
            this.showCommonErrorAlert("Invalid Entity Property");
            return [];
        }
        if (this.headerProps.length > 0) {
            return this.headerProps;
        }
        this.headerProps = HeaderProps.fromEntityProperty(this.state.entityProperty);
        return this.headerProps;
    }
    updateFilterPage = (page: any) => {
        const filter = this.state.filter;
        filter.useExistingFilterPage = true;
        filter.page = parseInt(page) - 1;
        this.setState({ filter: filter });
    }
    updateFilterLimit = (limit: any) => {
        const filter = this.state.filter;
        filter.limit = parseInt(limit);
        this.setState({ filter: filter });
    }
    filterReset = (e) => {
        const filter = this.state.filter;
        filter.fieldsFilter = {};
        filter.limit = DEFAULT_LIMIT;
        this.setState({ filter: filter });
    }
    filterFormSubmit = (e) => {
        let page = this.state.filter.useExistingFilterPage ? this.state.filter.page : 0;
        this.loadItems(page);
    }
    bgClass = (item:ProductFlow) :string=> {
        if (!item.expiredDate) return "";
        const expDate:Date = new Date(item.expiredDate);
        const now = new Date();
        if (expDate <= now) {
            return "bg-danger";
        }
        const config = this.state.inventoryConfig;
        const secondsOneDay = (1000*24*60*60)
        if ((expDate.getTime() - now.getTime())/secondsOneDay <= config.expiredWarningDays) {
            return "bg-warning";
        }
        return "";
    }

    render() {
        if (this.state.entityPropertyNotLoaded) {
            return (
                <div className="container-fluid section-body">
                    <SimpleError>
                        <h3>Config Not Loaded</h3>
                        <AnchorButton onClick={this.loadEntityProperty}>
                            Reload Config
                        </AnchorButton>
                    </SimpleError>
                </div>
            )
        }
        if (!this.state.entityProperty) {
            return <div className="container-fluid section-body"><Spinner /></div>
        }
        const filter = this.state.filter;
        const items = this.state.items;
        return (
            <div className="container-fluid section-body">
                <h2>Filter Persediaan</h2>
                <div className="alert alert-info">
                    {greeting()}, <strong>{this.getLoggedUser()?.displayName}</strong><hr />
                </div>
                <form onSubmit={(e) => { e.preventDefault() }}>
                    <Modal title="Filter" toggleable={true}>
                        <div>
                            <div className="form-group row">
                                <div className="col-6">
                                    <input value={(filter.page ?? 0) + 1} onChange={(e) => { this.updateFilterPage(e.target.value) }} min="1" className="form-control" type="number" placeholder="go to page" />
                                </div>
                                <div className="col-6">
                                    <input value={filter.limit} onChange={(e) => this.updateFilterLimit(e.target.value)} min="1" className="form-control" type="number" placeholder="record per page" />
                                </div>
                                <div className="col-12"><p /></div>
                                <div className="col-3">
                                    <SubmitResetButton onSubmit={this.filterFormSubmit} onReset={this.filterReset} />
                                </div>
                            </div>

                        </div>
                    </Modal>
                    <NavigationButtons limit={filter.limit ?? DEFAULT_LIMIT} totalData={this.state.totalData ?? 0}
                        activePage={filter.page ?? 0} onClick={this.loadItems} />
                    <div className="container-fluid" style={{ overflow: 'scroll' }}>
                        <table className="table" >
                            <DataTableHeader headerProps={this.getHeaderProps()}
                                fieldsFilter={filter.fieldsFilter}
                                filterOnChange={this.filterOnChange}
                                orderButtonOnClick={this.orderButtonOnClick}
                                
                            />
                            <tbody>
                                {items.map((item, i)=>{
                                        const location = item.transaction?.type == 'TRANS_IN' ? item.transaction?.healthCenterLocation?.name :item.transaction?.healthCenterDestination?.name;
                                        return (
                                            <tr key={"stock-item-"+item.id} className={this.bgClass(item)}>
                                                <td>{i+1+(filter.page??0)*(filter.limit??DEFAULT_LIMIT) }</td>
                                                <td children={item.product?.name}/><td children={item.stock}/>
                                                <td>
                                                    {item.expiredDate?new Date(item.expiredDate).toLocaleDateString("ID"):"-"}
                                                </td>
                                                <td children={location}/>
                                                <td children={item.id} />
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                    </div>
                </form>
            </div>
        )
    }
}

const SubmitResetButton = (props: any) => {
    return (<div className="btn-group">
        <button onClick={props.onSubmit} className="btn btn-dark btn-sm"><span className="icon"><i className="fas fa-play-circle" /></span>Apply Filter</button>
        <button onClick={props.onReset} type="reset" className="btn btn-dark btn-sm"><span className="icon"><i className="fas fa-sync-alt" /></span>Reset</button>
    </div>)
}


export default withRouter(connect(
    mapCommonUserStateToProps
)(StockFilter))