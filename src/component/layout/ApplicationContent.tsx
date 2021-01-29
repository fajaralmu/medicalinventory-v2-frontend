

import React, { Component, Fragment } from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../pages/login/Login';
import DashboardMain from '../pages/dashboard/main/DashboardMain';
import MasterDataMain from '../pages/masterdata/MasterDataMain';
import HomeMain from '../pages/home/HomeMain';
import BaseMainMenus from './BaseMainMenus';
import Menu from './../../models/Menu';
import SettingsMain from '../pages/settings/SettingsMain';
import UserProfile from '../pages/settings/UserProfile';
import EditApplicationProfile from '../pages/settings/EditApplicationProfile';
import AboutUs from './../pages/home/AboutUs';
import TransactionMain from '../pages/transaction/TransactionMain';
import TransactionIn from '../pages/transaction/in/TransactionIn';
import TransactionOut from '../pages/transaction/out/TransactionOut';
import TransactionInConfirmation from '../pages/transaction/in/TransactionInConfirmation';

class ApplicationContent extends BaseComponent {

    ref: React.RefObject<BaseMainMenus> = React.createRef();
    constructor(props: any) {
        super(props, false);
    }
    setSidebarMenus = (menus: Menu[]) => {
        this.props.setSidebarMenus(menus);
    }
    render() {
        return (
            <div style={{ paddingTop: '65px' }}>
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

                    {/* -------- dashboard -------- */}
                    <Route exact path="/dashboard" render={
                        (props: any) =>
                            <DashboardMain />
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
                    {/*TRANSACTION*/}
                    <Route exact path="/transaction" render={
                        (props: any) =>
                            <TransactionMain />
                    } />
                    <Route exact path="/transaction/productin" render={
                        (props: any) => <TransactionIn />
                    } />
                     <Route exact path="/transaction/productin/confirm" render={
                        (props: any) =>  <TransactionInConfirmation />
                    } />
                    <Route exact path="/transaction/productout" render={
                        (props: any) =>
                            <TransactionOut />
                    } />
                </Switch>

            </div>
        )
    }
    componentDidMount() {
        // document.title = "Login";
    }

}



const mapDispatchToProps = (dispatch: Function) => ({})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(ApplicationContent))