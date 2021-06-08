


import React, { ChangeEvent, Component, Fragment } from 'react';
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
interface IState { recordData?: WebResponse, showForm: boolean, filter: Filter, loading: boolean }
class MasterDataList extends BaseComponent {
    masterDataService: MasterDataService;
    state: IState;
    recordToEdit?: {}| undefined= undefined;
    entityProperty: EntityProperty;
    headerProps: HeaderProps[];
    constructor(props: any) {
        super(props, true);
        this.masterDataService = this.getServices().masterDataService;
        this.entityProperty = this.props.entityProperty;
        this.headerProps = EntityProperty.getHeaderLabels(this.props.entityProperty);

        this.state = {
            showForm: false, loading: false,
            filter: Object.assign(new Filter(), { limit: 5, page: 0, fieldsFilter: {} })
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
        this.setState({ recordData: response, filter:response.filter  });
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
    getRecordNumber = (i: number): number => {
        let res = (this.state.filter.page ?? 0) * (this.state.filter.limit ?? 5) + i + 1;
        return res;
    }
    filterFormSubmit = (e) => {
        let page = this.state.filter.useExistingFilterPage ? this.state.filter.page : 0;
        this.loadItems(page);
    }
    filterOnChange = (e: ChangeEvent) => {
        e.preventDefault();
        const filter = this.state.filter;
        Filter.setFieldsFilterValueFromInput(filter, e.target ); 
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
        filter.limit = 5;
        this.setState({ filter: filter });
    }
    orderButtonOnClick = (e) => {
        const filter = this.state.filter;
        Filter.setOrderPropertyFromDataSet(filter,  e.target.dataset);
        this.setState({ filter: filter }, ()=>{ this.loadItems(0) }); 
    }
    showEditForm = (response: WebResponse) => {
        if (!response.entities) {
            return;
        }
        this.recordToEdit = response.entities[0];
        this.setState({ showForm: true });
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
    printRecord = () => {
        this.props.printRecord(this.state.filter);
    }
    render() {
        if (undefined == this.state.recordData) {
            return <Spinner />
        }
        const headerProps: HeaderProps[] = this.headerProps;
        const exactsSearch: boolean = this.state.filter.exacts == true;
        const resultList: any[] = this.state.recordData.entities ? this.state.recordData.entities : [];
        if (headerProps == undefined || resultList == undefined) {
            return <SimpleError />
        }

        if (this.state.showForm == true) {
            return <MasterDataForm recordToEdit={this.recordToEdit} entityProperty={this.entityProperty} onClose={(e) => { this.setState({ showForm: false }) }} />
        }
        const filter = this.state.filter;
        return (
            <div id="MasterDataList">
                <div className="btn-group" style={{ marginBottom: '5px' }}>
                    <AnchorButton show={this.entityProperty.creatable == true && this.entityProperty.editable == true} onClick={this.showCreateForm}
                        iconClassName="fas fa-plus">Add Record</AnchorButton>
                    <AnchorButton onClick={this.printRecord} iconClassName="fas fa-file">Print Record</AnchorButton>
                </div><form onSubmit={(e) => { e.preventDefault() }}>
                    <Modal title="Filter" toggleable={true}>
                        <div>
                            <div className="form-group row">
                                <div className="col-6">
                                    <input value={(filter.page ?? 0) + 1} onChange={(e) => { this.updateFilterPage(e.target.value) }} min="1" className="form-control" type="number" placeholder="go to page" />
                                </div>
                                <div className="col-6">
                                    <input value={filter.limit??5} onChange={(e) => this.updateFilterLimit(e.target.value)} min="1" className="form-control" type="number" placeholder="record per page" />
                                </div>
                                <div className="col-12"><p /></div>
                                <div className="col-3">
                                    <ToggleButton
                                        yesLabel="exact"
                                        noLabel="not exact"
                                        active={exactsSearch}
                                        onClick={(val: boolean) => this.setExactSearch(val)}
                                    />
                                    {/* <div className="btn-group">
                                        <a className={exactsSearch?"btn-sm btn btn-dark":"btn-sm btn btn-outline-dark"} onClick={(e) => this.setExactSearch(true)} >Exact</a>
                                        <a className={!exactsSearch?"btn-sm btn btn-dark":"btn-sm btn btn-outline-dark"} onClick={(e) => this.setExactSearch(false)} >Not Exact</a>
                                    </div> */}
                                </div>
                                <div className="col-3">
                                    <SubmitResetButton onSubmit={this.filterFormSubmit} onReset={this.filterReset} />
                                </div>
                            </div>

                        </div>
                    </Modal>
                    <NavigationButtons limit={filter.limit ?? 5} totalData={this.state.recordData.totalData ?? 0}
                        activePage={filter.page ?? 0} onClick={this.loadItems} />
                    <Modal title="Data List" >
                        {this.state.loading ?
                            <Loading loading={this.state.loading} /> : null}
                        <div className="container-fluid" style={{ overflow: 'scroll' }}>
                            <table className="table" >
                                <DataTableHeader fieldsFilter={filter.fieldsFilter} orderButtonOnClick={this.orderButtonOnClick} filterOnChange={this.filterOnChange} headerProps={headerProps} />
                                <tbody>
                                    {
                                        resultList.map((result, i) => {
                                            const number = this.getRecordNumber(i);
                                            const values: Array<any> = EntityValues.parseValues(result, this.props.entityProperty);
                                            return (<tr key={"tr-result-" + i}>
                                                <td>{number}</td>
                                                {values.map(value => {
                                                    const k = "td-u-" + uniqueId();
                                                    try {
                                                        return (<td key={k} children={value}/>)
                                                    } catch (error) {
                                                        return (<td key={k} children="-"/>)
                                                    }
                                                })}
                                                <td>
                                                    <div className="btn-group">
                                                        <ExternalEditForm record={result} entityProperty={this.entityProperty} />
                                                        <EditDeleteAction showEditForm={this.showEditForm} record={result} entityProperty={this.entityProperty} reload={() => this.loadItems(undefined)} />
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
const Loading = ({ loading }) => {
    return (
        <div style={{ width: '100%', height: '100%', paddingTop: '2rem', backgroundColor: 'rgb(240,240,240,0.5)', marginLeft: '-1rem', marginTop: '-1rem', position: 'absolute' }}>
            <Spinner show={loading} />
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