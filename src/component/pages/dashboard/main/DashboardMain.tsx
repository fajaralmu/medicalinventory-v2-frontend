

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseMainMenus from '../../../layout/BaseMainMenus';
import { greeting } from '../../../../utils/StringUtil';


class DashboardMain extends BaseMainMenus {
    constructor(props: any) {
        super(props, "Dasbor", true);
    }

    render() {
        return (
            <div  className="section-body container-fluid">
                <h2>Dasbor</h2>
                <div className="alert alert-info">
                    {greeting()}, <strong>{this.getLoggedUser()?.displayName}</strong>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(DashboardMain))