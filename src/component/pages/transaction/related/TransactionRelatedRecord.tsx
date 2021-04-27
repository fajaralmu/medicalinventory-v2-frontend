import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import Transaction from '../../../../models/Transaction';
import Modal from '../../../container/Modal';
import FormGroup from '../../../form/FormGroup';
import WebResponse from '../../../../models/common/WebResponse';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
import ProductFlow from '../../../../models/ProductFlow';
import Product from '../../../../models/Product';
import SimpleError from '../../../alert/SimpleError';
import { beautifyNominal } from '../../../../utils/StringUtil';
import Spinner from '../../../loader/Spinner';
import TransactionService from '../../../../services/TransactionService';
import ReportService from '../../../../services/ReportService';
import BasePage from '../../../BasePage';
import { tableHeader } from './../../../../utils/CollectionUtil';
class IState {
    transaction?: Transaction;
    transactionCode?: string;
    dataNotFound: boolean = false;
    loading: boolean = false;
}
class TransactionRelatedRecord extends BasePage {
    transactionService: TransactionService;
    reportService: ReportService;
    state: IState = new IState();
    constructor(props: any) {
        super(props, "Transaction Related Record", true);
        this.transactionService = this.getServices().transactionService;
        this.reportService = this.getServices().reportService;
    }
    // startLoading = () => this.setState({ loading: true });
    // endLoading = () => this.setState({ loading: false });
    componentDidMount() {
        this.validateLoginStatus(() => {
            this.validateTransactionFromProps();
            this.scrollTop();
        });

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
        this.commonAjaxWithProgress(
            this.transactionService.getTransactionRelatedRecord,
            this.recordLoaded,
            this.recordNotLoaded,
            this.state.transactionCode
        )
    }
    validateTransactionFromProps = () => {
        if (this.props.match.params && this.props.match.params.code) {
            const code = this.props.match.params.code;

            this.commonAjaxWithProgress(
                this.transactionService.getTransactionRelatedRecord,
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
            <div id="TransactionRelatedRecord" className="container-fluid section-body" >
                <h2>Rincian Pemetaan Stok Transaksi</h2>
                <div className="row">
                    <form className="col-md-6" onSubmit={this.onSubmit}>
                        <Modal title="Cari dengan kode"
                            footerContent={
                                <Fragment>
                                    <AnchorWithIcon iconClassName="fas fa-list" attributes={{ target: '_blank' }} to="/management/transaction" className="btn btn-secondary" >Daftar Record Transaksi</AnchorWithIcon>
                                    <input type="submit" className="btn btn-primary" value="Cari" />
                                </Fragment>
                            }
                        >
                            <FormGroup label="Kode">
                                <input value={this.state.transactionCode ?? ""} required onChange={this.handleInputChange} type="text" name="transactionCode" placeholder="Kode Transaksi" className="form-control" />
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
    const date = new Date(transaction.transactionDate ?? new Date()).toLocaleString("ID");
    return (
        <Modal title="Transaction Data">
            <div className="row">
                <div className="col-md-6">
                    <FormGroup label="Id Record" orientation='horizontal' children={transaction.id} />
                    <FormGroup label="Kode" orientation='horizontal' children={transaction.code} />
                    <FormGroup label="Tipe" orientation='horizontal' children={transaction.type} />
                    <FormGroup label="Tanggal" orientation='horizontal' children={date} />
                </div>
                <div className="col-md-6">
                    <Fragment>
                        <FormGroup show={transaction.type == 'TRANS_OUT'}
                            label="Pelanggan" orientation='horizontal'
                            children={transaction.customer?.name} />
                        <FormGroup show={transaction.type == 'TRANS_OUT_TO_WAREHOUSE'}
                            label="Puskesmas" orientation='horizontal'
                            children={transaction.healthCenterDestination?.name} />
                        <FormGroup show={transaction.type == 'TRANS_IN'}
                            label="Pemasok" orientation='horizontal'
                            children={transaction.supplier?.name} />
                    </Fragment>
                    <FormGroup label="User" orientation='horizontal'
                        children={transaction.user?.displayName} />

                </div>
                <div className="col-md-12">
                    <div className="alert alert-info">
                        <h5>Note:</h5>
                        {transaction.description}
                    </div>
                </div>
                <div className="col-md-12">
                    <h3>Products</h3>
                    <table className="table xtable-striped">
                        <thead>
                            <tr>
                                <th>No</th> <th colSpan={4}>Name</th> <th>Qty</th> <th>Trans. Code</th><th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productFlows.map((item, i) => {
                                const refItemsLv1 = item.referencingItems ?? [];
                                return <Fragment key={"main-pf-" + i}>
                                    <tr >
                                        <td children={i + 1} />
                                        <td colSpan={4}>
                                            Item Id: {item.id}
                                            <br/>{item.product?.name} | {item.product?.unit?.name}
                                        </td>
                                        <td>{item.count}</td>
                                        <td>{item.transaction?.code}<br />({item.transaction?.type})</td>
                                        <td>{transactionDateTime(item.transaction)}</td>
                                    </tr>
                                    {refItemsLv1 ? <tr><td /><td style={{ fontSize: '0.7em' }} colSpan={7} >Usage List</td></tr> : null}
                                    {refItemsLv1.map((rfItemlv1, r) => {
                                        const refItemsLv2 = rfItemlv1.referencingItems ?? [];
                                        return (
                                            <Fragment key={"ref-pf-" + r + "-" + i}>
                                                <tr >
                                                    <td /><td children={r + 1} />
                                                    <td colSpan={3}>Item Id: {rfItemlv1.id}</td>
                                                    <td>{rfItemlv1.count}</td>
                                                    <td>{rfItemlv1.transaction?.code}
                                                        <br />({rfItemlv1.transaction?.type})</td>
                                                    <td>{transactionDateTime(rfItemlv1.transaction)}</td>
                                                </tr>
                                                {refItemsLv2.length > 0 ? <tr><td colSpan={2} /><td style={{ fontSize: '0.7em' }}  colSpan={6} >Usage List</td></tr> : null}
                                                {refItemsLv2.map((rfItemlv2, r2) => {
                                                    return (
                                                        <Fragment key={"ref-pf2-" + r + "-" + i + "-" + r2}>
                                                            <tr >
                                                                <td colSpan={2} /><td children={r2 + 1} />
                                                                <td colSpan={2}>Item Id: {rfItemlv2.id}</td>
                                                                <td>{rfItemlv2.count}</td>
                                                                <td>{rfItemlv2.transaction?.code}
                                                                    <br />({rfItemlv2.transaction?.type})</td>
                                                                <td>{transactionDateTime(rfItemlv2.transaction)}</td>
                                                            </tr>

                                                        </Fragment>
                                                    )
                                                })}

                                            </Fragment>
                                        )
                                    })}
                                </Fragment>
                            })}
                        </tbody>
                    </table>

                </div>
            </div>
        </Modal>
    )
}

const transactionDateTime = (transaction?: Transaction) => {
    if (!transaction || !transaction.transactionDate) return null;
    const date: Date = new Date(transaction.transactionDate);
    return date.toLocaleDateString("ID") + " " + date.toLocaleTimeString();
}
export default withRouter(connect(
    mapCommonUserStateToProps,
)(TransactionRelatedRecord))