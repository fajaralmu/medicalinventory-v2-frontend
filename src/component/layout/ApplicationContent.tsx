

import React, { Component, Fragment } from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../pages/login/Login';
import DashboardMain from '../pages/dashboard/main/DashboardMain';
import MasterDataMain from '../pages/masterdata/MasterDataMain';
import HomeMain from '../pages/home/HomeMain';
import Menu from '../../models/common/Menu';
import SettingsMain from '../pages/settings/SettingsMain';
import UserProfile from '../pages/settings/UserProfile';
import EditApplicationProfile from '../pages/settings/EditApplicationProfile';
import AboutUs from './../pages/home/AboutUs';
import TransactionMain from '../pages/transaction/TransactionMain';
import TransactionIn from '../pages/transaction/supply/TransactionIn';
import TransactionOut from '../pages/transaction/distribution/TransactionOut';
import TransactionInConfirmation from '../pages/transaction/supply/TransactionInConfirmation';
import TransactionDetail from '../pages/transaction/detail/TransactionDetail';
import TransactionRelatedRecord from '../pages/transaction/related/TransactionRelatedRecord';
import TransactionOutConfirmation from '../pages/transaction/distribution/TransactionOutConfirmation';
import InventoryMain from '../pages/inventory/InventoryMain';
import ProductStocks from '../pages/inventory/stock/ProductStocks';
import StockFilter from '../pages/inventory/StockFilter';
import Report from '../pages/inventory/Report';
import EditInventoryConfiguration from '../pages/settings/EditInventoryConfiguration';
import DashboardInfo from '../pages/dashboard/DashboardInfo';
import InventoryStatus from '../pages/inventory/InventoryStatus';
import ProductStatDetail from '../pages/dashboard/statistic/ProductStatDetail';
import ProductStat from '../pages/dashboard/statistic/ProductStat';

class ApplicationContent extends BaseComponent {

    constructor(props: any) {
        super(props, false);
    }
    setSidebarMenus = (menus: Menu[]) => {
        this.props.setSidebarMenus(menus);
    }
    render() {
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
)(ApplicationContent))