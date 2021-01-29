


import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseComponent from './../../../BaseComponent';
import SupplierForm from './SupplierForm';
import ProductForm from '../ProductForm';


class TransactionIn extends BaseComponent {
    constructor(props: any) {
        super(props, true);
    }

    componentDidMount() {
        this.validateLoginStatus();
        document.title = "Transaksi Masuk";
    }

    render() {
        return (
            <div id="TransactionIn" className="container-fluid">
                <h2>Transaction :: IN</h2>
                <div className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.displayName}</strong>
                </div>
                <div className="row">
                    <div className="col-6"><ProductForm /></div>
                    <div className="col-6"><SupplierForm /></div>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(TransactionIn))