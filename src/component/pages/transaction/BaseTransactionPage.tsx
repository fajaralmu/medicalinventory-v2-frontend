import { resolve } from 'inversify-react';
import React, { ChangeEvent, Fragment } from 'react';
import Transaction from './../../../models/Transaction';
import BasePage from './../../BasePage';
import FormGroup from './../../form/FormGroup';
import InputDateTime from './../../form/InputDateTime';
import MasterDataService from './../../../services/MasterDataService';
import InventoryService from './../../../services/InventoryService';

export default class BaseTransactionPage extends BasePage<any, any> {
  @resolve(MasterDataService)
  protected masterDataService: MasterDataService;
  @resolve(InventoryService)
  protected inventoryService: InventoryService;

  constructor(props, title: string) {
    super(props, title);
  }

  setTransaction = (transaction: Transaction) => {
    this.setState({ transaction });
  }
  validateTransactionFromProps = () => {
    if (!this.props.location.state) {
      return;
    }
    const { transaction } = this.props.location.state;
    if (transaction) {
      this.setState({ transaction: Object.assign(new Transaction(), transaction) });
    }
  }
  removeProductFlow = (index: number) => {
    this.showConfirmationDanger("Delete Product?").then((ok) => {
      if (!ok) return;
      const { transaction } = this.state;
      transaction.removeProductFlow(index);
      this.setTransaction(transaction);
    });
  }
  removeAll = () => {
    this.showConfirmationDanger("Remove All?")
      .then((ok) => {
        if (!ok) return;
        const { transaction } = this.state;
        transaction.productFlows = [];
        this.setTransaction(transaction);
      })
  }
  componentDidMount() {
    this.scrollTop();
    this.validateTransactionFromProps();
    this.didMountCallback();
  }
  didMountCallback = () => {

  }
  updateTransactionGeneralField = (e: any) => {
    const { name } = e.target;
    let value;
    if (e.target.type === 'date') {
      value = new Date(e.target.value);
    } else {
      value = e.target.value;
    }
    const transaction: Transaction = this.state.transaction;
    transaction[name] = value;
    this.setTransaction(transaction);
  }

  updateProductFlow = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const index = target.dataset['index'];
    let value: any = target.value;

    if (!index) return;

    const transaction: Transaction = this.state.transaction;
    if (target.type === "date") {
      value = new Date(value);
    } else if (target.type === 'checkbox') {
      value = target.checked === true;
    }
    transaction.setProductFlowValue(parseInt(index), target.name, value);
    this.setTransaction(transaction);
  }

  updateTransactionDate = (date: Date) => {
    const { transaction } = this.state;
    transaction.transactionDate = date;
    this.setTransaction(transaction);
  }

  buttonSubmitTransaction = (transaction: Transaction) => {
    const transactionDate = transaction.transactionDate ?? new Date();
    return (
      <Fragment>
        <FormGroup label="Tanggal">
          {transactionDate.toLocaleDateString('ID')} - {transactionDate.toLocaleTimeString()}
          <InputDateTime onChange={this.updateTransactionDate} value={transactionDate ?? new Date()} />
        </FormGroup>
        <FormGroup label="Catatan">
          <textarea
            name="description"
            value={transaction.description ?? ''}
            onChange={this.updateTransactionGeneralField}
            className="form-control"
          />
        </FormGroup>
        <input type="submit" className="btn btn-success" />
      </Fragment>
    )
  }
}