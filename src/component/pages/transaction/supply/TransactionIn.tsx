


import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import Product from '../../../../models/Product';
import ProductFlow from '../../../../models/ProductFlow';
import Supplier from '../../../../models/Supplier';
import Transaction from '../../../../models/Transaction';
import { tableHeader } from '../../../../utils/CollectionUtil';
import { getInputReadableDate } from '../../../../utils/DateUtil';
import Card from '../../../container/Card';
import FormGroup from '../../../form/FormGroup';
import AnchorButton from '../../../navigation/AnchorButton';
import BaseTransactionPage from '../BaseTransactionPage';
import ProductFormV2 from '../ProductFormV2';
import { beautifyNominal } from './../../../../utils/StringUtil';
import SupplierFormV2 from './SupplierFormV2';

class State {
  transaction: Transaction = new Transaction();
  selectedProduct: Product | undefined = undefined;
}

class TransactionIn extends BaseTransactionPage {
  state: State = new State();
  constructor(props: any) {
    super(props, "Suplai Pasokan");
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
    const transaction = this.state.transaction;
    transaction.addProductToFlow(product);
    this.setState({ transaction: transaction, selectedProduct: undefined });
  }

  submit = (e) => {
    e.preventDefault();
    if (!this.state.transaction.supplier || this.state.transaction.productFlowCount() == 0) {
      return;
    }
    this.showConfirmation("Lanjutkan Transaksi?")
      .then((ok) => {
        if (!ok) return;
        this.props.history.push({
          pathname: "/transaction/productin/confirm",
          state: { transaction: this.state.transaction }
        })
      })
  }

  render() {
    const { selectedProduct, transaction } = this.state;
    const { productFlows } = transaction;

    // total
    const prices = productFlows.map((item) => item.price * item.count);
    const totalPrices = prices.reduce((prev, next) => prev + next, 0);
    const qtys = productFlows.map((item) => parseInt(item.count.toString() ?? 0));
    const totalQty = qtys.reduce((prev, next) => prev + next, 0);
    // console.debug("transaction.supplier: ", transaction.supplier);
    return (
      <div className="container-fluid section-body">
        {this.titleTag()}
        <div className="alert alert-info">
          {this.userGreeting()}
          <p />
          <FormGroup label="Lokasi">
            <span className="form-control" >{this.getMasterHealthCenter().name} </span>
          </FormGroup>
        </div>
        <div className="row">
          <div className="col-6"><ProductFormV2 setProduct={this.setProduct} /></div>
          <div className="col-6"><SupplierFormV2 setSupplier={this.setSupplier} /></div>
        </div>
        <Card title="Rincian Produk">
          {selectedProduct ?
            <SelectedProductDetail addToCart={this.addToCart} product={selectedProduct} /> :
            <i>Tidak ada data</i>
          }
        </Card>
        <p />
        <Card title="Daftar Produk">
          <form onSubmit={this.submit}>
            <table className="table table-striped"  >
              {tableHeader("No", "Nama", "Qty", "Unit", "Harga @Unit", "Harga", "Generik", "Kadaluarsa", "Batch", "Opsi")}
              <tbody>
                {productFlows.map((productFlow, i) => {
                  return (
                    <ProductFlowItemInput
                      updateProductFlow={this.updateProductFlow}
                      productFlow={productFlow}
                      key={"PF_ITEM_" + i}
                      index={i}
                      remove={this.removeProductFlow}
                    />
                  );
                })}
                <tr>
                  <td colSpan={2} >
                    <AnchorButton
                      show={transaction.productFlowCount() > 0}
                      onClick={this.removeAll}
                      className="btn btn-danger"
                      iconClassName="fas fa-times"
                    >
                      Remove All
                    </AnchorButton>
                  </td>
                  <td>{beautifyNominal(totalQty)}</td>
                  <td colSpan={2} />
                  <td colSpan={2}>
                    {beautifyNominal(totalPrices)}
                  </td>
                  <td colSpan={2}>
                    {/* BLANK */}
                  </td>
                </tr>
              </tbody>
            </table>
            {
              transaction.supplier && transaction.productFlowCount() > 0 &&
              this.buttonSubmitTransaction(transaction)
            }
          </form>
        </Card>
        <p />
      </div>
    )
  }
}

const ProductFlowItemInput = (props: {
  productFlow: ProductFlow,
  updateProductFlow: (e: ChangeEvent) => any,
  index: number,
  remove: (index: number) => any,
}) => {
  const product: Product = props.productFlow.product;
  return (<tr>
    <td>{props.index + 1}</td>
    <td>{product.name}</td>
    <td>
      <input
        required
        min={1}
        type="number"
        className="form-control"
        name="count"
        data-index={props.index}
        onChange={props.updateProductFlow}
        value={props.productFlow.count}
      />
    </td>
    <td>{product.unit?.name}</td>
    <td>
      <input
        required
        type="number"
        step={0.001}
        className="form-control"
        name="price"
        data-index={props.index}
        onChange={props.updateProductFlow}
        value={props.productFlow.price}
      />
    </td>
    <td>
      {beautifyNominal(props.productFlow.count * props.productFlow.price)}
    </td>
    <td>
      <input
        type="checkbox"
        className="form-control"
        name="generic"
        data-index={props.index}
        onChange={props.updateProductFlow}
        checked={props.productFlow.generic == true}
      />
    </td>
    <td>
      <input
        required
        type="date"
        className="form-control"
        name="expiredDate"
        data-index={props.index}
        onChange={props.updateProductFlow}
        value={getInputReadableDate(props.productFlow.expiredDate ?? new Date())}
      />
    </td>
    <td>
      <input
        required
        type="text"
        className="form-control"
        name="batchNum"
        data-index={props.index}
        onChange={props.updateProductFlow}
        value={props.productFlow.batchNum}
      />
    </td>
    <td>
      <AnchorButton
        iconClassName="fas fa-times"
        className="btn btn-danger"
        onClick={(e) => { props.remove(props.index); }}
      />
    </td>
  </tr>)
}

const SelectedProductDetail = (props: { product: Product, addToCart(product: Product): void }) => {
  return (
    <div>
      <FormGroup label="Nama">{props.product.name}</FormGroup>
      <FormGroup label="Unit">{props.product.unit?.name}</FormGroup>
      <FormGroup label="Alat Kesehatan">{props.product.utilityTool == true ? "Yes" : "No"}</FormGroup>
      <FormGroup label="Deskripsi">{props.product.description}</FormGroup>
      <AnchorButton
        className="btn btn-dark"
        iconClassName="fas fa-plus"
        onClick={(e) => props.addToCart(props.product)}
      >
        Add To Cart
      </AnchorButton>
    </div>
  )
}

export default withRouter(connect(
  mapCommonUserStateToProps
)(TransactionIn))