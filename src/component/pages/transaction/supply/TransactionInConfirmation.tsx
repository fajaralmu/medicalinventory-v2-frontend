

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseComponent from '../../../BaseComponent';
import Transaction from '../../../../models/Transaction';
import Card from '../../../container/Card';
import FormGroup from '../../../form/FormGroup';
import AnchorButton from '../../../navigation/AnchorButton';
import ProductFlow from '../../../../models/ProductFlow';
import { beautifyNominal } from '../../../../utils/StringUtil';
import TransactionService from '../../../../services/TransactionService';
import WebResponse from '../../../../models/common/WebResponse';
import BasePage from './../../../BasePage';

class State { transaction?: Transaction }
class TransactionInConfirmation extends BasePage {
    transactionService: TransactionService;
    state: State = new State();
    constructor(props: any) {
        super(props, "Konfirmasi Transaksi", true);
        this.transactionService = this.getServices().transactionService;
    }

    componentDidMount() {
        this.validateLoginStatus(() => {
            this.validateTransactionFromProps();
            this.scrollTop();
        });
    }
    validateTransactionFromProps = () => {
        if (!this.props.location.state) {
            this.props.history.push("/transaction/productin");
            return;
        }
        const transaction = this.props.location.state.transaction;
        if (transaction) {
            this.setState({ transaction: Object.assign(new Transaction(), transaction) });
        }
    }
    back = (e) => {
        this.props.history.push({
            pathname: "/transaction/productin",
            state: { transaction: this.state.transaction?.code ? new Transaction() : this.state.transaction }
        })
    }
    onSuccess = (response: WebResponse) => {
        this.showInfo("Transaksi Berhasil");
        this.props.history.push({
            pathname: "/transaction/detail",
            state: { transaction: response.transaction }
        })
    }
    confirm = (e) => {
        this.commonAjaxWithProgress(
            this.transactionService.submitTransactionIN,
            this.onSuccess,
            this.showCommonErrorAlert,
            this.state.transaction
        )
    }
    render() {
        const transaction: Transaction | undefined = this.state.transaction;
        if (!transaction) return null;
        return (
            <div id="TransactionMain" className="container-fluid section-body">
                <h2>Konfirmasi Transaksi</h2>
                <div className="alert alert-info">
                    Pastikan bahwa data transaksi telah sesuai
                </div>
                <Card title="Information">
                    {transaction.code ?
                        <FormGroup label="Kode">
                            {transaction.code}
                        </FormGroup> : null}
                    <FormGroup label="Tanggal">
                        {new Date(transaction.transactionDate).toString()}
                    </FormGroup>
                    <FormGroup label="Pemasok">
                        {transaction.supplier?.name}
                    </FormGroup>
                    <FormGroup label="Catatan"> {transaction.description}  </FormGroup>
                    <AnchorButton style={{ marginRight: '5px' }} onClick={this.back} iconClassName="fas fa-angle-left" children="Kembali" />
                    <AnchorButton show={transaction.code == undefined} onClick={this.confirm} iconClassName="fas fa-check" className="btn btn-primary" children="Konfirmasi" />
                </Card>
                <p />
                <Card title="Product List">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>No</th><th>Nama</th><th>Qty</th><th>Unit</th><th>Generik</th><th>Harga @Unit</th><th>Kadaluarsa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaction.productFlows.map((productFlow, i) => {
                                return (
                                    <ProductFlowRow productFlow={productFlow} index={i} key={"pf-tr-cnfm-" + i} />
                                )
                            })}
                        </tbody>
                    </table>
                </Card>
                <p />
            </div>
        )
    }
}
const ProductFlowRow = (props: { productFlow: ProductFlow, index: number }) => {
    const i = props.index, productFlow = props.productFlow;
    return (<tr  >
        <td>{i + 1}</td>
        <td>{productFlow.product.name}</td>
        <td>{beautifyNominal(productFlow.count)}</td>
        <td>{productFlow.product.unit?.name}</td>
        <td>{productFlow.generic ? "Yes" : "No"}</td>
        <td>{beautifyNominal(productFlow.price)}</td>
        <td>{productFlow.expiredDate ? new Date(productFlow.expiredDate).toLocaleDateString("ID") : "-"}</td>
    </tr>)
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(TransactionInConfirmation))