import React from 'react'
import BaseComponent from './../../BaseComponent'; 
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import InventoryData from './../../../models/InventoryData';
import Configuration from './../../../models/Configuration';
import InventoryService from './../../../services/InventoryService';
import WebResponse from './../../../models/WebResponse';
import Card from '../../container/Card';
import { setInventoryData } from '../../../redux/actionCreators';
import { tableHeader } from './../../../utils/CollectionUtil';
import ProductInventory from './../../../models/ProductInventory';
import AnchorWithIcon from '../../navigation/AnchorWithIcon';
import { beautifyNominal } from '../../../utils/StringUtil';
class State {
    inventoryData: InventoryData = new InventoryData();
    configuration:Configuration = new Configuration();
}
class InventoryStatus extends BaseComponent {

    state: State = new State();
    inventoryService: InventoryService;
    constructor(props) {
        super(props, true);
        this.inventoryService = this.getServices().inventoryService;
    }
    componentDidMount() {
        this.setPageTitle("Inventory Status")
        this.validateLoginStatus(this.loadInventoriesData);
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
        const config = this.state.configuration;
        const inventoryData = this.state.inventoryData;
        const inventories: ProductInventory[] = this.state.inventoryData.inventories;
        let totalSaveSum:number = 0;
        return   (
            <div className="container-fluid">
                <Card title="Inventory Status">
                    <div>
                        <AnchorWithIcon iconClassName="fas fa-sync-alt" onClick={()=>this.loadInventoriesData(true)}>Reload</AnchorWithIcon>
                        <p/>
                    </div>
                    <table className="table table-striped">
                        {tableHeader("No", "Location", "Total", "Safe", "Will Expired in "+config.expiredWarningDays+" days", "Expired")}
                        <tbody>
                            {inventories.map((inventory, i)=>{
                                const safe = inventory.totalItems-inventory.expiredItems-inventory.willExpiredItems;
                                totalSaveSum+=safe;
                                return (
                                    <tr key={"p-inv-"+i}>
                                        <td>{i+1}</td>
                                        <td>{inventory.location.name}</td>
                                        <td >{beautifyNominal(inventory.totalItems)}</td>
                                        <td >{beautifyNominal(safe)}</td>
                                        <td className={inventory.willExpiredItems>0?"bg-warning":""}>
                                            {beautifyNominal(inventory.willExpiredItems)} </td>
                                        <td className={inventory.expiredItems>0?"bg-danger text-warning":""}>
                                            {beautifyNominal(inventory.expiredItems)} </td>
                                    </tr>
                                )
                            })}
                            <tr className="font-weight-bold">
                                <td colSpan={2}>Total</td>
                                <td>{beautifyNominal(inventoryData.totalItemsSum)}</td>
                                <td>{beautifyNominal(totalSaveSum)}</td>
                                <td>{beautifyNominal(inventoryData.totalWillExpiredSum)}</td>
                                <td>{beautifyNominal(inventoryData.totalExpiredSum)}</td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
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
    )(InventoryStatus)
)