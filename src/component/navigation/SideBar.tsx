

import React, { Component, Fragment } from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { performLogout } from './../../redux/actionCreators';
import Menu from '../../models/common/Menu';
import './SideBar.css'

class SideBar extends BaseComponent<{sidebarMenus: Menu[], parentMenu?: Menu}, any> {
  isSidebarActive = (menu: Menu) => {
    const { parentMenu } = this.props;
    if (!parentMenu) { return false; }
    const pathName = (this.props as any).location.pathname;
    return parentMenu.url + '/' + menu.url === pathName;
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    let scrollTop = event.srcElement.body.scrollTop,
      itemTranslate = Math.min(0, scrollTop / 3 - 60);
    // console.debug("scrollTop: ", scrollTop);

  }
  render() {
    const { parentMenu } = this.props;
    if (!parentMenu) { return null }
    const menus: Menu[] = this.props.sidebarMenus ?? [];

    return (
      <ul id="sidebar" className="sidebar-nav bg-light">
        <Brand show={parentMenu != null} brand={parentMenu} />
        <li>
          <div className="sidebar-item-separator" />
        </li>
        {menus.map(menu => {
          const isActive: boolean = this.isSidebarActive(menu);
          const menuClassName = isActive ? 'menu-active' : 'regular-menu';
          return (
            <li className={`sidebar-item ${menuClassName}`} key={`SIDEBAR_${menu.code}`}>
              <Link to={`${parentMenu.url}/${menu.url}`}>
                <span className="sidebar-icon">
                  <i className={Menu.getIconClassName(menu)} />
                </span>
                <span className={'menu-label'} >{menu.name}</span>
              </Link>
            </li>
          )
        })
        }
      </ul >
    )
  }

}
const Brand = (props) => {
  if (props.show === false) {
    return null;
  }
  return (
    <Fragment>
      <li id="sidebar-brand" className="sidebar-brand mb-5">
        <div className="text-center py-5">
          <h3 className="text-dark">
            <i className={Menu.getIconClassName(props.brand)}></i>
          </h3>
          <Link to={props.brand.url} style={{ textDecoration: 'none' }}>
            <h4 className="text-dark pb-5">{props.brand.name}</h4>
          </Link>
        </div>
      </li>
      <li className={"sidebar-item-brand "} >
        <Link to={props.brand.url}>
          <span className="sidebar-icon">
            <i className={Menu.getIconClassName(props.brand)} />
          </span>
        </Link>
      </li>
    </Fragment>
  )
}
const mapDispatchToProps = (dispatch: Function) => ({
  performLogout: (app: any) => dispatch(performLogout(app))
})


export default withRouter(connect(
  mapCommonUserStateToProps,
  mapDispatchToProps
)(SideBar))