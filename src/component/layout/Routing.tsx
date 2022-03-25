

import React, { Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../constant/stores';
import Menu from '../../models/common/Menu';
import BaseComponent from '../BaseComponent';
import DashboardInfo from '../pages/dashboard/DashboardInfo';
import DashboardMain from '../pages/dashboard/main/DashboardMain';
import ProductStat from '../pages/dashboard/statistic/ProductStat';
import ProductStatDetail from '../pages/dashboard/statistic/ProductStatDetail';
import AboutUs from '../pages/home/AboutUs';
import HomeMain from '../pages/home/HomeMain';
import InventoryMain from '../pages/inventory/InventoryMain';
import InventoryStatus from '../pages/inventory/InventoryStatus';
import Report from '../pages/inventory/Report';
import ProductStocks from '../pages/inventory/stock/ProductStocks';
import StockFilter from '../pages/inventory/StockFilter';
import Login from '../pages/login/Login';
import MasterDataMain from '../pages/masterdata/MasterDataMain';
import EditApplicationProfile from '../pages/settings/EditApplicationProfile';
import EditInventoryConfiguration from '../pages/settings/EditInventoryConfiguration';
import SettingsMain from '../pages/settings/SettingsMain';
import UserProfile from '../pages/settings/UserProfile';
import TransactionDetail from '../pages/transaction/detail/TransactionDetail';
import TransactionOut from '../pages/transaction/distribution/TransactionOut';
import TransactionOutConfirmation from '../pages/transaction/distribution/TransactionOutConfirmation';
import TransactionRelatedRecord from '../pages/transaction/related/TransactionRelatedRecord';
import TransactionIn from '../pages/transaction/supply/TransactionIn';
import TransactionInConfirmation from '../pages/transaction/supply/TransactionInConfirmation';
import TransactionMain from '../pages/transaction/TransactionMain';

class Routing extends BaseComponent {

    constructor(props: any) {
        super(props, false);
    }
    setSidebarMenus = (menus: Menu[]) => {
        this.props.setSidebarMenus(menus);
    }
    render() {
        const isLoggedIn = this.isUserLoggedIn();
        // const navigate = <Navigat/> 
        return (
            <Fragment>
                <Switch>
                    <Route exact path="/login" render={
                        (props: any) =>
                            <Login />
                    } />
                    {/* -------- home -------- */}
                    <Route exact path="/home" render={
                        (props: any) =>
                            <HomeMain />
                    } />
                    <Route exact path="/" render={
                        (props: any) =>
                            <HomeMain />
                    } />
                    <Route exact path="/about" render={
                        (props: any) =>
                            <AboutUs />
                    } />


                    {/* -------- masterdata -------- */}
                    <Route exact path="/management" render={
                        (props: any) =>

                            <MasterDataMain setSidebarMenus={this.setSidebarMenus} />
                    } />
                    <Route exact path="/management/:code" render={
                        (props: any) =>
                            <MasterDataMain setSidebarMenus={this.setSidebarMenus} />
                    } />
                </Switch>
                <Dashboard />
                <Setting />
                <Transaction />
                <Inventory />
            </Fragment>
        )
    }
    componentDidMount() {
        // document.title = "Login";
    }

}
const Dashboard = (props) => {

    return (

        <Switch>
            <Route exact path="/dashboard" render={
                (props: any) =>
                    <DashboardMain />
            } />
            <Route exact path="/dashboard/info" render={
                (props: any) =>
                    <DashboardInfo />
            } />
            <Route exact path="/dashboard/productstat" render={
                (props: any) =>
                    <ProductStat />
            } />
            <Route exact path="/dashboard/productstatdetail" render={
                (props: any) =>
                    <ProductStatDetail />
            } />
        </Switch>
    )
}
const Setting = (props) => {
    return <Switch>
        {/* -------- settings --------- */}
        <Route exact path="/settings" render={
            (props: any) =>
                <SettingsMain />
        } />
        <Route exact path="/settings/user-profile" render={
            (props: any) =>
                <UserProfile />
        } />
        <Route exact path="/settings/app-profile" render={
            (props: any) =>
                <EditApplicationProfile />
        } />
        <Route exact path="/settings/inventory-config" render={
            (props: any) =>
                <EditInventoryConfiguration />
        } />
    </Switch>
}
const Transaction = (props) => {
    return <Switch>
        {/*TRANSACTION*/}
        <Route exact path="/transaction" render={
            (props: any) =>
                <TransactionMain />
        } />
        <Route exact path="/transaction/productin" render={
            (props: any) => <TransactionIn />
        } />
        <Route exact path="/transaction/productin/confirm" render={
            (props: any) => <TransactionInConfirmation />
        } />
        <Route exact path="/transaction/productout" render={
            (props: any) =>
                <TransactionOut />
        } />
        <Route exact path="/transaction/productout/confirm" render={
            (props: any) => <TransactionOutConfirmation />
        } />
        <Route exact path="/transaction/detail" render={
            (props: any) =>
                <TransactionDetail />
        } />
        <Route exact path="/transaction/detail/:code" render={
            (props: any) =>
                <TransactionDetail />
        } />
        <Route exact path="/transaction/relatedrecord" render={
            (props: any) =>
                <TransactionRelatedRecord />
        } />
        <Route exact path="/transaction/relatedrecord/:code" render={
            (props: any) =>
                <TransactionRelatedRecord />
        } />
    </Switch>
}
const Inventory = (props) => {
    return <Switch>
        {/*INVENTORY*/}
        <Route exact path="/inventory" render={
            (props: any) =>
                <InventoryMain />
        } />
        <Route exact path="/inventory/stock" render={
            (props: any) =>
                <ProductStocks />
        } />
        <Route exact path="/inventory/status" render={
            (props: any) =>
                <InventoryStatus />
        } />
        <Route exact path="/inventory/stockfilter" render={
            (props: any) =>
                <StockFilter />
        } />
        <Route exact path="/inventory/report" render={
            (props: any) =>
                <Report />
        } />
    </Switch>
}



const mapDispatchToProps = (dispatch: Function) => ({})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(Routing))