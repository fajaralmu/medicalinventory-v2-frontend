import React, { Component } from 'react';
import BaseComponent from './../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import Card from '../../container/Card';
import InventoryService from './../../../services/InventoryService';
import InventoryData from './../../../models/InventoryData';
import WebResponse from './../../../models/WebResponse';
import SimpleWarning from '../../alert/SimpleWarning';
import Configuration from './../../../models/Configuration';
import { beautifyNominal } from '../../../utils/StringUtil';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import { setInventoryData } from '../../../redux/actionCreators';

class State {
    inventoryData: InventoryData = new InventoryData();
    configuration:Configuration = new Configuration();
}
class DashboardInfo extends BaseComponent {

    state: State = new State();
    inventoryService: InventoryService;
    constructor(props) {
        super(props, true);
        this.inventoryService = this.getServices().inventoryService;
    }

    componentDidMount() {
        this.validateLoginStatus(this.loadInventoriesData);

    }
    inventoriesDataLoaded = (response: WebResponse) => {
        this.setState({ inventoryData: response.inventoryData, configuration: response.configuration },
            
        ()=> {
            this.props.setInventoryData(response)
        });
    }
    loadInventoriesData = () => {
        if (this.getInventoryData()) {
            this.setState({ inventoryData: this.getInventoryData(), configuration: this.getInventoryConfig() });
            return;
        }
        this.commonAjaxWithProgress(
            this.inventoryService.getInventoriesData,
            this.inventoriesDataLoaded,
            this.showCommonErrorAlert,

        )
    }

    render() {

        const totalItems = this.state.inventoryData.totalItemsSum;
        const totalWillExpired = this.state.inventoryData.totalWillExpiredSum;
        const totalExpired = this.state.inventoryData.totalExpiredSum;
        return (
            <div id="DashboardInfo" className="container-fluid">
                <h2>Info</h2>
                <div className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.displayName}</strong>
                </div>
                <div className="row">
                    {/* <div className="col-4">
                        <Card className="bg-info text-light" title="Transaction Today">
                            
                        </Card>
                    </div> */}
                    <div className="col-4">
                        <Card className="bg-info text-light" title="Total Items">
                            <h3 className="text-center"> {beautifyNominal(totalItems)}</h3>
                        </Card>
                    </div>
                    <div className="col-4">
                        <Card className="bg-warning" title="Product Will Expired">
                            <h3 className="text-center">{beautifyNominal(totalWillExpired)}</h3>
                        </Card>
                    </div>

                    <div className="col-4">
                        <Card className="bg-danger text-warning" title="Product Expired">
                            <h3 className="text-center">{beautifyNominal(totalExpired)}</h3>
                        </Card>
                    </div>
                    <div className="col-10">
                        <p/>
                        <SimpleWarning>
                            <p>Expire warning: {this.state.configuration.expiredWarningDays} days</p>
                        </SimpleWarning>
                        <AnchorWithIcon iconClassName="fas fa-sync-alt" onClick={this.loadInventoriesData} >Reload</AnchorWithIcon>
                    </div> 
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch: Function) => ({
    setInventoryData: (payload: WebResponse) => dispatch(setInventoryData(payload)), 
});
export default withRouter(
    connect(
        mapCommonUserStateToProps,
        mapDispatchToProps,
    )(DashboardInfo)
)
