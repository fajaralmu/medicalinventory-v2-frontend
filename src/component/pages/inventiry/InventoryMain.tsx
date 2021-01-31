

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseMainMenus from '../../layout/BaseMainMenus';


class InventoryMain extends BaseMainMenus {
    constructor(props: any) {
        super(props, "Inventory", true);
    }

    render() {
        return (
            <div id="InventoryMain" className="container-fluid">
                <h2>Dashboard</h2>
                <div className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.displayName}</strong>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(InventoryMain))