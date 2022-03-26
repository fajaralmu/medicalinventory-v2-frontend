

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BasePage from '../../../BasePage';

class DashboardMain extends BasePage {
    constructor(props: any) {
        super(props, "Dasbor");
    }

    render() {
        return (
            <div  className="section-body container-fluid">
                {this.titleTag()}
                <div className="alert alert-info">
                    {this.userGreeting()}
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(DashboardMain))