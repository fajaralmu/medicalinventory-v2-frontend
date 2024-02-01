import { resolve } from 'inversify-react';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import WebResponse from '../../../../models/common/WebResponse';
import ProductFlow from '../../../../models/ProductFlow';
import Transaction from '../../../../models/Transaction';
import TransactionService from '../../../../services/TransactionService';
import SimpleError from '../../../alert/SimpleError';
import BasePage from '../../../BasePage';
import Modal from '../../../container/Modal';
import FormGroup from '../../../form/FormGroup';
import Spinner from '../../../loader/Spinner';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
interface State {
  transaction?: Transaction;
  transactionCode?: string;
  dataNotFound: boolean;
  loading: boolean;
}
class TransactionRelatedRecord extends BasePage<any, State> {
  @resolve(TransactionService)
  private transactionService: TransactionService;
  constructor(props: any) {
    super(props, 'Pemetaan Stok Transaksi');
    this.state = {
      transaction: undefined,
      transactionCode: undefined,
      dataNotFound: false,
      loading: false
    }
  }
  componentDidMount() {
    this.scrollTop();
    this.validateTransactionFromProps();
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
    const { loading, transaction, dataNotFound, transactionCode } = this.state;
    return (
      <div id="TransactionRelatedRecord" className="container-fluid section-body" >
        {this.titleTag()}
        <div className="row">
          <form className="col-md-6" onSubmit={this.onSubmit}>
            <Modal title="Cari kode transaksi pengadaan"
              footerContent={
                <>
                  <AnchorWithIcon
                    iconClassName="fas fa-list"
                    attributes={{ target: '_blank' }}
                    to="/management/transaction"
                    className="btn btn-secondary"
                    label="Daftar Record Transaksi"
                  />
                  <input type="submit" className="btn btn-primary" value="Cari" />
                </>
              }
            >
              <FormGroup label="Kode">
                <input
                  value={transactionCode ?? ''}
                  required
                  onChange={this.handleInputChange}
                  type="text"
                  name="transactionCode"
                  placeholder="Kode Transaksi"
                  className="form-control"
                />
              </FormGroup>
            </Modal>
          </form>
          <div className="col-md-6"></div>
          <div className="col-md-12">
            {loading ?
              <Spinner /> :
              <Fragment>
                <SimpleError show={dataNotFound === true} >Transaksi tidak ditemukan</SimpleError>
                <TransactionData show={transaction != undefined} transaction={transaction} />
              </Fragment>
            }
          </div>
        </div>
      </div>
    );
  }
}
const TransactionData = (props: { transaction: Transaction | undefined, show: boolean }) => {
  if (props.show === false || !props.transaction) {
    return null;
  }
  const { transaction } = props;
  const productFlows = transaction.productFlows ? transaction.productFlows : [];
  return (
    <Modal title="Transaction Data">
      <div className="row">
        <TransactionInfo transaction={transaction} />
        <div className="col-md-12">
          <h3>Products</h3>
          <table className="table xtable-striped">
            <thead>
              <tr>
                <th>No</th>
                <th colSpan={4}>Name</th>
                <th>Qty</th>
                <th>Trans. Code</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {productFlows.map((item, i) => {
                const refItemsLv1 = item.referencingItems ?? [];
                return (
                  <Fragment key={`main-pf-${i}`}>
                    <tr>
                      <td children={i + 1} />
                      <td colSpan={4}>
                        Id: {item.id}
                        <br />{item.product?.name} | {item.product?.unit?.name}
                        <br />used: {item.usedCount}, available: {item.count - item.usedCount}
                      </td>
                      <td>{item.count}</td>
                      <td>
                        <span>{item.transaction?.code}</span>
                        <br />
                        <TransTypeLabel type={item.transaction?.type} />
                      </td>
                      <td>{transactionDateTime(item.transaction)}</td>
                    </tr>
                    {
                      refItemsLv1 &&
                      (
                        <tr>
                          <td />
                          <td style={{ fontSize: '0.7em' }} colSpan={7} >
                            Usage List (total: <strong>{refItemsLv1.reduce((partial, item) => partial + item.count, 0)})</strong>
                          </td>
                        </tr>
                      )
                    }
                    {refItemsLv1.map((rfItemlv1, r) => {
                      const refItemsLv2 = rfItemlv1.referencingItems ?? [];
                      return (
                        <Fragment key={`ref-pf-${r}-${i}`}>
                          <tr>
                            <td /><td children={r + 1} />
                            <td colSpan={3}>Id: {rfItemlv1.id}</td>
                            <td>{rfItemlv1.count}</td>
                            <td>
                              <span>{rfItemlv1.transaction?.code}</span>
                              <br />
                              <TransTypeLabel type={rfItemlv1.transaction?.type} />
                            </td>
                            <td>{transactionDateTime(rfItemlv1.transaction)}</td>
                          </tr>
                          {
                            refItemsLv2.length > 0 &&
                            (
                              <tr>
                                <td colSpan={2} />
                                <td style={{ fontSize: '0.7em' }} colSpan={6}>
                                  Usage List (total: {refItemsLv2.reduce((partial, item) => partial + item.count, 0)})
                                </td>
                              </tr>
                            )
                          }
                          {refItemsLv2.map((rfItemlv2, r2) => {
                            return (
                              <Fragment key={`ref-pf2-${r}-${i}-${r2}`}>
                                <tr >
                                  <td colSpan={2} /><td children={r2 + 1} />
                                  <td colSpan={2}>Id: {rfItemlv2.id}</td>
                                  <td>{rfItemlv2.count}</td>
                                  <td>
                                    <span>{rfItemlv2.transaction?.code}</span>
                                    <br />
                                    <TransTypeLabel type={rfItemlv2.transaction?.type} />
                                  </td>
                                  <td>{transactionDateTime(rfItemlv2.transaction)}</td>
                                </tr>

                              </Fragment>
                            )
                          })}

                        </Fragment>
                      )
                    })}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

const TransTypeLabel = (props: {type: 'TRANS_IN' | 'TRANS_OUT' | 'TRANS_OUT_TO_WAREHOUSE' | undefined}) => {
  let classN = '';
  switch (props.type) {
    case 'TRANS_IN':
      classN = 'badge-primary'
      break;
    case 'TRANS_OUT':
      classN = 'badge-secondary';
      break;
    case 'TRANS_OUT_TO_WAREHOUSE':
      classN = 'badge-warning';
      break;
    default:
      break;
  }
  return (
    <span className={`badge ${classN}`}>{props.type}</span>
  );
};

const TransactionInfo = (props: { transaction: Transaction }) => {
  const {
    id,
    code,
    transactionDate,
    type,
    customer,
    supplier,
    healthCenterDestination,
    user,
    description,
  } = props.transaction;
  const date = new Date(transactionDate ?? new Date()).toLocaleString('ID');
  return (
    <>
      <div className="col-md-6">
        <FormGroup label="Id Record" orientation='horizontal' children={id} />
        <FormGroup label="Kode" orientation='horizontal' children={code} />
        <FormGroup label="Tipe" orientation='horizontal' children={type} />
        <FormGroup label="Tanggal" orientation='horizontal' children={date} />
      </div>
      <div className="col-md-6">
        <FormGroup
          show={type === 'TRANS_OUT'}
          label="Pelanggan"
          orientation='horizontal'
          children={customer?.name}
        />
        <FormGroup
          show={type === 'TRANS_OUT_TO_WAREHOUSE'}
          label="Puskesmas"
          orientation='horizontal'
          children={healthCenterDestination?.name}
        />
        <FormGroup
          show={type === 'TRANS_IN'}
          label="Pemasok"
          orientation='horizontal'
          children={supplier?.name}
        />
        <FormGroup
          label="User"
          orientation='horizontal'
          children={user?.displayName}
        />
      </div>
      <div className="col-md-12">
        <div className="alert alert-info">
          <h5>Note:</h5>
          {description}
        </div>
      </div>
    </>
  );
};

const transactionDateTime = (transaction?: Transaction) => {
  if (!transaction || !transaction.transactionDate) return null;
  const date = new Date(transaction.transactionDate);
  return date.toLocaleDateString('ID') + ' ' + date.toLocaleTimeString();
};

export default withRouter(connect(
  mapCommonUserStateToProps,
)(TransactionRelatedRecord));
