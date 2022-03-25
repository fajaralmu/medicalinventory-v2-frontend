import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import BaseComponent from './../../BaseComponent';
import MasterDataService from './../../../services/MasterDataService';
import Modal from '../../container/Modal';
import Filter from '../../../models/common/Filter';
import EntityProperty from '../../../models/settings/EntityProperty';
import WebRequest from '../../../models/common/WebRequest';
import WebResponse from '../../../models/common/WebResponse';
import HeaderProps from '../../../models/common/HeaderProps';
import './DataTable.css'
import EntityValues from './../../../utils/EntityValues';
import NavigationButtons from './../../navigation/NavigationButtons';
import MasterDataForm from './form/MasterDataForm';
import AnchorButton from '../../navigation/AnchorButton';
import EditDeleteAction from './EditDeleteAction';
import DataTableHeader from './DataTableHeader';
import SimpleError from './../../alert/SimpleError';
import Spinner from './../../loader/Spinner';
import ExternalEditForm from './ExternalEditForm';
import { uniqueId } from './../../../utils/StringUtil';
import ToggleButton from '../../navigation/ToggleButton';
import { resolve } from 'inversify-react';
interface IState { recordData?: WebResponse, showForm: boolean, filter: Filter, loading: boolean }
const DEFAULT_LIMIT = 5;
class MasterDataList extends BaseComponent {
    @resolve(MasterDataService)
    private masterDataService: MasterDataService;

    state: IState;
    recordToEdit?: {} | undefined = undefined;
    entityProperty: EntityProperty;
    headerProps: HeaderProps[];
    
