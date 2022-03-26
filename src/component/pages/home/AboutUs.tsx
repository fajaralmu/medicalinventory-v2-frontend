import React from 'react';
import BaseComponent from './../../BaseComponent';
import Card from './../../container/Card';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import ApplicationProfile from './../../../models/ApplicationProfile';
import FormGroup from '../../form/FormGroup';
import BasePage from './../../BasePage';
class AboutUs extends BasePage {
    constructor(props) {
        super(props, "About Us");
    }
    componentDidMount() {
        document.title = "About Us";
    }
    render() {
        const appProfile:ApplicationProfile = this.getApplicationProfile();
        return (
            <div className="section-body container-fluid mt-5"  >
                {this.titleTag()}
                <Card title="Application">
                    <FormGroup label="Name">{appProfile.name}</FormGroup>
                    <FormGroup><i>{appProfile.shortDescription}</i></FormGroup>
                    <FormGroup label="Contact">{appProfile.contact}</FormGroup>
                    <FormGroup label="Address">{appProfile.address}</FormGroup>
                </Card>
                <p/>
            </div>
        );
    }
}
export default withRouter(connect(
    mapCommonUserStateToProps, 
)(AboutUs))