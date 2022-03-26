
import React, { Component, Fragment, RefObject } from 'react';
import './App.css';
import { withRouter } from 'react-router-dom'
import * as actions from './redux/actionCreators'
import { connect } from 'react-redux'
import SockJsClient from 'react-stomp';
import * as url from './constant/Url';
import { mapCommonUserStateToProps } from './constant/stores';
import Loader from './component/loader/Loader';
import MainLayout from './component/layout/MainLayout';
import WebResponse from './models/common/WebResponse';
import Spinner from './component/loader/Spinner';
import UserService from './services/UserService';
import { doItLater } from './utils/EventUtil';
import { resolve } from 'inversify-react';
import DialogContainer from './component/dialog/DialogContainer';
import ApplicationProfile from './models/ApplicationProfile';

class IState {
  loading = false;
  realtime = false
  errorRequestAppId = false;
  loadingPercentage: number = 0;;
  requestId?: undefined;
  appIdStatus: string = "Loading App Id";
}
class App extends Component<any, IState> {

  loadings: number = 0;
  sockJsClient: RefObject<SockJsClient> = React.createRef();

  @resolve(UserService)
  private userService: UserService;
  // alertRef: RefObject<Alert> = React.createRef();
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

  incrementLoadings() {
    this.loadings++;
  }

  decrementLoadings() {
    this.loadings--;
    if (this.loadings < 0) {
      this.loadings = 0;
    }
  }

  startLoading = (realtime: boolean) => {
    this.setState({ loading: true, realtime: realtime }, this.incrementLoadings);
  }

  endLoading = () => {
    try {
      this.decrementLoadings();
      if (this.loadings == 0) {
        if (this.state.realtime) {
          this.setState({ loadingPercentage: 100 },
            this.smoothEndLoading);
        } else {
          this.setState({ loading: false, loadingPercentage: 0 });
        }
      }
    } catch (e) {
      console.error(e);
    }

  }

  smoothEndLoading = () => {
    doItLater(() => {
      this.setState({ loading: false, loadingPercentage: 0 });
    }, 100);
  }

  handleOnWebsocketMessage = (msg: WebResponse) => {
    const percentageFloat: number = msg.percentage ?? 0;
    let percentage = Math.floor(percentageFloat);
    if (percentageFloat < 0 || percentageFloat > 100) {
      this.endLoading();
    }
    this.setState({ loadingPercentage: percentage });
  }

  componentDidUpdate() {
    if (this.props.applicationProfile) {
      updateFavicon(this.props.applicationProfile);
    }
  }

  componentDidMount() {
    this.setState({ loadingPercentage: 0 }, this.requestAppId);
  }

  get websocketTopic() { return `/wsResp/progress/${this.props.requestId}`; }

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
    const usedHost = url.contextPath();
    return (
      <Fragment>
        <Loading
          realtime={this.state.realtime}
          loading={this.state.loading}
          loadingPercentage={this.state.loadingPercentage}
        />
        <DialogContainer />
        <MainLayout />
        <SockJsClient
          url={usedHost + 'realtime-app'}
          topics={[this.websocketTopic]}
          onMessage={this.handleOnWebsocketMessage}
          ref={(client) => { this.sockJsClient = client }}
        />
      </Fragment>
    )
  }
}

function Loading(props) {
  if (props.loading == true) {
    return (
      <Loader realtime={props.realtime} progress={props.loadingPercentage} type="loading" />
    );
  }
  return null;
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
