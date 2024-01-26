

import { resolve } from 'inversify-react';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import WebResponse from '../../../../models/common/WebResponse';
import ProductFlow from '../../../../models/ProductFlow';
import Transaction from '../../../../models/Transaction';
import TransactionService from '../../../../services/TransactionService';
import { beautifyNominal } from '../../../../utils/StringUtil';
import Card from '../../../container/Card';
import FormGroup from '../../../form/FormGroup';
import AnchorButton from '../../../navigation/AnchorButton';
import BasePage from './../../../BasePage';

interface State { transaction?: Transaction }
class TransactionInConfirmation extends BasePage<any, State> {
  @resolve(TransactionService)
  private transactionService: TransactionService;
  constructor(props: any) {
    super(props, "Konfirmasi Transaksi");
    this.state = {
      transaction: undefined
    };
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
    const { transaction } = this.state;
    if (!transaction) {
      return null;
    }
    const { productFlows, code, supplier, transactionDate, description } = transaction;

    // total
    const prices = productFlows.map((item) => item.price * item.count);
    const totalPrices = prices.reduce((prev, next) => prev + next, 0);
    const qtys = productFlows.map((item) => parseInt(item.count.toString() ?? 0));
    const totalQty = qtys.reduce((prev, next) => prev + next, 0);
    return (
      <div id="TransactionMain" className="container-fluid section-body">
        {this.titleTag()}
        <div className="alert alert-info">
          Pastikan bahwa data transaksi telah sesuai
        </div>
        <Card title="Information">
          {
            code &&
            <FormGroup label="Kode">
              {transaction.code}
            </FormGroup>
          }
          <FormGroup label="Tanggal">
            {new Date(transactionDate).toString()}
          </FormGroup>
          <FormGroup label="Pemasok">
            {supplier?.name}
          </FormGroup>
          <FormGroup label="Catatan"> {description}  </FormGroup>
          <AnchorButton
            style={{ marginRight: '5px' }}
            onClick={this.back}
            iconClassName="fas fa-angle-left"
            children="Kembali"
          />
          <AnchorButton
            show={code === undefined}
            onClick={this.confirm}
            iconClassName="fas fa-check"
            className="btn btn-primary"
            children="Konfirmasi"
          />
        </Card>
        <p />
        <Card title="Product List">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>No</th><th>Nama</th><th>Qty</th><th>Unit</th><th>Generik</th><th>Harga @Unit</th><th>Harga Total</th><th>Kadaluarsa</th><th>Batch</th>
              </tr>
            </thead>
            <tbody>
              {productFlows.map((productFlow, i) => {
                return (
                  <ProductFlowRow productFlow={productFlow} index={i} key={`pf-tr-cnfm-${i}`} />
                )
              })}
              <tr>
                <td colSpan={2} />
                <td>{beautifyNominal(totalQty)}</td>
                <td colSpan={3} />
                <td colSpan={2}>{beautifyNominal(totalPrices)}</td>
              </tr>
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
  const { price, count, product, generic, expiredDate, batchNum } = productFlow;
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{product.name}</td>
      <td>{beautifyNominal(count)}</td>
      <td>{product.unit?.name}</td>
      <td>{generic ? "Yes" : "No"}</td>
      <td>{beautifyNominal(price)}</td>
      <td>{beautifyNominal(price * count)}</td>
      <td>{expiredDate ? new Date(expiredDate).toLocaleDateString("ID") : "-"}</td>
      <td>{batchNum}</td>
    </tr>)
}

export default withRouter(connect(
  mapCommonUserStateToProps
)(TransactionInConfirmation))