    constructor(props: any) {
        super(props, true);
        this.entityProperty = this.props.entityProperty;
        this.headerProps = EntityProperty.getHeaderLabels(this.props.entityProperty);

        this.state = {
            showForm: false, loading: false,
            filter: Object.assign(new Filter(), { limit: DEFAULT_LIMIT, page: 0, fieldsFilter: {} })
        };
    }
    loadItems = (page: number | undefined) => {
        const filter = Object.assign(new Filter(), this.state.filter);

        const entityName = this.entityProperty.entityName;
        filter.page = page ?? filter.page ?? 0;
        Filter.validateFieldsFilter(filter);
        const request: WebRequest = Object.assign(new WebRequest(), {
            entity: entityName,
            filter: filter
        });
        this.commonAjax(
            this.masterDataService.loadItems,
            this.itemsLoaded,
            this.showCommonErrorAlert,
            request
        );

    }
    itemsLoaded = (response: WebResponse) => {
        this.setState({ recordData: response, filter: response.filter });
    }
    checkDefaultData = () => {
        if (this.state.loading) {
            return;
        }
        if (this.entityProperty.entityName == this.props.entityProperty.entityName && this.state.recordData != undefined) {
            return;
        }
        this.entityProperty = this.props.entityProperty;
        this.headerProps = EntityProperty.getHeaderLabels(this.props.entityProperty);
        this.loadItems(0);
    }
    startLoading() { this.setState({ loading: true }) }
    endLoading() { this.setState({ loading: false }) }
    componentDidUpdate() {
        this.validateLoginStatus();
        this.checkDefaultData();
    }
    componentDidMount() {
        this.checkDefaultData();
    }
    getRecordNumberingOrder = (i: number): number => {
        let res = (this.state.filter.page ?? 0) * (this.state.filter.limit ?? DEFAULT_LIMIT) + i + 1;
        return res;
    }
    filterFormSubmit = (e) => {
        let page = this.state.filter.useExistingFilterPage ? this.state.filter.page : 0;
        this.loadItems(page);
    }
    filterOnChange = (e: ChangeEvent) => {
        e.preventDefault();
        const filter = this.state.filter;
        Filter.setFieldsFilterValueFromInput(filter, e.target);
        this.setState({ filter: filter });
    }
    setExactSearch = (exacts: boolean) => {
        const filter = this.state.filter;
        filter.exacts = exacts;
        this.setState({ filter: filter });
    }
    filterReset = (e) => {
        const filter = this.state.filter;
        filter.fieldsFilter = {};
        filter.limit = DEFAULT_LIMIT;
        this.setState({ filter: filter });
    }
    orderButtonOnClick = (e) => {
        const filter = this.state.filter;
        Filter.setOrderPropertyFromDataSet(filter, e.target.dataset);
        this.setState({ filter: filter }, () => { this.loadItems(0) });
    }
    showEditForm = (response: WebResponse) => {
        if (!response.entities) {
            return;
        }
        this.recordToEdit = response.entities[0];
        this.setState({ showForm: true }, this.scrollTop);
    }
    showCreateForm = (e) => {
        this.recordToEdit = undefined;
        this.setState({ showForm: true });
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
    printRecord = () => this.props.printRecord(this.state.filter)
    hideForm = (e) => this.setState({ showForm: false })

    render() {
        if (undefined == this.state.recordData) {
            return <Spinner />
        }
        const entityProp = this.entityProperty;
        const headerProps: HeaderProps[] = this.headerProps;
        const exactsSearch: boolean = this.state.filter.exacts == true;
        const items: any[] = this.state.recordData.entities ? this.state.recordData.entities : [];
        if (headerProps == undefined || items == undefined) {
            return <SimpleError />
        }

        if (this.state.showForm == true) {
            return <MasterDataForm recordToEdit={this.recordToEdit} entityProperty={entityProp}
                recordSavedCallback={this.loadItems}
                onClose={this.hideForm} />
        }
        const filter = this.state.filter;
        const showAddBtn = entityProp.creatable == true && entityProp.editable == true;
        const activePage :number = (filter.page ?? 0);
        const limit: number = filter.limit??DEFAULT_LIMIT;
        return (
            <div id="MasterDataList">
                <div className="btn-group" style={{ marginBottom: '5px' }}>
                    <AnchorButton onClick={this.showCreateForm} iconClassName="fas fa-plus" children="Add Record" show={showAddBtn} />
                    <AnchorButton onClick={this.printRecord} iconClassName="fas fa-file" children="Print Record" />
                </div>
                <form onSubmit={(e) => { e.preventDefault() }}>
                    <Modal title="Filter" toggleable={true}>
                        <div className="form-group row">
                            <LimitOffsetField value={activePage+1} onChange={this.updateFilterPage} placeholder="go to page" />
                            <LimitOffsetField value={limit} onChange={this.updateFilterLimit} placeholder="record per page" />
                            
                            <div className="col-12"><p /></div>
                            <div className="col-3">
                                <ToggleButton active={exactsSearch}yesLabel="exact"noLabel="not exact"onClick={this.setExactSearch} />
                            </div>
                            <div className="col-3">
                                <SubmitResetButton onSubmit={this.filterFormSubmit} onReset={this.filterReset} />
                            </div>
                        </div>
                    </Modal>
                    <NavigationButtons limit={limit} totalData={this.state.recordData.totalData ?? 0}
                        activePage={activePage} onClick={this.loadItems} />
                    <Modal title="Data List" >
                        <Loading loading={this.state.loading} />
                        <div className="container-fluid" style={{ overflow: 'scroll' }}>
                            <table className="table" >
                                <DataTableHeader fieldsFilter={filter.fieldsFilter} orderButtonOnClick={this.orderButtonOnClick} filterOnChange={this.filterOnChange} headerProps={headerProps} />
                                <tbody>
                                    {
                                        items.map((result, i) => {
                                            const number = this.getRecordNumberingOrder(i);
                                            const values: Array<any> = EntityValues.parseValues(result, entityProp);
                                            return (<tr key={"trresult-" + i}>
                                                <td>{number}</td>
                                                {values.map(value =>  
                                                    <td key={"tdu-" + uniqueId()} children={value} />
                                                )}
                                                <td>
                                                    <div className="btn-group">
                                                        <ExternalEditForm record={result} entityProperty={entityProp} />
                                                        <EditDeleteAction showEditForm={this.showEditForm} record={result} entityProperty={entityProp} reload={this.loadItems} />
                                                    </div>
                                                </td>
                                            </tr>)
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </Modal>
                </form>
            </div >
        )
    }
}
const LimitOffsetField = (props:{value:number, onChange:(val)=>any, placeholder:string}) => {
    return (
        <div className="col-6">
            <input value={props.value} onChange={(e) => { props.onChange(e.target.value) }} min="1" className="form-control" type="number" placeholder={props.placeholder} />
        </div>
    )
}
const Loading = (props:{ loading:boolean }) => {
    if (props.loading != true) return null;
    return (
        <div style={{ width: '100%', height: '100%', paddingTop: '2rem', backgroundColor: 'rgb(240,240,240,0.5)', marginLeft: '-1rem', marginTop: '-1rem', position: 'absolute' }}>
            <Spinner show={props.loading} />
        </div>
    )
}
const SubmitResetButton = (props: any) => {
    return (<div className="btn-group">
        <button onClick={props.onSubmit} className="btn btn-dark btn-sm"><span className="icon"><i className="fas fa-play-circle" /></span>Apply Filter</button>
        <button onClick={props.onReset} type="reset" className="btn btn-dark btn-sm"><span className="icon"><i className="fas fa-sync-alt" /></span>Reset</button>
    </div>)
}

export default withRouter(connect(
    mapCommonUserStateToProps,
)(MasterDataList))