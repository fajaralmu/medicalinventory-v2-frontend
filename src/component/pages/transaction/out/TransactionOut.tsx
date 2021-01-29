


import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseComponent from '../../../BaseComponent';
import CustomerForm from './CustomerForm';
import ProductForm from '../ProductForm';


class TransactionOut extends BaseComponent {
    constructor(props: any) {
        super(props, true);
    }

    componentDidMount() {
        this.validateLoginStatus();
        document.title = "Transaksi Keluar";
    }

    render() {
        return (
            <div id="TransactionOut" className="container-fluid">
                <h2>Transaction :: OUT</h2>
                <div className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.displayName}</strong>
                </div>
                <div className="row">
                    <div className="col-6"><ProductForm /></div>
                    <div className="col-6"><CustomerForm /></div>
                </div>

            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(TransactionOut))