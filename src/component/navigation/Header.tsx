
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { getMenus } from '../../constant/Menus';
import Menu from '../../models/common/Menu';
import { mapCommonUserStateToProps } from './../../constant/stores';
import User from './../../models/User';
import { performLogout } from './../../redux/actionCreators';
import BaseComponent from './../BaseComponent';
import './Header.css';
interface State {
  showNavLinks: boolean;
}
class Header extends BaseComponent<any, State> {
  constructor(props) {
    super(props);
    this.state = {
      showNavLinks: false,
    };
  }
  toggleNavLinks = () => {
    this.setState({ showNavLinks: !this.state.showNavLinks });
  }
  onLogout = (e: any) => {
    const app = this;
    app.showConfirmation('Logout?').then(
      (ok) => {
        if (ok) {
          app.props.performLogout(app.parentApp);
        }
      }
    )
  }
  setMenu = (menu: Menu) => {
    this.setState({ showNavLinks: false });
    this.props.setMenu(menu);
  }
  render() {
    const { showNavLinks } = this.state;
    const menus = getMenus();
    const user = this.getLoggedUser();
    return (
      <header
        className="bg-dark container-fluid"
        style={{ position: 'fixed', zIndex: 55, padding: 0, margin: 0 }}
      >
        <NavBarTop label={this.getApplicationProfile().name} />
        <nav
          id="navbar"
          className="navbar navbar-expand-lg navbar-dark bg-dark w-100"
        >
          <a
            id="navbar-brand"
            className="navbar-brand"
            href="#"
          >
            {this.getApplicationProfile().name}
          </a>
          <button
            onClick={this.toggleNavLinks}
            className="navbar-toggler"
            type="button"
          >
            <i className={showNavLinks ? "fas fa-times" : "fas fa-bars"} />
          </button>
          <div className={`collapse navbar-collapse ${showNavLinks ? 'show' : ''}`} id="navbarToggler">
            <ul id="navbar-top" className="navbar-nav mr-auto mt-2 mt-lg-0">
              {menus.map((menu) => {
                if (!menu || (menu.authenticated && !user)) return null;
                // if (menu.userAuthorized && menu.userAuthorized(user) === false) return null;
                const isActive = this.props.activeMenuCode === menu.code;
                const className = "nav-item " + (isActive ? "active nav-active" : "nav-inactive");
                return (
                  <li
                    key={"header-menu-" + new String(menu.code)}
                    className={className}>
                    <Link
                      onClick={() => this.setMenu(menu)}
                      className="nav-link"
                      to={menu.url}>
                      <span>{menu.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul >
            <form className="form-inline my-2 my-lg-0">
              <UserIcon
                setMenuNull={this.props.setMenuNull}
                onLogout={this.onLogout}
                user={user}
              />
            </form >
          </div >
        </nav >
      </header>
    )
  }

}
const NavBarTop = (props) => {
  return (
    <div id="navbar-brand-top" className="container-fluid pl-1">
      <a style={{ fontSize: '15px' }} className="text-white navbar-brand" href="#">
        <strong>{props.label}</strong>
      </a>
    </div>
  );
}
const UserIcon = (props: { user: User | undefined, setMenuNull(): any, onLogout(e): any }) => {
  if (props.user) {
    return (
      <Fragment>
        <Link
          onClick={props.setMenuNull}
          className="btn btn-light btn-sm my-2 mr-2 my-sm-0"
          to='/settings/user-profile'
        >
          <span><i className="fas fa-user mr-2" /></span>
          <span>{props.user.displayName}</span>
        </Link>
        <a
          className="btn btn-danger btn-sm  my-2 my-sm-0 mr-2"
          onClick={props.onLogout}
        >
          <i className="fas fa-sign-out-alt mr-2" />Logout
        </a>
      </Fragment>);
  }
  return (
    <Link
      onClick={props.setMenuNull}
      className="btn btn-sm btn-info my-2 my-sm-0 mr-2"
      to='/login'
    >
      <i className="fas fa-sign-in-alt mr-2" />
      <span>Login</span>
    </Link>
  );
}

const mapDispatchToProps = (dispatch: Function) => ({
  performLogout: (app: any) => dispatch(performLogout(app))
})

export default withRouter(connect(
  mapCommonUserStateToProps,
  mapDispatchToProps
)(Header));
