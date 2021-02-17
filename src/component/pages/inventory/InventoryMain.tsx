

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseMainMenus from '../../layout/BaseMainMenus';
import { greeting } from '../../../utils/StringUtil';


class InventoryMain extends BaseMainMenus {
    constructor(props: any) {
        super(props, "Inventory", true);
    }

    render() {
        return (
            <div id="InventoryMain" className="container-fluid section-body">
                <h2>Persediaan</h2>
                <div className="alert alert-info">
                    {greeting()}, <strong>{this.getLoggedUser()?.displayName}</strong>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(InventoryMain))