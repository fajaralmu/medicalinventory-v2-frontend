
import React, { Component } from 'react';
import AnchorButton from '../navigation/AnchorButton';
import Card from './Card';
interface IProps {
  imageUrls: string[];
}
interface IState {
  active: number;
}
export default class Carousel extends Component<IProps, IState> {
  imageLength: number = 0;
  constructor(props: IProps) {
    super(props);
    this.state = {
      active: 0,
    };
    this.imageLength = props.imageUrls.length;
  }

  getCurrentImage = () => {
    return this.props.imageUrls[this.state.active];
  }
  prev = (e) => {
    let currentActive = this.state.active;
    if (currentActive === 0) {
      currentActive = this.imageLength - 1;
    } else {
      currentActive--;
    }
    this.setState({ active: currentActive });

  }
  next = (e) => {
    let currentActive = this.state.active;
    if (currentActive === this.imageLength - 1) {
      currentActive = 0;
    } else {
      currentActive++;
    }
    this.setState({ active: currentActive });

  }
  render() {
    return (
      <Card className="container-fluid   text-center">
        <div className="row">
          <div className="col-md-2">
            <AnchorButton className="btn btn-light" iconClassName="fas fa-arrow-left" onClick={this.prev} />
          </div>
          <div className="col-md-8" style={{ overflowX: 'scroll' }}>
            <img height="200" src={this.getCurrentImage()} />
          </div>
          <div className="col-md-2">
            <AnchorButton className="btn btn-light" iconClassName="fas fa-arrow-right" onClick={this.next} />
          </div>
        </div>

      </Card>
    )
  }
}