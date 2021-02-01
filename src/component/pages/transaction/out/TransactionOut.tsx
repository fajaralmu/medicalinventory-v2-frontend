import React, { ChangeEvent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import CustomerForm from './CustomerForm';
import ProductForm from '../ProductForm';
import Product from './../../../../models/Product';
import Transaction from './../../../../models/Transaction';
import ProductFlow from './../../../../models/ProductFlow';
import WebResponse from './../../../../models/WebResponse';
import Card from '../../../container/Card';
import { beautifyNominal } from '../../../../utils/StringUtil';
import { tableHeader } from './../../../../utils/CollectionUtil';
import Modal from './../../../container/Modal';
import FormGroup from './../../../form/FormGroup';
import { getInputReadableDate } from '../../../../utils/DateUtil';
import AnchorButton from './../../../navigation/AnchorButton';
import Customer from './../../../../models/Customer';
import HealthCenter from './../../../../models/HealthCenter';
import Spinner from '../../../loader/Spinner';
import BaseTransactionPage from './../BaseTransactionPage';
import WebRequest from './../../../../models/WebRequest';
import { ProductFlowItemInput, HealthCenterForm, DestinationInfo } from './transactionOutForms';
import SimpleWarning from './../../../alert/SimpleWarning';
const CUSTOMER = "CUSTOMER", HEALTH_CENTER = "HEALTH_CENTER";

class State {
    selectedProduct: Product | undefined = undefined;
    transaction: Transaction = new Transaction();
    availableProducts: ProductFlow[] | undefined = undefined;
    healthCenters: HealthCenter[] = [];
    loadingProducts: boolean = false;
}
class TransactionOut extends BaseTransactionPage {

    state: State = new State();
    constructor(props: any) {
        super(props);
        this.state.transaction.healthCenterLocation = this.getMasterHealthCenter();
    }

    updateDestination = (e) => {
        const destination = e.target.value;
        const transaction = this.state.transaction;

        if (destination == CUSTOMER) {
            transaction.healthCenterDestination = undefined;
        } else if (destination == HEALTH_CENTER) {
            transaction.customer = undefined;

            transaction.healthCenterLocation = this.getMasterHealthCenter();
            transaction.healthCenterDestination = this.state.healthCenters[0];
        }
        transaction.destination = destination;
        this.setState({
            selectedProduct: undefined,
            availableProducts: [], transaction: transaction
        });
    }

    healthCentersLoaded = (response: WebResponse) => {
        if (!response.entities || response.entities.length == 0) {
            this.setState({ healthCenters: [{ id: -1, name: "NO DATA, Please Check Master Data" }] });
            return;
        }
        const transaction = this.state.transaction;
        if (!transaction.healthCenterLocation) {
            transaction.healthCenterLocation = this.getMasterHealthCenter();
        }
        this.masterDataService.setHealthCenters(response.entities);
        this.setState({ healthCenters: response.entities, transaction: transaction });
    }

    loadHealthCenters = (force: boolean = false) => {
        const transaction = this.state.transaction;
        transaction.healthCenterLocation = undefined;

        if (!force && this.masterDataService.getHealthCenters().length > 0) {
            this.healthCentersLoaded({ entities: this.masterDataService.getHealthCenters() });
            return;
        }

        this.setState({ healthCenters: [], transaction: transaction, availableProduct: [] });

        this.commonAjax(
            this.masterDataService.loadHealthCenters,
            this.healthCentersLoaded, this.showCommonErrorAlert,
        )
    }

    setProduct = (product: Product) => {
        this.setState({ selectedProduct: product });
        this.loadAvailableProducts();
    }

    availableProductsLoaded = (response: WebResponse) => {
        this.setState({ availableProducts: response.entities, loadingProducts: false });
    }
    availableProductsNotLoaded = (e: any) => {
        console.error(e);
        this.setState({ loadingProducts: false });
    }
    loadAvailableProducts = () => {
        if (!this.state.selectedProduct || !this.state.transaction.healthCenterLocation) {
            console.warn("(!this.state.selectedProduct || !this.state.selectedHealthCenter)");
            return;
        }
        if (this.state.loadingProducts) return;
        this.commonAjax(
            this.inventoryService.getAvailableProducts,
            this.availableProductsLoaded,
            this.availableProductsNotLoaded,
            this.state.selectedProduct.code,
            this.state.transaction.healthCenterLocation
        )
        this.setState({ loadingProducts: true });
    }
    componentDidMount() {
        this.validateLoginStatus();
        this.loadHealthCenters();
        this.validateTransactionFromProps();
        document.title = "Transaksi Keluar";
    }

    addToCart = (availableProductFlow: ProductFlow) => {
        const productFlow: ProductFlow = ProductFlow.fromReference(availableProductFlow);
        const transaction = this.state.transaction;
        transaction.addProductFlow(productFlow);
        this.setTransaction(transaction);
    }

    updateSelectedHealthCenter = (e: ChangeEvent) => {
        const input = e.target as HTMLSelectElement;
        const healthCenters: HealthCenter[] = this.state.healthCenters.filter(h => h.id?.toString() == input.value);
        if (this.state.transaction.destination == HEALTH_CENTER) return;
        this.showConfirmation("Change Location?").then((ok) => {
            if (!ok) return;
            const transaction = new Transaction();
            transaction.healthCenterLocation = healthCenters[0];
            if (healthCenters.length > 0) {
                this.setState({
                    selectedProduct: undefined,
                    availableProducts: [],
                    transaction: transaction
                });
            }
        });

    }
    setCustomer = (customer: Customer) => {
        const transaction: Transaction = this.state.transaction;
        transaction.customer = customer;
        this.setTransaction(transaction);
    }

    submit = (e) => {
        e.preventDefault();
        if (!this.state.transaction.healthCenterLocation || (!this.state.transaction.customer && !this.state.transaction.healthCenterDestination)) {
            this.showError("Please complete fields");
            return;
        }
        this.showConfirmation("Continue Transaction?").then((ok) => {
            if (!ok) return;
            this.props.history.push({
                pathname: "/transaction/productout/confirm",
                state: { transaction: this.state.transaction }
            })
        })
    }
    setHealthCenterDestination = (e: ChangeEvent) => {
        const target = e.target as HTMLSelectElement;
        const selecteds = this.state.healthCenters.filter((h) => { return h.id == parseInt(target.value ?? "0") });
        if (selecteds.length == 0) return;
        const transaction = this.state.transaction;
        transaction.healthCenterDestination = selecteds[0];
        this.setTransaction(transaction);
    }
    render() {
        const availableProducts: ProductFlow[] = this.state.availableProducts ?? [];
        const transaction: Transaction = this.state.transaction;
        const healthCenters: HealthCenter[] = this.state.healthCenters;
        if (!transaction.healthCenterLocation || healthCenters.length == 0) {
            return <div id="TransactionOut" className="container-fluid">
                <h2>Transaction :: OUT</h2>
                <Spinner />
            </div>
        }
        return (
            <div id="TransactionOut" className="container-fluid">
                <h2>Transaction :: OUT {transaction.healthCenterLocation?.name}</h2>
                <form onSubmit={(e) => { e.preventDefault() }} className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.displayName}</strong>
                    <p />
                    <FormGroup label="Location">
                        <select autoComplete="off" value={transaction.healthCenterLocation?.id} onChange={this.updateSelectedHealthCenter} className="form-control">
                            {healthCenters.map((healthCenter, i) => {
                                return (<option key={"OPT_HC-" + i} value={healthCenter.id}>{healthCenter.name}</option>)
                            })}
                        </select>
                    </FormGroup>
                    <FormGroup label="Destination">
                        <select autoComplete="off" value={transaction.destination} onChange={this.updateDestination} className="form-control">
                            <option value={CUSTOMER} >Customer</option>
                            {transaction.healthCenterLocation?.id == this.getMasterHealthCenter().id ?
                                <option value={HEALTH_CENTER}>HealthCenter</option> : null}
                        </select>
                    </FormGroup>
                    <DestinationInfo transaction={transaction} />
                    <AnchorButton iconClassName="fas fa-sync-alt" className="btn btn-secondary btn-sm" onClick={(e) => this.loadHealthCenters(true)} >Reload Location</AnchorButton>

                </form>
                <div className="row">
                    <div className="col-6"><ProductForm setProduct={this.setProduct} /></div>
                    <div className="col-6">
                        {transaction.destination == CUSTOMER ?
                            <CustomerForm setCustomer={this.setCustomer} /> :
                            <HealthCenterForm value={transaction.healthCenterDestination} setHealthCenter={this.setHealthCenterDestination}
                                healthCenters={this.state.healthCenters} />
                        }
                    </div>

                </div>
                <Modal toggleable={true} title={"Available Products at " + transaction.healthCenterLocation?.name}>
                    <table className="table table-striped">
                        {tableHeader("No", "Stock Id", "Name", "Actual", "Used", "Stock", "Unit", "EXP Date", "Action")}
                        <tbody>
                            {this.state.loadingProducts ?
                                <tr><td colSpan={9}><Spinner /></td></tr>
                                :
                                availableProducts.length == 0? <tr><td colSpan={9}><SimpleWarning children="No Data" /></td></tr>:
                                availableProducts.map((productFlow, i) => {
                                    const product: Product = productFlow.product ?? new Product();
                                    const alreadyAdded = transaction.hasProductFlowReferenceid(productFlow.id ?? 0);
                                    return (
                                        <tr key={"pf-tr-" + i}>
                                            <td>{i + 1}</td> <td>{productFlow.id}</td>
                                            <td>{product.name} ({product.code})</td> 
                                            <td>{productFlow.count} </td>
                                            <td>{productFlow.usedCount} </td>
                                            <td>{beautifyNominal(productFlow.stock)}</td>
                                            <td>{product.unit?.name}</td>
                                            <td>{productFlow.expiredDate ? new Date(productFlow.expiredDate).toDateString() : "-"}</td>
                                            <td>
                                                {alreadyAdded ? <i className="fas fa-check text-success" /> : null}
                                                <AnchorButton show={alreadyAdded == false} onClick={(e) => this.addToCart(productFlow)} iconClassName="fas fa-plus" className="btn btn-dark btn-sm" />
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </Modal>
                <p />
                <Card title="Product List">
                    <form onSubmit={this.submit}>
                        <table className="table table-striped"  >
                            {tableHeader("No", "Stock Id", "Name", "Stock", "Qty", "Unit", "EXP Date", "Action")}
                            <tbody>
                                {transaction.productFlows.map((productFlow, i) => {
                                    return <ProductFlowItemInput
                                        updateProductFlow={this.updateProductFlow}
                                        productFlow={productFlow} key={"PF_ITEM_" + i}
                                        index={i} remove={this.removeProductFlow} />
                                })}
                                <tr>
                                    <td colSpan={8} >
                                        <AnchorButton show={transaction.productFlowCount() > 0} onClick={this.removeAll} className="btn btn-danger" iconClassName="fas fa-times" >Remove All</AnchorButton>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {(transaction.customer || transaction.healthCenterDestination) && transaction.productFlowCount() > 0 ?
                            <Fragment>
                                <FormGroup label="Transaction Date">
                                    <input className="form-control" type="date"
                                        value={getInputReadableDate(transaction.transactionDate)}
                                        onChange={this.updateTransactionDate} />
                                </FormGroup>
                                <input type="submit" className="btn btn-success" />
                            </Fragment> : null}
                    </form>
                </Card>
                <p />
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(TransactionOut))