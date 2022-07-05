import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FormGroup from '../../form/FormGroup';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import BasePage from './../../BasePage';
import Card from './../../container/Card';

class AboutUs extends BasePage<any, any> {
    constructor(props) {
        super(props, "About Us");
    }
    componentDidMount() {
        document.title = "About Us";
    }
    render() {
        const appProfile = this.getApplicationProfile();
        return (
            <div className="section-body container-fluid mt-5"  >
                {this.titleTag()}
                <Card title="Application">
                    <FormGroup label="Name">{appProfile.name}</FormGroup>
                    <FormGroup><i>{appProfile.shortDescription}</i></FormGroup>
                    <FormGroup label="Contact">{appProfile.contact}</FormGroup>
                    <FormGroup label="Address">{appProfile.address}</FormGroup>
                </Card>
                <p />
            </div>
        );
    }
}
export default withRouter(connect(
    mapCommonUserStateToProps,
)(AboutUs))