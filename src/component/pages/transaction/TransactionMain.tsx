

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseMainMenus from '../../layout/BaseMainMenus';
import { greeting } from '../../../utils/StringUtil';


class TransactionMain extends BaseMainMenus {
    constructor(props: any) {
        super(props, "Transaction", true);
    }

    render() {
        return (
            <div id="TransactionMain" className="container-fluid section-body">
                <h2>Transaksi</h2>
                <div className="alert alert-info">
                    {greeting()}, <strong>{this.getLoggedUser()?.displayName}</strong><hr/>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(TransactionMain))