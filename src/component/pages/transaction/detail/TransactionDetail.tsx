

import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseComponent from './../../../BaseComponent';
import Transaction from './../../../../models/Transaction';
import Modal from './../../../container/Modal';
import FormGroup from '../../../form/FormGroup';
import WebResponse from './../../../../models/WebResponse';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
import ProductFlow from './../../../../models/ProductFlow';
import Product from '../../../../models/Product';
import SimpleError from './../../../alert/SimpleError';
import { beautifyNominal } from '../../../../utils/StringUtil';
import Spinner from '../../../loader/Spinner';
import TransactionService from './../../../../services/TransactionService';
import ReportService from './../../../../services/ReportService';
import AttachmentInfo from './../../../../models/AttachmentInfo';
class IState {
    transaction?: Transaction;
    transactionCode?: string;
    dataNotFound: boolean = false;
    loading: boolean = false;
}
class TransactionDetail extends BaseComponent {
    transactionService: TransactionService;
    reportService:ReportService;
    state: IState = new IState();
    constructor(props: any) {
        super(props, true);
        this.transactionService = this.getServices().transactionService;
        this.reportService = this.getServices().reportService;
    }
    startLoading = () => this.setState({ loading: true });
    endLoading = () => this.setState({ loading: false });
    componentDidMount() {
        this.validateLoginStatus();
        this.validateTransactionFromProps();
        document.title = "Transaction Detail";
    }
    componentDidUpdate() {
        this.validateLoginStatus();
    }

    recordLoaded = (response: WebResponse) => {
        if (!response.transaction) {
            throw new Error("Not found");
        }
        this.setState({ transaction: response.transaction, dataNotFound: false });
    }

    recordNotLoaded = (e: any) => {
        console.error(e);
        this.setState({ dataNotFound: true, transaction: undefined });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.loadData();
    }
    loadData = () => {
        console.debug(" this.state.transactionCode: ", this.state.transactionCode);
        this.commonAjax(
            this.transactionService.getTransactionByCode,
            this.recordLoaded,
            this.recordNotLoaded,
            this.state.transactionCode
        )
    }
    setTransactionCode = (e) => {
        this.setState({ transactionCode: e.target.value });
    }
    recordDeleted = (response:WebResponse) => {
        this.showInfo("Record has been successfully deleted")
        this.loadData();
    }
    recordNotDeleted = (e:any) => {
        console.error(e);
        this.showError("Cannot delete transaction "+this.state.transaction?.code
        +", please delete all related stock/ product flow data");
    }
    deleteRecord = (e) => {
        if (!this.state.transaction) return;
        this.showConfirmationDanger("Delete Record with code: "+ this.state.transaction?.code+"?").then(ok=>{
            if(!ok) return
            this.commonAjax(
                this.transactionService.deleteTransactionByCode,
                this.recordDeleted,
                this.recordNotDeleted,
                this.state.transaction?.code
            )
        })
    }
    receiptCreated =(attachment:AttachmentInfo) => {
        this.showConfirmation("Save "+attachment.name+ " ?")
        .then((ok) => {
            if(!ok) return;
            Object.assign(document.createElement('a'), {
                target: '_blank',
                download: attachment.name,
                style: {display: 'none'},
                href: attachment.dataUrl,
              }).click();
        })
       
    }
    printReceipt = () => {

        this.commonAjaxWithProgress(
            this.reportService.printTransactionReceipt,
            this.receiptCreated,
            this.showCommonErrorAlert,
            this.state.transaction?.code
        )
    }
    validateTransactionFromProps = () => {
        if (this.props.match.params && this.props.match.params.code) {
            const code = this.props.match.params.code;

            this.commonAjax(
                this.transactionService.getTransactionByCode,
                this.recordLoaded,
                this.recordNotLoaded,
                code
            )
            return;
        }
        if (!this.props.location.state) {
            return;
        }
        const transaction = this.props.location.state.transaction;
        if (transaction) {
            this.setState({ transaction: Object.assign(new Transaction(), transaction) });
        }
    }

