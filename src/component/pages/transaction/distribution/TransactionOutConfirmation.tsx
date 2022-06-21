

import React, { ChangeEvent, Fragment } from 'react';
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
import Product from '../../../../models/Product';
import { tableHeader } from '../../../../utils/CollectionUtil';
import BasePage from './../../../BasePage';
import { resolve } from 'inversify-react';

class State { transaction?: Transaction }
class TransactionOutConfirmation extends BasePage {
    
    @resolve(TransactionService)
    private transactionService: TransactionService;

    state: State = new State();
    constructor(props: any) {
        super(props, "Konfirmasi Transaksi");
    }

    componentDidMount() {
        this.scrollTop();
        this.validateTransactionFromProps();
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
            pathname: "/transaction/productout",
            state: { transaction: this.state.transaction?.code ? new Transaction() : this.state.transaction }
        })
    }
    onSuccess = (response: WebResponse) => {
        this.showInfo("Transaction Success");
        this.props.history.push({
            pathname: "/transaction/detail",
            state: { transaction: response.transaction }
        })
    }
    confirm = (e) => {
        this.commonAjaxWithProgress(
            this.transactionService.submitTransactionOUT,
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
                {this.titleTag()}
                <div className="alert alert-info">
                    Pastikan bahwa data transaksi telah sesuai
                </div>
                <Card title="Information">
                    {transaction.code ?
                        <FormGroup label="Kode">
                            {transaction.code}
                        </FormGroup> : null}
                    <FormGroup label="Tanggal">
                        {new Date(transaction.transactionDate).toLocaleString()}
                    </FormGroup>
                    <FormGroup label="Lokasi">
                        {transaction.healthCenterLocation?.name}
                    </FormGroup>
                    <FormGroup label="Pelanggan">
                        {transaction.customer?.name??"-"}
                    </FormGroup>
                    <FormGroup label="Puskesmas">
                        {transaction.healthCenterDestination?.name??"-"}
                    </FormGroup>
                    <FormGroup label="Catatan"> {transaction.description}  </FormGroup>
                    <Fragment>
                        <AnchorButton
                            style={{marginRight:'5px'}}
                            onClick={this.back}
                            iconClassName="fas fa-angle-left"
                            children="Back"
                        />
                        <AnchorButton
                            show={transaction.code == undefined}
                            onClick={this.confirm}
                            iconClassName="fas fa-check"
                            className="btn btn-primary"
                            children="Konfirmasi"
                        />
                    </Fragment>
                </Card>
                <p />
                <Card title="Product List">
                    <table className="table table-striped">
                        {tableHeader("No", "Id Stok", "Nama", "Stok", "Qty", "Unit", "Generik", "Kadaluarsa", "Batch" )}
                            
                        <tbody>
                            {transaction.productFlows.map((item, i) => {
                                return (
                                    <ProductFlowRow productFlow={item} index={i} key={`pf-tr-cnfm-${i}`} />
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
    const { productFlow, index } = props;
    const { product, referenceProductFlow: ref, expiredDate, count } = productFlow;
    return (
    <tr>
        <td>{index + 1}</td>
        <td>{ref?.id}</td>
        <td>{product.name}</td>
        <td>{ref?.stock} </td>
        <td>{beautifyNominal(count)}</td>
        <td>{product.unit?.name}</td>
        <td>{ref?.generic?"Yes":"No"}</td>
        <td>
            {new Date(expiredDate).toLocaleDateString("ID")}
        </td>
        <td>{ref?.batchNum}</td>
    </tr>
    );
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(TransactionOutConfirmation))