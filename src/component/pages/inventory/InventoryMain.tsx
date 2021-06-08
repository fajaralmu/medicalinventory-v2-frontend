

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BasePage from '../../BasePage';
import { greeting } from '../../../utils/StringUtil';


class InventoryMain extends BasePage {
    constructor(props: any) {
        super(props, "Persediaan", true);
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