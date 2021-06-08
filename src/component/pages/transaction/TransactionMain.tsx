

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BasePage from '../../BasePage';
import { greeting } from '../../../utils/StringUtil';


class TransactionMain extends BasePage {
    constructor(props: any) {
        super(props, "Transaksi", true);
    }

    render() {
        return (
            <div id="TransactionMain" className="container-fluid section-body">
                {this.titleTag()}
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