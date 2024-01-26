import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FormGroup from '../../form/FormGroup';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import BasePage from './../../BasePage';
import Card from './../../container/Card';

const TITLE = 'About Us';

class AboutUs extends BasePage<any, any> {
  constructor(props) {
    super(props, TITLE);
  }
  componentDidMount() {
    document.title = TITLE;
  }
  render() {
    const appProfile = this.getApplicationProfile();
    return (
      <div className="section-body container-fluid mt-5"  >
        {this.titleTag()}
        <Card title="Application">
          <FormGroup label="Name" text={appProfile.name} />
          <FormGroup><i>{appProfile.shortDescription}</i></FormGroup>
          <FormGroup label="Contact" text={appProfile.contact} />
          <FormGroup label="Address" text={appProfile.address} />
        </Card>
        <p />
      </div>
    );
  }
}
export default withRouter(connect(
  mapCommonUserStateToProps,
)(AboutUs));
