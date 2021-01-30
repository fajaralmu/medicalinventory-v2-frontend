


import React, { ChangeEvent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseComponent from './../../../BaseComponent';
import SupplierForm from './SupplierForm';
import ProductForm from '../ProductForm';
import Transaction from './../../../../models/Transaction';
import Product from './../../../../models/Product';
import Card from './../../../container/Card';
import FormGroup from '../../../form/FormGroup';
import Supplier from './../../../../models/Supplier';
import AnchorButton from '../../../navigation/AnchorButton';
import ProductFlow from './../../../../models/ProductFlow';
import { getInputReadableDate } from '../../../../utils/DateUtil';
import { tableHeader } from './../../../../utils/CollectionUtil';
class State {
    transaction: Transaction = new Transaction();
    selectedProduct: Product | undefined = undefined;
}

class TransactionIn extends BaseComponent {
    state: State = new State();
    constructor(props: any) {
        super(props, true);
    }

    componentDidMount() {
        this.validateLoginStatus();
        this.validateTransactionFromProps();
        document.title = "Transaksi Masuk";
    }
    validateTransactionFromProps = () => {
        if (!this.props.location.state) {
            return;
        }
        const transaction = this.props.location.state.transaction;
        if (transaction) {
            this.setState({ transaction: Object.assign(new Transaction(), transaction) });
        }
    }
    setSupplier = (supplier: Supplier) => {
        const transaction = this.state.transaction;
        transaction.supplier = supplier;
        this.setTransaction(transaction);
    }
    setTransaction = (transaction: Transaction) => {
        this.setState({ transaction: transaction });
    }
    setProduct = (product: Product) => {
        this.setState({ selectedProduct: product });
    }
    addToCart = (product: Product) => {
        this.showConfirmation("Add To Cart?")
            .then((ok) => {
                if (!ok) return;
                const transaction = this.state.transaction;
                transaction.addProductToFlow(product);
                this.setState({ transaction: transaction, selectedProduct: undefined });
            })
    }
    updateProductFlow = (e: ChangeEvent) => {
        const target: HTMLInputElement = e.target as HTMLInputElement;
        const index: string | undefined = target.dataset['index'];
        let value: any = target.value;

        if (!index) return;

        const transaction: Transaction = this.state.transaction;
        if (target.type == "date") {
            value = new Date(value);
        }
        transaction.setProductFlowValue(parseInt(index), target.name, value);
        this.setTransaction(transaction);
    }
    removeProductFlow = (index: number) => {

        this.showConfirmationDanger("Delete Product?").then((ok) => {
            if (!ok) return;
            const transaction: Transaction = this.state.transaction;
            transaction.removeProductFlow(index);
            this.setTransaction(transaction);
        });
    }
    submit = (e) => {
        e.preventDefault();
        this.showConfirmation("Continue Transaction?")
            .then((ok) => {
                if (!ok) return;
                this.props.history.push({
                    pathname: "/transaction/productin/confirm",
                    state: { transaction: this.state.transaction }
                })
            })
    }
    updateTransactionDate = (e: ChangeEvent) => {
        const target: HTMLInputElement = e.target as HTMLInputElement;

        const transaction: Transaction = this.state.transaction;
        transaction.transactionDate = new Date(target.value);
        this.setTransaction(transaction);
    }
    render() {
        const selectedProduct: Product | undefined = this.state.selectedProduct;
        const transaction: Transaction = this.state.transaction;
        return (
            <div id="TransactionIn" className="container-fluid">
                <h2>Transaction :: IN </h2>
                <div className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.displayName}</strong>
                    <p>
                        <i className="fas fa-map-marker-alt" style={{marginRight:'5px'}}/>
                        {this.getMasterHealthCenter().name}
                    </p>
                </div>
                <div className="row">
                    <div className="col-6"><ProductForm setProduct={this.setProduct} /></div>
                    <div className="col-6"><SupplierForm setSupplier={this.setSupplier} /></div>
                </div>
                <Card title="Selected Product">
                    {selectedProduct ?
                        <SelectedProductDetail addToCart={this.addToCart} product={selectedProduct} /> :
                        <i>No Product</i>
                    }
                </Card>
                <p/>
                <Card title="Product List">
                    <form onSubmit={this.submit}>
                        <table className="table table-striped"  >
                            {tableHeader("No", "Name", "Qty", "Unit", "Pice @Unit", "EXP Date", "Action")}
                            <tbody>
                                {transaction.productFlows.map((productFlow, i) => {
                                    return <ProductFlowItemInput
                                        updateProductFlow={this.updateProductFlow}
                                        productFlow={productFlow} key={"PF_ITEM_" + i}
                                        index={i} remove={this.removeProductFlow} />
                                })}
                            </tbody>
                        </table>
                        {transaction.supplier && transaction.productFlowCount() > 0 ?
                            <Fragment>
                                <FormGroup label="Transaction Date">
                                    <input className="form-control" type="date"
                                        value={getInputReadableDate(transaction.transactionDate)}
                                        onChange={this.updateTransactionDate} />
                                </FormGroup>
                                <input type="submit" className="btn btn-success" />
                            </Fragment> : null
                        }
                    </form>
                </Card>
                <p />
            </div>
        )
    }
}

const ProductFlowItemInput = (props: { productFlow: ProductFlow, updateProductFlow(e: ChangeEvent): void, index: number, remove(index: number): void }) => {
    const product: Product = props.productFlow.product;
    return (<tr>
        <td>{props.index + 1}</td>
        <td>{product.name}</td>
        <td><input required min={1} type="number" className="form-control" name="count" data-index={props.index} onChange={props.updateProductFlow}
            value={props.productFlow.count} />
        </td>
        <td>{product.unit?.name}</td>
        <td>
            <input required type="number" className="form-control" name="price" data-index={props.index} onChange={props.updateProductFlow}
                value={props.productFlow.price} />
        </td>
        <td>
            <input required type="date" className="form-control" name="expiredDate" data-index={props.index} onChange={props.updateProductFlow}
                value={getInputReadableDate(props.productFlow.expiredDate ?? new Date())} />
        </td>
        <td><AnchorButton iconClassName="fas fa-times" className="btn btn-danger" onClick={(e) => {
            props.remove(props.index);
        }} /></td>
    </tr>)
}

const SelectedProductDetail = (props: { product: Product, addToCart(product: Product): void }) => {
    return (
        <div>
            <FormGroup label="Name">{props.product.name}</FormGroup>
            <FormGroup label="Unit">{props.product.unit?.name}</FormGroup>
            <FormGroup label="Utility Tool">{props.product.utilityTool == true ? "Yes" : "No"}</FormGroup>
            <FormGroup label="Description">{props.product.description}</FormGroup>
            <AnchorButton className="btn btn-dark" iconClassName="fas fa-plus" onClick={(e) => props.addToCart(props.product)}>Add To Cart</AnchorButton>
        </div>
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(TransactionIn))