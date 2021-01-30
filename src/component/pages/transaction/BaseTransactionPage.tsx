
import BaseComponent from './../../BaseComponent';
import MasterDataService from './../../../services/MasterDataService';
import InventoryService from './../../../services/InventoryService';
import Transaction from './../../../models/Transaction';
import { ChangeEvent } from 'react';
export default class BaseTransactionPage extends BaseComponent {

    inventoryService: InventoryService;
    masterDataService: MasterDataService;
    constructor(props) {
        super(props, true);
        this.inventoryService = this.getServices().inventoryService;
        this.masterDataService = this.getServices().masterDataService;
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
    updateTransactionDate = (e: ChangeEvent) => {
        const target: HTMLInputElement = e.target as HTMLInputElement;

        const transaction: Transaction = this.state.transaction;
        transaction.transactionDate = new Date(target.value);
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
        }
        transaction.setProductFlowValue(parseInt(index), target.name, value);
        this.setTransaction(transaction);
    }
}