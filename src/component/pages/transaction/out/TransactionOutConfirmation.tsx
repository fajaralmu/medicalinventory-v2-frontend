

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
import WebResponse from '../../../../models/WebResponse';
import Product from './../../../../models/Product';
import { tableHeader } from './../../../../utils/CollectionUtil';

class State { transaction?: Transaction }
class TransactionOutConfirmation extends BaseComponent {
    transactionService: TransactionService;
    state: State = new State();
    constructor(props: any) {
        super(props, true);
        this.transactionService = this.getServices().transactionService;
    }

    componentDidMount() {
        this.validateLoginStatus();
        this.validateTransactionFromProps();
        document.title = "Transaction Confirmation";
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
            <div id="TransactionMain" className="container-fluid">
                <h2>Transaction Confirmation</h2>
                <div className="alert alert-info">
                    Confirm Transaction
                </div>
                <Card title="Information">
                    {transaction.code ?
                        <FormGroup label="Code">
                            {transaction.code}
                        </FormGroup> : null}
                    <FormGroup label="Date">
                        {new Date(transaction.transactionDate).toString()}
                    </FormGroup>
                    <FormGroup label="Location">
                        {transaction.healthCenter?.name}
                    </FormGroup>
                    <FormGroup label="Customer">
                        {transaction.customer?.name??"-"}
                    </FormGroup>
                    <FormGroup label="Health Center">
                        {transaction.healthCenterDestionation?.name??"-"}
                    </FormGroup>
                    <Fragment>
                        <AnchorButton style={{marginRight:'5px'}} onClick={this.back} iconClassName="fas fa-angle-left" children="Back" />
                        <AnchorButton show={transaction.code == undefined} onClick={this.confirm} iconClassName="fas fa-check" className="btn btn-primary" children="Confirm" />
                    </Fragment>
                </Card>
                <p />
                <Card title="Product List">
                    <table className="table table-striped">
                        {tableHeader("No", "Stock Id", "Name", "Stock", "Qty", "Unit", "EXP Date" )}
                            
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
    const product: Product = props.productFlow.product;
    return (<tr>
        <td>{props.index + 1}</td>
        <td>{productFlow.referenceProductFlow?.id}</td>
        <td>{product.name}</td>
        <td>{props.productFlow.referenceProductFlow?.count} </td>
        <td>{beautifyNominal(productFlow.count)}</td>
        <td>{product.unit?.name}</td>
        <td>
            {new Date(props.productFlow.expiredDate).toDateString()}
        </td>
    </tr>)
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(TransactionOutConfirmation))