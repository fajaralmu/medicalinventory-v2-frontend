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
const CUSTOMER = "CUSTOMER";
const HEALTH_CENTER = "HEALTH_CENTER";
class State {
    selectedProduct: Product | undefined = undefined;
    transaction: Transaction = new Transaction();
    availableProducts: ProductFlow[] | undefined = undefined;
    healthCenters: HealthCenter[] = [];
}
class TransactionOut extends BaseTransactionPage {

    state: State = new State();
    constructor(props: any) {
        super(props);
        this.state.transaction.healthCenter = this.getMasterHealthCenter();
    }

    updateDestination = (e) => {
        const destination = e.target.value;
        const transaction = this.state.transaction;

        if (destination == CUSTOMER) {
            transaction.healthCenterDestionation = undefined;
        } else if (destination == HEALTH_CENTER) {
            transaction.healthCenter = this.getMasterHealthCenter();
            transaction.healthCenterDestionation = this.state.healthCenters[0];
            transaction.customer = undefined;
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
        if (!transaction.healthCenter) {
            transaction.healthCenter = this.getMasterHealthCenter();
        }
        this.masterDataService.setHealthCenters(response.entities);
        this.setState({ healthCenters: response.entities, transaction: transaction });
    }

    loadHealthCenters = (force: boolean = false) => {
        const transaction = this.state.transaction;
        transaction.healthCenter = undefined;

        if (!force && this.masterDataService.getHealthCenters().length > 0) {
            this.healthCentersLoaded({ entities: this.masterDataService.getHealthCenters() });
            return;
        }

        this.setState({ healthCenters: [], transaction: transaction, availableProduct: [] });
        this.commonAjax(
            this.masterDataService.loadAllEntities,
            this.healthCentersLoaded,
            this.showCommonErrorAlert,
            'healthcenter'
        )
    }

    setProduct = (product: Product) => {
        this.setState({ selectedProduct: product });
        this.loadAvailableProducts();
    }

    availableProductsLoaded = (response: WebResponse) => {
        this.setState({ availableProducts: response.entities });
    }

    loadAvailableProducts = () => {
        if (!this.state.selectedProduct || !this.state.transaction.healthCenter) {
            console.warn("(!this.state.selectedProduct || !this.state.selectedHealthCenter)");
            return;
        }
        this.commonAjax(
            this.inventoryService.getAvailableProducts,
            this.availableProductsLoaded,
            this.showCommonErrorAlert,
            this.state.selectedProduct.code,
            this.state.transaction.healthCenter
        )
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
            transaction.healthCenter = healthCenters[0];
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
        if (!this.state.transaction.healthCenter || (!this.state.transaction.customer && !this.state.transaction.healthCenterDestionation)) {
            this.showError("Please complete fields");
            return;
        }
        this.showConfirmation("Continue Transaction?")
            .then((ok) => {
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
        transaction.healthCenterDestionation = selecteds[0];
        this.setTransaction(transaction);
    }
    render() {
        const availableProducts: ProductFlow[] = this.state.availableProducts ?? [];
        const transaction: Transaction = this.state.transaction;
        const healthCenters: HealthCenter[] = this.state.healthCenters;
        if (!transaction.healthCenter || healthCenters.length == 0) {
            return <div id="TransactionOut" className="container-fluid">
                <h2>Transaction :: OUT</h2>
                <Spinner />
            </div>
        }
        return (
            <div id="TransactionOut" className="container-fluid">
                <h2>Transaction :: OUT {transaction.healthCenter?.name}</h2>
                <form onSubmit={(e) => { e.preventDefault() }} className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.displayName}</strong>
                    <p />
                    <FormGroup label="Location">
                        <select autoComplete="off" value={transaction.healthCenter?.id} onChange={this.updateSelectedHealthCenter} className="form-control">
                            {healthCenters.map((healthCenter, i) => {
                                return (<option key={"OPT_HC-" + i} value={healthCenter.id}>{healthCenter.name}</option>)
                            })}
                        </select>
                    </FormGroup>
                    <FormGroup label="Destination">
                        <select autoComplete="off" value={transaction.destination} onChange={this.updateDestination} className="form-control">
                            <option value={CUSTOMER} >Customer</option>
                            <option value={HEALTH_CENTER}>HealthCenter</option>
                        </select>
                    </FormGroup>
                    <FormGroup >
                        {transaction.healthCenterDestionation?.name}
                    </FormGroup>
                    <AnchorButton iconClassName="fas fa-sync-alt" className="btn btn-secondary btn-sm" onClick={(e) => this.loadHealthCenters(true)} >Reload Location</AnchorButton>

                </form>
                <div className="row">
                    <div className="col-6"><ProductForm setProduct={this.setProduct} /></div>
                    <div className="col-6">
                        {transaction.destination == CUSTOMER ?
                            <CustomerForm setCustomer={this.setCustomer} /> :
                            <HealthCenterForm value={transaction.healthCenterDestionation} setHealthCenter={this.setHealthCenterDestination}
                                healthCenters={this.state.healthCenters} />
                        }
                    </div>

                </div>
                <Modal toggleable={true} title={"Available Products at " + transaction.healthCenter?.name}>
                    <table className="table table-striped">
                        {tableHeader("No", "Stock Id", "Name", "Stock", "Unit", "EXP Date", "Action")}
                        <tbody>
                            {availableProducts.map((productFlow, i) => {
                                const product: Product = productFlow.product ?? new Product();
                                const alreadyAdded = transaction.hasProductFlowReferenceid(productFlow.id ?? 0);
                                return (
                                    <tr key={"pf-tr-" + i}>
                                        <td>{i + 1}</td>
                                        <td>{productFlow.id}</td>
                                        <td>{product.name}</td>
                                        <td>{beautifyNominal(productFlow.count)}</td>
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
                        {(transaction.customer || transaction.healthCenterDestionation) && transaction.productFlowCount() > 0 ?
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

const HealthCenterForm = (props: {value?:HealthCenter, healthCenters:HealthCenter[], setHealthCenter(e:any):void }) => {

    return (<form>
         <Modal toggleable={true}  title="Health Center Destination">
            <FormGroup label="Health Center List">
                <select value={props.value?.id} className="form-control" onChange={props.setHealthCenter}>
                    {props.healthCenters.map((hc,i)=>{
                        return <option value={hc.id} key={"hc-frm-"+i}>{hc.name}</option>
                    })}
                </select>
            </FormGroup>
         </Modal>
    </form>)
}

const ProductFlowItemInput = (props: { productFlow: ProductFlow, updateProductFlow(e: ChangeEvent): void, index: number, remove(index: number): void }) => {
    const product: Product = props.productFlow.product;
    const productFlow: ProductFlow = props.productFlow;
    return (<tr>
        <td>{props.index + 1}</td>
        <td>{productFlow.referenceProductFlow?.id}</td>
        <td>{product.name}</td>
        <td>{props.productFlow.referenceProductFlow?.count} </td>
        <td><input required min={1} max={props.productFlow.referenceProductFlow?.count} type="number" className="form-control" name="count" data-index={props.index} onChange={props.updateProductFlow}
            value={props.productFlow.count} />
        </td>
        <td>{product.unit?.name}</td>
        <td>
            {new Date(props.productFlow.referenceProductFlow?.expiredDate ?? new Date()).toDateString()}
        </td>
        <td><AnchorButton iconClassName="fas fa-times" className="btn btn-danger" onClick={(e) => {
            props.remove(props.index);
        }} /></td>
    </tr>)
}
export default withRouter(connect(
    mapCommonUserStateToProps
)(TransactionOut))