import React, { Component } from 'react';
import './Loader.css';

type Props = {
  progress: number;
  realtime: boolean,
  withTimer?: boolean,
  type: string,
  endMessage?: () => any,
}
type State = {
  timer: number,
}
class Loader extends Component<Props, State> {
  private intervalId: any;
  constructor(props) {
    super(props);
    this.state = {
      timer: 130,
    };
  }
  update = () => {
    if (this.state.timer < 0) {
      clearInterval(this.intervalId);
    }
    console.log("tick")
    this.setState({ timer: this.state.timer - 1 })
    if (this.state.timer < 0 && this.props.endMessage) {
      this.props.endMessage();
    }
  }

  componentDidMount() {
    if (this.props.withTimer === true) {
      this.intervalId = setInterval(this.update, 1, null);
    }
  }

  render() {
    const className = `custom-loading custom-loading-${this.props.type}`;
    const { realtime, progress } = this.props;
    if (realtime) {
      return <LoaderContent progress={progress} realtime={realtime} />;
    }

    return (
      <div className={className} >
        <LoaderContent progress={progress} realtime={realtime} />
      </div>
    );
  }

}

const LoaderContent = (props: { realtime: boolean, progress: number }) => {

  if (props.realtime) {
    const { progress } = props;
    return (
      <div className="row container-fluid bg-light" style={{ margin: 0, position: 'fixed', zIndex: 100 }}>
        <div className="col-1">
          <span
            className="spinner-border spinner-border-sm mb-2 mr-2"
            role="status"
          />
          <span>{progress}%</span>
        </div>
        <div className="col-11 progress" style={{ padding: 0, marginTop: '7px', height: '10px' }}  >
          <div
            className="bg-primary"
            style={{
              width: `${props.progress}%`,
              transitionDuration: '50ms',
              margin: 0,
            }}
          >
          </div>
        </div>
      </div>
    );
  }
  return (
    <button className="btn btn-dark" type="button" disabled>
      <span className="spinner-border spinner-border-sm" role="status" />
      <span className=" ">Loading...</span>
    </button>
  );
}

export default Loader;