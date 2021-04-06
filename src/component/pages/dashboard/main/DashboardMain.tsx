

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BasePage from '../../../BasePage';
import { greeting } from '../../../../utils/StringUtil';


class DashboardMain extends BasePage {
    constructor(props: any) {
        super(props, "Dasbor", true);
    }

    render() {
        return (
            <div  className="section-body container-fluid">
                <h2>Dasbor</h2>
                <div className="alert alert-info">
                    {greeting()}, <strong>{this.getLoggedUser()?.displayName}</strong><hr/>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(DashboardMain))