    render() {
        return (
            <div id="TransactionDetail" className="container-fluid section-body" >
                <h2>Rincial Transaksi</h2>
                <div className="row">
                    <form className="col-md-6" onSubmit={this.onSubmit}>
                        <Modal title="Cari dengan kode"
                            footerContent={
                                <Fragment>
                                    <AnchorWithIcon iconClassName="fas fa-list" attributes={{ target: '_blank' }} to="/management/transaction" className="btn btn-secondary" >Daftar Rekord Transaksi</AnchorWithIcon>
                                    <input type="submit" className="btn btn-primary" value="Cari" />
                                </Fragment>
                            }
                        >
                            <FormGroup label="Kode">
                                <input required onChange={this.setTransactionCode} type="text" placeholder="Kode Transaksi" className="form-control" />
                            </FormGroup>
                        </Modal>
                    </form>
                    <div className="col-md-6"></div>
                    <div className="col-md-12">
                        {this.state.loading ?
                            <Spinner /> :
                            <Fragment>
                                <SimpleError show={this.state.dataNotFound == true} >Transaksi tidak ditemukan</SimpleError>
                                <TransactionData show={this.state.transaction != undefined} transaction={this.state.transaction} />
                                <p/>
                                <AnchorWithIcon show={this.state.transaction != undefined}onClick={this.deleteRecord} iconClassName="fas fa-times" className="btn btn-danger">Hapus Transaksi</AnchorWithIcon>
                                <p/>
                                <AnchorWithIcon show={this.state.transaction != undefined} onClick={this.printReceipt} iconClassName="fas fa-file" className="btn btn-dark">Cetak Struk</AnchorWithIcon>
                                <p/>
                            </Fragment>
                        }
                    </div>
                </div>
            </div>
        )
    }

}
const TransactionData = (props) => {
    if (props.show == false) return null;
    const transaction: Transaction = props.transaction;
    const productFlows: ProductFlow[] = transaction.productFlows ? transaction.productFlows : [];
    const isTransOut = transaction.type != 'TRANS_IN';

    return (
        <Modal title="Transaction Data">
            <div className="row">
                <div className="col-md-6">
                    <FormGroup label="Id Rekord" orientation='horizontal'>
                        {transaction.id}
                    </FormGroup>
                    <FormGroup label="Kode" orientation='horizontal'>
                        {transaction.code}
                    </FormGroup>
                    <FormGroup label="Tipe" orientation='horizontal'>
                        {transaction.type}
                    </FormGroup>
                    <FormGroup label="Tanggal" orientation='horizontal'>
                        {new Date(transaction.transactionDate ?? new Date()).toLocaleString()}
                    </FormGroup>
                </div>
                <div className="col-md-6">
                    <Fragment>
                        <FormGroup show={transaction.type == 'TRANS_OUT_TO'} label="Pelanggan" orientation='horizontal'>
                            {transaction.customer?.name}
                        </FormGroup>
                        <FormGroup show={transaction.type == 'TRANS_OUT_TO_WAREHOUSE'} label="Puskesmas" orientation='horizontal'>
                            {transaction.healthCenterDestination?.name}
                        </FormGroup>
                        <FormGroup show={transaction.type == 'TRANS_IN'} label="Pemasok" orientation='horizontal'>
                            {transaction.supplier?.name}
                        </FormGroup>

                    </Fragment>

                    <FormGroup label="User" orientation='horizontal'>
                        {transaction.user?.displayName}
                    </FormGroup>

                </div>
                <div className="col-md-12">
                    <div className="alert alert-info">
                        <h5>Note:</h5>
                        {transaction.description}
                    </div>
                </div>
                <div className="col-md-12">
                    <h3>Products</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>ID Rekord</th>
                                <th>Nama</th>
                                <th>Qty</th>
                                <th>Unit</th>
                                <th>Generik</th>
                                <th>Kadaluarsa</th>
                                <th>Harga @Unit</th>
                                <th>Total Harga</th>
                                {isTransOut?<th>ID Stok</th>:null}
                            </tr>
                        </thead>
                        <tbody>
                            {productFlows.map((pf, i) => {
                                const product: Product = pf.product ?? new Product();
                                const price = pf.price;
                                return (
                                    <tr key={"pf-tr-" + i}>
                                        <td>{i + 1}</td>
                                        <td>{pf.id}</td>
                                        <td>{product.name} ({product.code})</td>
                                        <td>{beautifyNominal(pf.count)}</td>
                                        <td>{product.unit?.name}</td>
                                        <td>{pf.generic?"Yes":"No"}</td>
                                        <td>{pf.expiredDate?new Date(pf.expiredDate).toDateString():"-"}</td>
                                        <td>{beautifyNominal(price)}</td>
                                        <td>{beautifyNominal((price ?? 0) * (pf.count ?? 0))}</td>
                                        {isTransOut?<td>
                                            {pf.referenceProductFlow?pf.referenceProductFlow.id:"-"}
                                        </td>:null}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {/* <div className="alert alert-info text-left">
                        <FormGroup label="Total unit">
                            <p>{beautifyNominal(totalUnitAndPrice(productFlows).unit)}</p>
                        </FormGroup>
                        <FormGroup label="Total price">
                            <p>{beautifyNominal(totalUnitAndPrice(productFlows).productFlowPrice)}</p>
                        </FormGroup>
                    </div> */}
                </div>
            </div>
        </Modal>
    )
}
const mapDispatchToProps = (dispatch: Function) => ({
})

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(TransactionDetail))