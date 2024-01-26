import React, { Component, Fragment, RefObject } from "react";
import SockJsClient from 'react-stomp';
import Loader from "./component/loader/Loader";
import WebResponse from "./models/common/WebResponse";
import { doItLater } from "./utils/EventUtil";
import * as url from './constant/Url';
import { resolve } from "inversify-react";
import LoadingService from './services/LoadingService';

type State = {
    show: boolean,
    withRealtimeProgress: boolean,
    loadingPercentage: number,
}

type Props = {
    id: string;
}

export default class LoadingContainer extends Component<Props, State> {

    @resolve(LoadingService)
    private service: LoadingService;

    private loadings: number = 0;
    private sockJsClient: RefObject<SockJsClient> = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            withRealtimeProgress: false,
            loadingPercentage: 0,
        };
    }

    componentDidMount() {
        this.service.setContainer(this);
    }

    get websocketTopic() { return `/wsResp/progress/${this.props.id}`; }

    private incrementLoadings() {
        this.loadings++;
    }

    private decrementLoadings() {
        this.loadings--;
        if (this.loadings < 0) {
            this.loadings = 0;
        }
    }

    stop = () => {
        try {
            this.decrementLoadings();
            if (this.loadings === 0) {
                if (this.state.withRealtimeProgress) {
                    this.setState({ loadingPercentage: 100 }, this.smoothEndLoading);
                } else {
                    this.setState({ show: false, loadingPercentage: 0 });
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    smoothEndLoading = () => {
        doItLater(() => {
            this.setState({ show: false, loadingPercentage: 0 });
        }, 100);
    }

    private handleOnWebsocketMessage = (msg: WebResponse) => {
        const percentageFloat: number = msg.percentage ?? 0;
        const percentage = Math.floor(percentageFloat);
        
        if (percentageFloat < 0 || percentageFloat > 100) {
            this.stop();
        }
        this.setState({ loadingPercentage: percentage });
    }

    start = (realtimeProgress: boolean) => {
      this.setState({ show: true, withRealtimeProgress: realtimeProgress }, this.incrementLoadings);
    }  

    render(): React.ReactNode {
        const usedHost = url.contextPath();

        return (
            <Fragment>
                <SockJsClient
                    url={usedHost + 'realtime-app'}
                    topics={[this.websocketTopic]}
                    onMessage={this.handleOnWebsocketMessage}
                    ref={(client) => { this.sockJsClient = client }}
                />
                {
                    this.state.show &&
                    <Loader
                        realtime={this.state.withRealtimeProgress}
                        progress={this.state.loadingPercentage}
                        type="loading"
                    />
                }
            </Fragment>
        )
    }
}
