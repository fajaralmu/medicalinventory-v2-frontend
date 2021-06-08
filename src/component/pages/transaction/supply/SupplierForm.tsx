

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
interface IState {
    supplier?: Supplier;
    supplierNotFound: boolean;
    loading: boolean;
    code: string
}
class SupplierForm extends BaseComponent {
    masterDataService: MasterDataService;
    state: IState = {
        supplierNotFound: false, loading: false, code: ''
    }
    constructor(props: any) {
        super(props);
        this.masterDataService = this.getServices().masterDataService;
    }
    updateField = (e: ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        const name: string | null = target.getAttribute("name");
        if (null == name) return;
        this.setState({ [name]: target.value });
    }
    startLoading = () => this.setState({ loading: true });
    endLoading = () => this.setState({ loading: false });
    searchSupplier = (e) => {
        e.preventDefault();
        const code: string = this.state.code;
        if (code.trim() == "") return;
        this.loadSupplier(code);
    }
    supplierLoaded = (response: WebResponse) => {
        console.debug("response: ", response);
        if (!response.entities || !response.entities[0]) {
            throw new Error("Pemasok tidak ditemukan");
        }
        if (this.props.setSupplier) { this.props.setSupplier(response.entities[0]); }
        this.setState({ supplier: response.entities[0], supplierNotFound: false });
    }
    supplierNotFound = (e: any) => {
        this.setState({ supplierNotFound: true });
    }
    loadSupplier = (code: string) => {
        if (this.state.loading) return;
        this.commonAjax(this.masterDataService.getByKey,
            this.supplierLoaded, this.supplierNotFound, 'supplier', 'code', code);
    }
    reset = (e: any) => {
        this.setState({ code: "" })
    }
    render() {
        return (

            <form onSubmit={this.searchSupplier} >
                <Modal toggleable={true} title="Pilih Pemasok" footerContent={
                    <Fragment>
                        <AnchorWithIcon iconClassName="fas fa-list" attributes={{ target: '_blank' }} to="/management/supplier" className="btn btn-outline-secondary" />
                        <input type="submit" className="btn btn-secondary" value="Search" />
                        <input type="reset" onClick={this.reset} className="btn btn-outline-secondary" />
                    </Fragment>
                } >
                    <div className="form-group">
                        <FormGroup label="Code">
                            <input placeholder="Kode Pemasok" required className="form-control" onChange={this.updateField} value={this.state.code} name="code" />
                        </FormGroup>
                    </div>
                    <SupplierDetail loading={this.state.loading} supplier={this.state.supplier} notFound={this.state.supplierNotFound} />
                </Modal>
            </form>
        )
    }

}
const SupplierDetail = (props: { loading: boolean, supplier: undefined|Supplier, notFound: boolean }) => {
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
                <abbr title="Contact">Kntak: </abbr>{supplier.contact}
            </address>
        </div>
    )
}
const mapDispatchToProps = (dispatch: Function) => ({
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(SupplierForm))