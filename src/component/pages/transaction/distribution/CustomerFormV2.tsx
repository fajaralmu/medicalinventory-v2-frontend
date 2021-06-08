

import React, { ChangeEvent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseComponent from '../../../BaseComponent';
import Customer from '../../../../models/Customer';
import Modal from '../../../container/Modal';
import MasterDataService from '../../../../services/MasterDataService';
import WebResponse from '../../../../models/common/WebResponse';
import FormGroup from '../../../form/FormGroup';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
import Spinner from '../../../loader/Spinner';
interface IState {
    customer?: Customer;
    recordNotFound: boolean;
    recordList?:Customer[];
    loading: boolean;
    customerName: string
}
class CustomerFormV2 extends BaseComponent {
    masterDataService: MasterDataService;
    state: IState = {
        recordNotFound: false, loading: false, customerName: ""
    }
    constructor(props: any) {
        super(props);
        this.masterDataService = this.getServices().masterDataService;

    }
    updateField = (e: ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        const name: string | null = target.getAttribute("name");
        if (null == name) return;
        this.setState({ [name]: target.value }, this.loadRecords);
    }
    startLoading = () => this.setState({ loading: true });
    endLoading = () => this.setState({ loading: false });
    searchRecord = (e) => {
        e.preventDefault();
        e.preventDefault();
        const code: string = this.state.customerName;
        if (code.trim() == "") return;
        this.loadRecords();
    }
    recordsLoaded = (response: WebResponse) => {
        if (!response.entities || !response.entities[0]) {
            throw new Error("Pelanggan tidak ditemukan");
        }
        
        this.setState({ recordList: response.entities , recordNotFound: false });
    }
    setCustomer = (customer:Customer) => {
        this.setState({customer:customer, customerName: customer.name, recordList:undefined});
        if (this.props.setCustomer) {
            this.props.setCustomer(customer);
        }
    }
    recordsNotFound = (e: any) => {
        this.setState({ recordNotFound: true });
    }
    loadRecords = ( ) => {
        if (this.state.loading) return;
        this.commonAjax(this.masterDataService.getRecordsByKeyLike,
            this.recordsLoaded, this.recordsNotFound, 'customer', 'name', this.state.customerName);
    }
    reset = (e: any) => {
        this.setState({ customerName: "" })
    }
    render() {
        const recordList:Customer[] = this.state.recordList??[];
        return (

            <form onSubmit={this.searchRecord} >
                <Modal toggleable={true} title="Pilih Pelanggan" footerContent={
                    <Fragment>
                        <AnchorWithIcon iconClassName="fas fa-list" attributes={{ target: '_blank' }} to="/management/customer" className="btn btn-outline-secondary" />
                        <input type="submit" className="btn btn-secondary" value="Cari" />
                        <input type="reset" onClick={this.reset} className="btn btn-outline-secondary" />
                    </Fragment>
                } >
                    <div className="form-group">
                        <FormGroup label="Nama">
                            <input placeholder="Nama" value={this.state.customerName} onChange={this.updateField} required className="form-control" name="customerName" />
                            {recordList.length > 0?<div style={{position:'absolute', zIndex: 200}} className="container-fluid bg-light rounded-sm border border-dark">
                                {recordList.map(p=>{
                                    return (
                                        <div className="option-item"onClick={()=>{
                                            this.setCustomer(p);
                                        }} style={{cursor: 'pointer'}} key={"CUST-"+p.id} >{p.name}</div>
                                    )
                                })}
                                <a onClick={this.recordsNotFound}><i className="fas fa-times"/>&nbsp;close</a>
                            </div>:null}
                        </FormGroup>
                    </div>
                    <CustomerDetail loading={this.state.loading} customer={this.state.customer} notFound={this.state.recordNotFound} />
                </Modal>
            </form>
        )
    }

}
const CustomerDetail = (props: { loading: boolean, customer: undefined|Customer, notFound: boolean }) => {
    const style = { height: '120px' };
    if (props.loading) {
        return <div style={style}><Spinner /></div>
    }
    if (true == props.notFound) {
        return <div style={style}><div className="alert alert-warning">Pelanggan tidak ditemukan</div></div>
    }
    if (!props.customer) {
        return <div style={style}><div className="alert alert-secondary">Silakan pilih pelanggan</div></div>
    }
    const customer: Customer = props.customer;
    return (
        <div style={style}>
            <h2>{customer.name}</h2>
            <p>{customer.age} tahun</p>
            <address>
                {customer.address}<br />
                {/* <abbr title="Contact">Contact: </abbr>{customer.a} */}
            </address>
        </div>
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps,
)(CustomerFormV2))