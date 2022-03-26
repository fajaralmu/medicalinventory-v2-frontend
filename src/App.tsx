
import { resolve } from 'inversify-react';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './App.css';
import DialogContainer from './component/dialog/DialogContainer';
import MainLayout from './component/layout/MainLayout';
import Spinner from './component/loader/Spinner';
import { mapCommonUserStateToProps } from './constant/stores';
import * as url from './constant/Url';
import LoadingContainer from './LoadingContainer';
import ApplicationProfile from './models/ApplicationProfile';
import WebResponse from './models/common/WebResponse';
import * as actions from './redux/actionCreators';
import UserService from './services/UserService';

class IState {
  errorRequestAppId = false;
  requestId?: undefined;
  appIdStatus = "Loading App Id";
}
class App extends Component<any, IState> {

  @resolve(UserService)
  private userService: UserService;

  constructor(props: any) {
    super(props);
    this.state = new IState();
    this.props.setMainApp(this);

  }
  refresh() {
    this.forceUpdate();
  }

  requestAppId = () => {
    this.setState({ errorRequestAppId: false, appIdStatus: "Authenticating application" });
    this.userService.requestApplicationId((response) => {
      this.props.setRequestId(response, this);
      this.refresh();
    }, this.retryRequestAppId)

  }
  retryRequestAppId = () => {
    // console.debug("RETRYING");
    this.setState({ errorRequestAppId: false, appIdStatus: "Authenticating application (Retrying)" });
    this.userService.requestApplicationIdNoAuth((response) => {
      this.props.setRequestId(response, this);
    }, this.errorRequestingAppId)

  }

  errorRequestingAppId = () => {
    this.setState({ errorRequestAppId: true });
  }
  
  componentDidUpdate() {
    if (this.props.applicationProfile) {
      updateFavicon(this.props.applicationProfile);
    }
  }

  componentDidMount() {
    this.requestAppId();
  }

  render() {

    if (!this.props.requestId) {

      return (
        <div className="text-center" style={{ paddingTop: '10%' }}>
          <h2>{this.state.appIdStatus}</h2>
          {
            this.state.errorRequestAppId ?
            (
              <a className="btn btn-outline-dark" onClick={this.retryRequestAppId} >
                <i className="fas fa-redo" />
              </a>
            ) : <Spinner />
          }
        </div>
      )
    }
    return (
      <Fragment>
        <LoadingContainer id={this.props.requestId} />
        <DialogContainer />
        <MainLayout />
      </Fragment>
    )
  }
}

function updateFavicon(profile: ApplicationProfile) {
  if (profile.pageIcon) {
    let link = document.querySelector('link[rel="shortcut icon"]') || document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.id = 'favicon';
      link.setAttribute("rel", 'shortcut icon');
      document.head.appendChild(link);
    }
    link.setAttribute("href", url.baseImageUrl() + profile.pageIcon);
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  setMainApp: (app: App) => dispatch(actions.setMainApp(app)),
  setRequestId: (response: WebResponse, app: App) => dispatch(actions.setRequestId(response, app)),
})

export default withRouter(connect(
  mapCommonUserStateToProps,
  mapDispatchToProps
)(App))
