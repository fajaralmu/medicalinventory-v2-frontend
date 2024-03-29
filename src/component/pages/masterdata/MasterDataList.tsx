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

interface State { recordData?: WebResponse, showForm: boolean, filter, loading: boolean }

const DEFAULT_LIMIT = 10;
class MasterDataList extends BaseComponent<any, State> {
  @resolve(MasterDataService)
  private masterDataService: MasterDataService;

  private recordToEdit?: {};
  private entityProperty: EntityProperty;
  private headerProps: HeaderProps[];

  constructor(props: any) {
    super(props);
    this.entityProperty = this.props.entityProperty;
    this.headerProps = EntityProperty.getHeaderLabels(this.props.entityProperty);

    this.state = {
      showForm: false,
      loading: false,
      filter: Object.assign(new Filter(), { limit: DEFAULT_LIMIT, page: 0, fieldsFilter: {} })
    };
  }
  loadItems = (page?: number) => {
    const filter = Object.assign(new Filter(), this.state.filter);

    const entityName = this.entityProperty.entityName;
    filter.page = page ?? filter.page ?? 0;
    Filter.validateFieldsFilter(filter);
    const request: WebRequest = Object.assign(new WebRequest(), {
      entity: entityName,
      filter
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
    if (this.entityProperty.entityName === this.props.entityProperty.entityName && this.state.recordData != undefined) {
      return;
    }
    this.entityProperty = this.props.entityProperty;
    this.headerProps = EntityProperty.getHeaderLabels(this.props.entityProperty);
    this.loadItems(0);
  }
  startLoading() { this.setState({ loading: true }) }
  endLoading() { this.setState({ loading: false }) }
  componentDidUpdate() {
    this.checkDefaultData();
  }
  componentDidMount() {
    this.checkDefaultData();
  }
  getRecordNumberingOrder = (i: number): number => {
    const { page, limit } = this.state.filter;
    const res = (page ?? 0) * (limit ?? DEFAULT_LIMIT) + i + 1;
    return res;
  }
  filterFormSubmit = (e) => {
    const page = this.state.filter.useExistingFilterPage ? this.state.filter.page : 0;
    this.loadItems(page);
  }
  filterOnChange = (e: ChangeEvent) => {
    e.preventDefault();
    const { filter } = this.state;
    Filter.setFieldsFilterValueFromInput(filter, e.target);
    this.setState({ filter });
  }
  setExactSearch = (exacts: boolean) => {
    const { filter } = this.state;
    filter.exacts = exacts;
    this.setState({ filter });
  }
  filterReset = (e) => {
    const { filter } = this.state;
    filter.fieldsFilter = {};
    filter.limit = DEFAULT_LIMIT;
    this.setState({ filter });
  }
  orderButtonOnClick = (e) => {
    const { filter } = this.state;
    Filter.setOrderPropertyFromDataSet(filter, e.target.dataset);
    this.setState({ filter }, () => { this.loadItems(0) });
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
    const { filter } = this.state;
    filter.useExistingFilterPage = true;
    filter.page = parseInt(page) - 1;
    this.setState({ filter });
  }
  updateFilterLimit = (limit: any) => {
    const { filter } = this.state;
    filter.limit = parseInt(limit);
    this.setState({ filter });
  }
  printRecord = () => this.props.printRecord(this.state.filter)
  hideForm = (e) => this.setState({ showForm: false })

  render() {
    if (undefined === this.state.recordData) {
      return <Spinner />;
    }
    const entityProp = this.entityProperty;
    const headerProps = this.headerProps;
    const exactsSearch = this.state.filter.exacts === true;
    const items = this.state.recordData.entities ? this.state.recordData.entities : [];

    if (!headerProps || !items) {
      return <SimpleError />;
    }

    if (this.state.showForm === true) {
      return (
        <MasterDataForm
          recordToEdit={this.recordToEdit}
          entityProperty={entityProp}
          recordSavedCallback={this.loadItems}
          onClose={this.hideForm}
        />
      );
    }
    const { filter } = this.state;
    const showAddBtn = entityProp.creatable === true && entityProp.editable === true;
    const activePage = (filter.page ?? 0);
    const limit = filter.limit ?? DEFAULT_LIMIT;
    return (
      <div id="MasterDataList">
        <div className="btn-group mb-2">
          <AnchorButton
            onClick={this.showCreateForm}
            iconClassName="fas fa-plus"
            children="Add Record"
            show={showAddBtn}
          />
          <AnchorButton
            onClick={this.printRecord}
            iconClassName="fas fa-file"
            children="Print Record"
          />
        </div>
        <form onSubmit={(e) => { e.preventDefault() }}>
          <Modal title="Filter" toggleable={true}>
            <div className="form-group row">
              <LimitOffsetField
                value={activePage + 1}
                onChange={this.updateFilterPage}
                placeholder="go to page"
              />
              <LimitOffsetField
                value={limit}
                onChange={this.updateFilterLimit}
                placeholder="record per page"
              />
              <div className="col-12"><p /></div>
              <div className="col-3">
                <ToggleButton
                  active={exactsSearch}
                  yesLabel="exact"
                  noLabel="not exact"
                  onClick={this.setExactSearch}
                />
              </div>
              <div className="col-3">
                <SubmitResetButton onSubmit={this.filterFormSubmit} onReset={this.filterReset} />
              </div>
            </div>
          </Modal>
          <NavigationButtons
            limit={limit}
            totalData={this.state.recordData.totalData ?? 0}
            activePage={activePage}
            onClick={this.loadItems}
          />
          <Modal title="Data List">
            <Loading loading={this.state.loading} />
            <div className="container-fluid" style={{ overflow: 'scroll' }}>
              <table className="table" >
                <DataTableHeader
                  headerProps={headerProps}
                  fieldsFilter={filter.fieldsFilter}
                  orderButtonOnClick={this.orderButtonOnClick}
                  filterOnChange={this.filterOnChange}
                />
                <tbody>
                  {
                    items.map((result, i) => {
                      const number = this.getRecordNumberingOrder(i);
                      const values = EntityValues.parseValues(result, entityProp);
                      return (
                        <tr key={`trresult-${i}`}>
                          <td>{number}</td>
                          {values.map(value =>
                            <td key={`tdu-${uniqueId()}`} children={value} />
                          )}
                          <td>
                            <div className="btn-group">
                              <ExternalEditForm record={result} entityProperty={entityProp} />
                              <EditDeleteAction
                                showEditForm={this.showEditForm}
                                entityProperty={entityProp}
                                record={result}
                                reload={this.loadItems}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </Modal>
        </form>
      </div>
    );
  }
}
const LimitOffsetField = (props: { value: number, onChange: (val) => any, placeholder: string }) => {
  return (
    <div className="col-6">
      <input
        type="number"
        value={props.value}
        className="form-control"
        placeholder={props.placeholder}
        onChange={(e) => { props.onChange(e.target.value) }}
        min="1"
      />
    </div>
  );
}
const Loading = (props: { loading: boolean }) => {
  if (props.loading != true) return null;
  return (
    <div
      className="w-100 pt-5 bg-light"
      style={{
        height: '100%',
        opacity: 0.5,
        position: 'absolute',
        zIndex: 100,
      }}>
      <Spinner show={props.loading} />
    </div>
  );
}
const SubmitResetButton = (props: any) => {
  return (
    <div className="btn-group">
      <button onClick={props.onSubmit} className="btn btn-light btn-sm border">
        <i className="fas fa-play-circle mr-2" />
        <span>Apply Filter</span>
      </button>
      <button onClick={props.onReset} type="reset" className="btn btn-light btn-sm border">
        <i className="fas fa-sync-alt mr-2" />
        <span>Reset</span>
      </button>
    </div>
  );
}

export default withRouter(connect(
  mapCommonUserStateToProps,
)(MasterDataList));
