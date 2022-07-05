

import React from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { performLogout } from './../../redux/actionCreators';
import Header from '../navigation/Header';
import ApplicationContent from './Routing';
import SideBar from '../navigation/SideBar';
import './Layout.css';
import Menu from '../../models/common/Menu';
import { getMenuByMenuPath, extractMenuPath } from './../../constant/Menus';
interface IState {
  showSidebar: boolean;
  activeMenuCode: any;
  menu: undefined | Menu;
  sidebarMenus: Menu[] | null
};
class MainLayout extends BaseComponent<any, IState> {
  currentPathName = '';
  constructor(props: any) {
    super(props);
    this.state = {
      showSidebar: false,
      activeMenuCode: null,
      menu: undefined,
      sidebarMenus: []
    };
  }
  setMenuNull = () => {
    console.warn("SET MENU NULL");
    this.setState({ menu: undefined, showSidebar: false, activeMenuCode: null, sidebarMenus: null });
  }
  setMenu = (menu: Menu) => {
    if (menu == null) {
      return;
    }
    console.debug("SET MENU: ", menu.code);
    this.setState({ menu: menu, sidebarMenus: null, showSidebar: menu.showSidebar ?? false, activeMenuCode: menu.code });
  }
  setSidebarMenus = (menus: Menu[]) => {
    // console.debug("Set sidebar menus: ", menus);
    this.setState({ sidebarMenus: menus });
  }
  componentDidMount() {
    this.setCurrentMenu();
  }
  componentDidUpdate() {
    this.setCurrentMenu();
  }
  setCurrentMenu = () => {
    const pathName = extractMenuPath(this.props.location.pathname);

    if (pathName == this.currentPathName) {
      return;
    }
    this.currentPathName = pathName;
    const menu = getMenuByMenuPath(pathName);
    if (menu == null) {
      this.setMenuNull();
    } else {
      this.setMenu(menu);
    }
  }
  getSubMenus = () => {
    if (this.state.menu && this.state.menu.subMenus != null && this.state.menu.subMenus?.length > 0) {
      return this.state.menu?.subMenus;
    }
    if (this.state.sidebarMenus) {
      return this.state.sidebarMenus;
    }
    return null;
  }
  render() {
    const showSidebar = this.state.showSidebar == true;
    return (
      <div id="main-layout">
        <Header
          setMenuNull={this.setMenuNull}
          activeMenuCode={this.state.activeMenuCode}
          setMenu={this.setMenu}
        />
        <div
          id="page-content"
          className="container-fluid"
        >
          <main
            className="container-fluid"
            style={{ zIndex: 1, position: 'absolute', paddingTop: '55px' }}
            id={showSidebar ? "app-content" : "content"}
          >
            <ApplicationContent setSidebarMenus={this.setSidebarMenus} />
          </main>
          {
            showSidebar &&
            <SideBar sidebarMenus={this.getSubMenus()} parentMenu={this.state.menu} />
          }
        </div>
      </div>
    )
  }

}
const mapDispatchToProps = (dispatch: Function) => ({
  performLogout: (app: any) => dispatch(performLogout(app))
})


export default withRouter(connect(
  mapCommonUserStateToProps,
  mapDispatchToProps
)(MainLayout))