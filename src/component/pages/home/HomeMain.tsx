

import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import { LANDING_PAGE_IMG, baseImageUrl } from '../../../constant/Url';
import BaseComponent from '../../BaseComponent';
import './Home.css';

class HomeMain extends BaseComponent<any, any> {
  componentDidMount() {
    document.title = 'Home';
  }
  render() {
    const applicationProfile = this.getApplicationProfile();
    return (
      <div
        className="landing-bg"
        style={{
          backgroundImage: `url("${LANDING_PAGE_IMG}")`,
          color: applicationProfile.fontColor ?? "#000"
        }}
      >
        <h1 className="display-4">{applicationProfile.name}</h1>
        <p className="lead">{applicationProfile.shortDescription}</p>
        <hr className="my-4" />
        <p>{applicationProfile.welcomingMessage}</p>
        <div className="btn-group">
          <Link className="btn btn-primary btn-lg" to="/about" role="button">About Us</Link>
          <Link className="btn btn-primary btn-lg" to="/login" role="button">Login</Link>
        </div>
      </div>


    )
  }

}

export default withRouter(connect(
  mapCommonUserStateToProps,
)(HomeMain))