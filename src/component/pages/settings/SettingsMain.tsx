

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BasePage from './../../BasePage';

class SettingsMain extends BasePage 
{
    constructor(props:any){
        super(props, "Settings");
    }
    render(){
        return (
            <div id="SettingsMain" className="container-fluid section-body">
               {this.titleTag()}
                <div className="alert alert-info">
                   {this.userGreeting()}
                </div>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
  })
  

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
  )(SettingsMain))