

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BasePage from '../../../BasePage';
import { greeting } from '../../../../utils/StringUtil';
import InputDateTime from './../../../form/InputDateTime';
class State {
    date:Date = new Date();
}

class DashboardMain extends BasePage {
    state:State = new State();
    constructor(props: any) {
        super(props, "Dasbor", true);
    }

    render() {
        return (
            <div  className="section-body container-fluid">
                <h2>Dasbor</h2>
                <div className="alert alert-info">
                    {greeting()}, <strong>{this.getLoggedUser()?.displayName}</strong><hr/>
                    {this.state.date.toLocaleDateString()} - {this.state.date.toLocaleTimeString()}
                    <InputDateTime onChange={(d)=>{this.setState({date:d})}} value={this.state.date} />
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(DashboardMain))