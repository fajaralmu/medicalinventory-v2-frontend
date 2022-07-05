

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BasePage from '../../BasePage';

class InventoryMain extends BasePage<any, any> {
    constructor(props) {
        super(props, "Persediaan");
    }

    render() {
        return (
            <div id="InventoryMain" className="container-fluid section-body">
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
)(InventoryMain))