import React, { Component } from 'react';
import BaseComponent from './../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import Card from '../../container/Card';
import InventoryService from './../../../services/InventoryService';
import InventoryData from '../../../models/stock/InventoryData';
import WebResponse from '../../../models/common/WebResponse';
import SimpleWarning from '../../alert/SimpleWarning';
import Configuration from './../../../models/Configuration';
import { beautifyNominal, greeting } from '../../../utils/StringUtil';
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
        this.setPageTitle("Info Persediaan");

    }
    inventoriesDataLoaded = (response: WebResponse) => {
        this.setState({ inventoryData: response.inventoryData, configuration: response.configuration },
            
        ()=> {
            this.props.setInventoryData(response)
        });
    }
    loadInventoriesData = (force:boolean = false) => {
        if (!force && this.getInventoryData()) {
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
        const totalSafe = totalItems - totalExpired - totalWillExpired;
        return (
            <div id="DashboardInfo" className="section-body container-fluid">
                <h2>Info</h2>
                <div className="alert alert-info">
                    {greeting()}, <strong>{this.getLoggedUser()?.displayName}</strong>
                </div>
                <div className="row">
                    {/* <div className="col-4">
                        <Card className="bg-info text-light" title="Transaction Today">
                            
                        </Card>
                    </div> */}
                    <div className="col-4">
                        <Card className="bg-success text-light" title="Stok Aman">
                            <h3 className="text-center"> {beautifyNominal(totalSafe)}</h3>
                        </Card>
                    </div>
                    <div className="col-4">
                        <Card className="bg-warning" title="Stok Akan Kadaluarsa">
                            <h3 className="text-center">{beautifyNominal(totalWillExpired)}</h3>
                        </Card>
                    </div>

                    <div className="col-4">
                        <Card className="bg-danger text-warning" title="Stok Kadaluarsa">
                            <h3 className="text-center">{beautifyNominal(totalExpired)}</h3>
                        </Card>
                    </div>
                    <div className="col-10">
                        <p/>
                        <SimpleWarning>
                            <p>Total Stok: <strong>{beautifyNominal(totalItems)}</strong></p>
                            <p>Peraingatan Kadaluarsa: {this.state.configuration.expiredWarningDays} hari</p>
                        </SimpleWarning>
                        <div className="btn-group">
                            <AnchorWithIcon iconClassName="fas fa-sync-alt" onClick={()=>this.loadInventoriesData(true)} >Muat Ulang</AnchorWithIcon>
                            <AnchorWithIcon iconClassName="fas fa-list" to="/inventory/status" >Rincian</AnchorWithIcon>
                        </div>
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
