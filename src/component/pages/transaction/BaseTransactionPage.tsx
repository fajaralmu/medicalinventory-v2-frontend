import React from 'react'
import BaseComponent from './../../BaseComponent';
import MasterDataService from './../../../services/MasterDataService';
import InventoryService from './../../../services/InventoryService';
import Transaction from './../../../models/Transaction';
import { ChangeEvent, Fragment } from 'react';
import FormGroup from './../../form/FormGroup';
import { getInputReadableDate } from '../../../utils/DateUtil';
export default class BaseTransactionPage extends BaseComponent {

    inventoryService: InventoryService;
    masterDataService: MasterDataService;
    constructor(props, title:string) {
        super(props, true);
        this.inventoryService = this.getServices().inventoryService;
        this.masterDataService = this.getServices().masterDataService;
        document.title = title;
    }

    setTransaction = (transaction: Transaction) => {
        this.setState({ transaction: transaction });
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
    removeProductFlow = (index: number) => {

        this.showConfirmationDanger("Delete Product?").then((ok) => {
            if (!ok) return;
            const transaction: Transaction = this.state.transaction;
            transaction.removeProductFlow(index);
            this.setTransaction(transaction);
        });
    }
    removeAll = () => {
        this.showConfirmationDanger("Remove All?")
            .then((ok) => {
                if (!ok) return;
                const transaction: Transaction = this.state.transaction;
                transaction.productFlows = [];
                this.setTransaction(transaction);
            })
    }
    componentDidMount() {
        this.validateLoginStatus(); 
        this.validateTransactionFromProps(); 
        this.didMountCallback();
    }
    didMountCallback = () => {

    }
    updateTransactionGeneralField = (e: any) => {
        const name = e.target.name;
        let value;
        if (e.target.type == 'date') {
            value = new Date(e.target.value);
        } else {
            value = e.target.value;
        }
        const transaction: Transaction = this.state.transaction;
        transaction[name] = value;
        this.setTransaction(transaction);
    }

    updateProductFlow = (e: ChangeEvent) => {
        const target: HTMLInputElement = e.target as HTMLInputElement;
        const index: string | undefined = target.dataset['index'];
        let value: any = target.value;

        if (!index) return;

        const transaction: Transaction = this.state.transaction;
        if (target.type == "date") {
            value = new Date(value);
        } else if (target.type == 'checkbox') {
            value = target.checked == true;
        }
        transaction.setProductFlowValue(parseInt(index), target.name, value);
        this.setTransaction(transaction);
    }

    buttonSubmitTransaction = (transaction: Transaction) => {
        return (
            <Fragment>
                <FormGroup label="Transaction Date">
                    <input className="form-control" name="transactionDate" type="date"
                        value={getInputReadableDate(transaction.transactionDate)}
                        onChange={this.updateTransactionGeneralField} />
                </FormGroup>
                <FormGroup label="Description">
                    <textarea value={transaction.description} name="description"
                        onChange={this.updateTransactionGeneralField}
                        className="form-control" />
                </FormGroup>
                <input type="submit" className="btn btn-success" />
            </Fragment>
        )
    }
}