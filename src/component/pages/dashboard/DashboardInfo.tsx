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
import BasePage from './../../BasePage';
import { resolve } from 'inversify-react';

type State = {
    inventoryData: InventoryData,
    configuration: Configuration,
}
class DashboardInfo extends BasePage<any, State> {
    @resolve(InventoryService)
    private inventoryService: InventoryService;

    constructor(props) {
        super(props, "Info");
        this.state = {
            inventoryData: new InventoryData(),
            configuration: new Configuration(),
        };
    }

    componentDidMount() {
        this.loadInventoriesData();
        this.setPageTitle("Info Persediaan");
        this.scrollTop();

    }
    inventoriesDataLoaded = (response: WebResponse) => {
        this.setState({
            inventoryData: response.inventoryData,
            configuration: response.configuration
        }, () => {
            this.props.setInventoryData(response)
        });
    }
    loadInventoriesData = (force: boolean = false) => {
        const inventoryData = this.getInventoryData();
        const configuration = this.getInventoryConfig();
        if (!force && inventoryData && configuration) {
            this.setState({ inventoryData, configuration });
            return;
        }
        this.commonAjaxWithProgress(
            this.inventoryService.getInventoriesData,
            this.inventoriesDataLoaded,
            this.showCommonErrorAlert,
        )
    }

    render() {
        const { totalItemsSum, totalWillExpiredSum, totalExpiredSum } = this.state.inventoryData;
        const totalSafe = totalItemsSum - totalExpiredSum - totalWillExpiredSum;
        return (
            <div id="DashboardInfo" className="section-body container-fluid">
                {this.titleTag()}
                <div className="alert alert-info">
                    {this.userGreeting()}
                </div>
                <div className="row">
                    <div className="col-4">
                        <Card className="bg-success text-light" title="Stok Aman">
                            <h3 className="text-center">{beautifyNominal(totalSafe)}</h3>
                        </Card>
                    </div>
                    <div className="col-4">
                        <Card className="bg-warning" title="Stok Akan Kadaluarsa">
                            <h3 className="text-center">{beautifyNominal(totalWillExpiredSum)}</h3>
                        </Card>
                    </div>

                    <div className="col-4">
                        <Card className="bg-danger text-warning" title="Stok Kadaluarsa">
                            <h3 className="text-center">{beautifyNominal(totalExpiredSum)}</h3>
                        </Card>
                    </div>
                    <div className="col-10">
                        <p />
                        <SimpleWarning>
                            <p>Total Stok: <strong>{beautifyNominal(totalItemsSum)}</strong></p>
                            <p>Peraingatan Kadaluarsa: {this.state.configuration.expiredWarningDays} hari</p>
                        </SimpleWarning>
                        <div className="btn-group">
                            <AnchorWithIcon iconClassName="fas fa-sync-alt" onClick={() => this.loadInventoriesData(true)}>
                                Muat Ulang
                            </AnchorWithIcon>
                            <AnchorWithIcon iconClassName="fas fa-list" to="/inventory/status">
                                Rincian
                            </AnchorWithIcon>
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
