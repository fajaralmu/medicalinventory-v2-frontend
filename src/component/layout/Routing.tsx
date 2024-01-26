

import React, { Fragment } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
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

class Routing extends BaseComponent<any, any> {

  setSidebarMenus = (menus: Menu[]) => {
    this.props.setSidebarMenus(menus);
  }
  render() {
    const isLoggedIn = this.isUserLoggedIn();
    const redirect = <Redirect to="/" />;
    return (
      <Fragment>
        <Switch>
          <Route exact path="/login" render={() => <Login />} />

          {/* -------- home -------- */}
          <Route exact path="/home" render={() => <HomeMain />} />
          <Route exact path="/" render={() => <HomeMain />} />
          <Route exact path="/about" render={() => <AboutUs />} />


          {/* -------- masterdata -------- */}
          <Route
            exact
            path="/management"
            render={
              (props: any) =>
                isLoggedIn ?
                  <MasterDataMain setSidebarMenus={this.setSidebarMenus} />
                  : redirect
            }
          />
          <Route
            exact
            path="/management/:code"
            render={
              (props: any) =>
                isLoggedIn ?
                  <MasterDataMain setSidebarMenus={this.setSidebarMenus} />
                  : redirect
            }
          />
        </Switch>
        <Dashboard loggedIn={isLoggedIn} redirect={redirect} />
        <Setting loggedIn={isLoggedIn} redirect={redirect} />
        <Transaction loggedIn={isLoggedIn} redirect={redirect} />
        <Inventory loggedIn={isLoggedIn} redirect={redirect} />
      </Fragment>
    )
  }
}

type RoutingProps = {
  loggedIn: boolean,
  redirect: any,
}

const Dashboard = (props: RoutingProps) => {
  const { loggedIn, redirect } = props;
  return (

    <Switch>
      <Route
        exact
        path="/dashboard"
        render={(props: any) => loggedIn ? <DashboardMain /> : redirect}
      />
      <Route
        exact
        path="/dashboard/info"
        render={(props: any) => loggedIn ? <DashboardMain /> : redirect}
      />
      <Route
        exact
        path="/dashboard/productstat"
        render={(props: any) => loggedIn ? <ProductStat /> : redirect}
      />
      <Route
        exact
        path="/dashboard/productstatdetail"
        render={(props: any) => loggedIn ? <ProductStatDetail /> : redirect}
      />
    </Switch>
  )
}
const Setting = (props: RoutingProps) => {
  const { loggedIn, redirect } = props;
  return <Switch>
    {/* -------- settings --------- */}
    <Route
      exact
      path="/settings"
      render={(props: any) => loggedIn ? <SettingsMain /> : redirect}
    />
    <Route
      exact
      path="/settings/user-profile"
      render={(props: any) => loggedIn ? <UserProfile /> : redirect}
    />
    <Route
      exact
      path="/settings/app-profile"
      render={(props: any) => loggedIn ? <EditApplicationProfile /> : redirect}
    />
    <Route
      exact
      path="/settings/inventory-config"
      render={(props: any) => loggedIn ? <EditInventoryConfiguration /> : redirect}
    />
  </Switch>
}
const Transaction = (props: RoutingProps) => {
  const { loggedIn, redirect } = props;
  return <Switch>
    {/*TRANSACTION*/}
    <Route
      exact
      path="/transaction"
      render={(props: any) => loggedIn ? <TransactionMain /> : redirect}
    />
    <Route
      exact
      path="/transaction/productin"
      render={(props: any) => loggedIn ? <TransactionIn /> : redirect}
    />
    <Route
      exact
      path="/transaction/productin/confirm"
      render={(props: any) => loggedIn ? <TransactionInConfirmation /> : redirect}
    />
    <Route
      exact
      path="/transaction/productout"
      render={(props: any) => loggedIn ? <TransactionOut /> : redirect}
    />
    <Route
      exact
      path="/transaction/productout/confirm"
      render={(props: any) => loggedIn ? <TransactionOutConfirmation /> : redirect}
    />
    <Route
      exact
      path="/transaction/detail"
      render={(props: any) => loggedIn ? <TransactionDetail /> : redirect}
    />
    <Route
      exact
      path="/transaction/detail/:code"
      render={(props: any) => loggedIn ? <TransactionDetail /> : redirect}
    />
    <Route
      exact
      path="/transaction/relatedrecord"
      render={(props: any) => loggedIn ? <TransactionRelatedRecord /> : redirect}
    />
    <Route
      exact
      path="/transaction/relatedrecord/:code"
      render={(props: any) => loggedIn ? <TransactionRelatedRecord /> : redirect}
    />
  </Switch>
}
const Inventory = (props: RoutingProps) => {
  const { loggedIn, redirect } = props;
  return <Switch>
    {/*INVENTORY*/}
    <Route
      exact
      path="/inventory"
      render={(props: any) => loggedIn ? <InventoryMain /> : redirect}
    />
    <Route
      exact
      path="/inventory/stock"
      render={(props: any) => loggedIn ? <ProductStocks /> : redirect}
    />
    <Route
      exact
      path="/inventory/status"
      render={(props: any) => loggedIn ? <InventoryStatus /> : redirect}
    />
    <Route
      exact
      path="/inventory/stockfilter"
      render={(props: any) => loggedIn ? <StockFilter /> : redirect}
    />
    <Route
      exact
      path="/inventory/report"
      render={(props: any) => loggedIn ? <Report /> : redirect}
    />
  </Switch>
}

const mapDispatchToProps = (dispatch: Function) => ({})

export default withRouter(connect(
  mapCommonUserStateToProps,
  mapDispatchToProps
)(Routing))