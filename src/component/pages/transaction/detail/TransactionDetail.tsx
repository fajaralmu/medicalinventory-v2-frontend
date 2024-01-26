import { resolve } from 'inversify-react';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import WebResponse from '../../../../models/common/WebResponse';
import Product from '../../../../models/Product';
import { tableHeader } from '../../../../utils/CollectionUtil';
import { beautifyNominal } from '../../../../utils/StringUtil';
import FormGroup from '../../../form/FormGroup';
import Spinner from '../../../loader/Spinner';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
import ProductFlow from './../../../../models/ProductFlow';
import Transaction from './../../../../models/Transaction';
import ReportService from './../../../../services/ReportService';
import TransactionService from './../../../../services/TransactionService';
import SimpleError from './../../../alert/SimpleError';
import BasePage from './../../../BasePage';
import Modal from './../../../container/Modal';
import PrintReceipt from './PrintReceipt';
class State {
  transaction?: Transaction;
  transactionCode?: string;
  dataNotFound: boolean;
  loading: boolean;
}
class TransactionDetail extends BasePage<any, State> {
  @resolve(TransactionService)
  private transactionService: TransactionService;
  constructor(props: any) {
    super(props, "Rincian Transaksi");
    this.state = {
      transaction: undefined,
      transactionCode: undefined,
      dataNotFound: false,
      loading: false,
    };
  }
  startLoading = () => this.setState({ loading: true });
  endLoading = () => this.setState({ loading: false });
  componentDidMount() {
    this.scrollTop();
    this.validateTransactionFromProps();
    document.title = "Transaction Detail";

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
  recordDeleted = (response: WebResponse) => {
    this.showInfo("Record has been successfully deleted")
    this.loadData();
  }
  recordNotDeleted = (e: any) => {
    console.error(e);
    this.showError("Cannot delete transaction " + this.state.transaction?.code
      + ", please delete all related stock/ product flow data");
  }
  deleteRecord = (e) => {
    if (!this.state.transaction) return;
    this.showConfirmationDanger("Delete Record with code: " + this.state.transaction?.code + "?").then(ok => {
      if (!ok) return
      this.commonAjax(
        this.transactionService.deleteTransactionByCode,
        this.recordDeleted,
        this.recordNotDeleted,
        this.state.transaction?.code
      )
    })
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
        {this.titleTag()}
        <div className="row">
          <form className="col-md-6" onSubmit={this.onSubmit}>
            <Modal title="Cari dengan kode"
              footerContent={
                <Fragment>
                  <AnchorWithIcon iconClassName="fas fa-list" attributes={{ target: '_blank' }} to="/management/transaction" className="btn btn-secondary" >Daftar Record Transaksi</AnchorWithIcon>
                  <input type="submit" className="btn btn-primary" value="Cari" />
                </Fragment>
              }>
              <FormGroup label="Kode">
                <input required onChange={this.handleInputChange} value={this.state.transactionCode ?? ''}
                  name="transactionCode" type="text" placeholder="Kode Transaksi" className="form-control" />
              </FormGroup>
            </Modal>
          </form>
          <div className="col-md-6"></div>
          <div className="col-md-12">
            {this.state.loading ?
              <Spinner /> :
              <Fragment>
                <SimpleError show={this.state.dataNotFound === true} >Transaksi tidak ditemukan</SimpleError>
                <TransactionData show={this.state.transaction != undefined} transaction={this.state.transaction} />

                <div className="btn-group">
                  <AnchorWithIcon
                    show={this.state.transaction != undefined}
                    onClick={this.deleteRecord}
                    iconClassName="fas fa-times"
                    className="btn btn-danger"
                  >
                    Hapus Transaksi
                  </AnchorWithIcon>
                  <PrintReceipt transactionCode={this.state.transaction?.code} />
                </div>
              </Fragment>
            }
          </div>
        </div>
      </div>
    )
  }

}
const TransactionData = (props) => {
  if (props.show === false) return null;
  const transaction: Transaction = props.transaction;
  const productFlows: ProductFlow[] = transaction.productFlows ? transaction.productFlows : [];
  const isTransOut = transaction.type === 'TRANS_OUT';
  const date = new Date(transaction.transactionDate ?? new Date()).toLocaleString("ID");
  // total
  const prices = productFlows.map((item) => item.price * item.count);
  const totalPrices = prices.reduce((prev, next) => prev + next, 0);
  const qtys = productFlows.map((item) => parseInt(item.count.toString() ?? 0));
  const totalQty = qtys.reduce((prev, next) => prev + next, 0);
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
            <FormGroup
              show={transaction.type === 'TRANS_OUT'}
              label="Pelanggan" orientation='horizontal'
              children={transaction.customer?.name}
            />
            <FormGroup
              show={transaction.type === 'TRANS_OUT_TO_WAREHOUSE'}
              label="Puskesmas"
              orientation='horizontal'
              children={transaction.healthCenterDestination?.name}
            />
            <FormGroup
              show={transaction.type === 'TRANS_IN'}
              label="Pemasok"
              orientation='horizontal'
              children={transaction.supplier?.name}
            />
          </Fragment>
          <FormGroup
            label="User"
            orientation='horizontal'
            children={transaction.user?.displayName}
          />

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
            {tableHeader(
              "No",
              "Id Record",
              "Nama",
              "Qty",
              "Unit",
              "Generic",
              "Kadaluarsa",
              "Batch",
              "Harga @Unit",
              "Total Harga",
              isTransOut ? "Id Stok" : "Used Qty"
            )}
            <tbody>
              {productFlows.map((pf, i) => {
                const product = pf.product ?? new Product();
                const price = pf.price;
                return (
                  <tr key={`pf-tr-${i}`}>
                    <td>{i + 1}</td>
                    <td>{pf.id}</td>
                    <td>{product.name} ({product.code})</td>
                    <td>{beautifyNominal(pf.count)}</td>
                    <td>{product.unit?.name}</td>
                    <td>{pf.generic ? 'Yes' : 'No'}</td>
                    <td>{pf.expiredDate ?

                      new Date(pf.expiredDate).toLocaleDateString("ID") : "-"}</td>
                    <td>{pf.batchNum}</td>
                    <td>{beautifyNominal(price)}</td>
                    <td>{beautifyNominal((price ?? 0) * (pf.count ?? 0))}</td>
                    <td>{isTransOut ?
                      pf.referenceProductFlow ?
                        pf.referenceProductFlow.id : "-" :
                      beautifyNominal(pf.usedCount)}
                    </td>
                  </tr>
                )
              })}
              <tr className="text-bolder">
                <td colSpan={3}>
                  {/* Total Qty */}
                </td>
                <td>
                  {beautifyNominal(totalQty)}
                </td>
                <td colSpan={4}>
                  {/* Total Harga */}
                </td>
                <td colSpan={2}>
                  {beautifyNominal(totalPrices)}
                </td>
              </tr>
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