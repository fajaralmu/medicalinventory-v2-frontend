

import React, { ChangeEvent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseComponent from '../../../BaseComponent';
import Supplier from '../../../../models/Supplier';
import Modal from '../../../container/Modal';
import MasterDataService from '../../../../services/MasterDataService';
import WebResponse from '../../../../models/common/WebResponse';
import FormGroup from '../../../form/FormGroup';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
import Spinner from '../../../loader/Spinner';
import { resolve } from 'inversify-react';
interface State {
  recordList?: Supplier[];
  supplier?: Supplier;
  recordNotFound: boolean;
  loading: boolean;
  supplierName: string
}
class SupplierFormV2 extends BaseComponent<any, State> {
  @resolve(MasterDataService)
  private masterDataService: MasterDataService;
  constructor(props) {
    super(props);
    this.state = {
      recordNotFound: false, loading: false, supplierName: ''
    }
  }
  startLoading = () => this.setState({ loading: true });
  endLoading = () => this.setState({ loading: false });
  searchRecord = (e) => {
    e.preventDefault();
    const code: string = this.state.supplierName;
    if (code.trim() == "") return;
    this.loadRecords();
  }
  recordsLoaded = (response: WebResponse) => {
    console.debug("response: ", response);
    if (!response.entities || !response.entities[0]) {
      throw new Error("Pemasok tidak ditemukan");
    }

    this.setState({ recordList: response.entities, recordNotFound: false });
  }
  setSupplier = (supplier: Supplier) => {
    this.setState({ supplierName: supplier.name ?? '', supplier: supplier, recordList: undefined, recordNotFound: false });
    if (this.props.setSupplier) {
      this.props.setSupplier(supplier);
    }
  }
  recordsNotFound = (e: any) => {
    this.setState({ recordNotFound: true, supplier: undefined, recordList: undefined });
  }
  loadRecords = () => {
    if (this.state.loading) return;
    if (!this.state.supplierName || this.state.supplierName.trim() === '') {
      this.setState({ recordList: [] });
      return;
    }
    this.commonAjax(this.masterDataService.getRecordsByKeyLike,
      this.recordsLoaded, this.recordsNotFound, 'supplier', 'name', this.state.supplierName);
  }
  reset = (e: any) => {
    this.setState({ supplierName: "" })
  }
  onChange = (event: React.ChangeEvent<Element>) => {
    this.handleInputChange(event, this.loadRecords);
  }
  render() {
    const recordList: Supplier[] = this.state.recordList ?? [];
    return (

      <form onSubmit={this.searchRecord} >
        <Modal toggleable={true} title="Pilih Pemasok" footerContent={
          <Fragment>
            <AnchorWithIcon iconClassName="fas fa-list" attributes={{ target: '_blank' }} to="/management/supplier" className="btn btn-outline-secondary" />
            <input type="submit" className="btn btn-secondary" value="Search" />
            <input type="reset" onClick={this.reset} className="btn btn-outline-secondary" />
          </Fragment>
        } >
          <div className="form-group">
            <FormGroup label="Nama">
              <input placeholder="Nama Pemasok" required className="form-control"
                onChange={this.onChange} value={this.state.supplierName ?? ""} name="supplierName" />
              {recordList.length > 0 ? <div style={{ position: 'absolute', zIndex: 200 }} className="container-fluid bg-light rounded-sm border border-dark">
                {recordList.map(p => {
                  return (
                    <div className="option-item" onClick={() => {
                      this.setSupplier(p);
                    }} style={{ cursor: 'pointer' }} key={"p-" + p.code + p.id} >{p.name}</div>
                  )
                })}
                <a onClick={this.recordsNotFound}><i className="fas fa-times" />&nbsp;close</a>
              </div> : null}
            </FormGroup>
          </div>
          <SupplierDetail loading={this.state.loading} supplier={this.state.supplier} notFound={this.state.recordNotFound} />
        </Modal>
      </form>
    )
  }

}
const SupplierDetail = (props: { loading: boolean, supplier: undefined | Supplier, notFound: boolean }) => {
  const style = { height: '120px' };
  if (props.loading) {
    return <div style={style}><Spinner /></div>
  }
  if (true == props.notFound) {
    return <div style={style}><div className="alert alert-warning">Pemasok tidak ditemukan</div></div>
  }
  if (!props.supplier) {
    return <div style={style}><div className="alert alert-secondary">Silakan pilih pemasok</div></div>
  }
  const supplier: Supplier = props.supplier;
  return (
    <div style={style}>
      <h2>{supplier.name}</h2>
      <p>Kode: {supplier.code}</p>
      <address>
        {supplier.address}<br />
        <abbr title="Contact">Kontak: </abbr>{supplier.contact}
      </address>
    </div>
  )
}
const mapDispatchToProps = (dispatch: Function) => ({
})


export default withRouter(connect(
  mapCommonUserStateToProps,
  mapDispatchToProps
)(SupplierFormV2))