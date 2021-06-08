import React, { ChangeEvent, Component, FormEvent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import ApplicationProfile from '../../../models/ApplicationProfile';
import Card from '../../container/Card';
import FormGroup from '../../form/FormGroup';
import { baseImageUrl } from '../../../constant/Url';
import { setApplicationProfile } from '../../../redux/actionCreators';
import WebResponse from '../../../models/common/WebResponse';
import { toBase64v2 } from '../../../utils/ComponentUtil';
import { EditField, EditImage } from './settingHelper';
import BaseUpdateProfilePage from './BaseUpdateProfilePage';
class EditFields {
    name: boolean = false; pageIcon: boolean = false;
    welcomingMessage: boolean = false;
    contact: boolean = false; shortDescription: boolean = false;
    backgroundUrl: boolean = false; address: boolean = false;
    about: boolean = false; color: boolean = false; fontColor: boolean = false; 
    iconUrl:boolean = false
}
class IState {
    applicationProfile?: ApplicationProfile = undefined;
    editFields: EditFields = new EditFields()
    fieldChanged = (): boolean => {
        for (const key in this.editFields) {
            if (this.editFields[key] == true) {
                return true;
            }
        }
        return false;
    }
}
class EditApplicationProfile extends BaseUpdateProfilePage {
 
    state: IState = new IState();
    constructor(props: any) {
        super(props, "Profile Aplikasi");
        this.state.applicationProfile = Object.assign(new ApplicationProfile(), this.getApplicationProfile());
    }
    updateProfileProperty = (e: ChangeEvent) => {
        const target: HTMLInputElement | null = e.target as HTMLInputElement;
        if (null == target) return;
        const applicationProfile: ApplicationProfile | undefined = this.state.applicationProfile;
        if (!applicationProfile) return;

        applicationProfile[target.name] = target.value;
        this.setState({ applicationProfile: applicationProfile });
    }

    updateImageField = (e: ChangeEvent) => {
        const target: HTMLInputElement | null = e.target as HTMLInputElement;
        if (null == target) return;
        const fieldName: string | null = e.target.getAttribute("name");
        if (null == fieldName) {
            return;
        }
        const app = this;
        const fileName: string | undefined = target.files ? target.files[0].name : undefined;
        if (!fileName) return;
        toBase64v2(target).then(function (imageData) {
            app.setAppProfileField(fieldName, imageData);
        }).catch(console.error);
    }
    setAppProfileField = (fieldName: string, value: any) => {
        const applicationProfile: ApplicationProfile | undefined = this.state.applicationProfile;
        if (!applicationProfile) return;
        applicationProfile[fieldName] = value;
        this.setState({ applicationProfile: applicationProfile });
    }
    toggleInput = (e: MouseEvent) => {
        const target: HTMLAnchorElement | null = e.target as HTMLAnchorElement;
        const appProfile: ApplicationProfile | undefined = this.state.applicationProfile;
        const actualAppProfile: ApplicationProfile | undefined = this.getApplicationProfile();
        if (null == target || !appProfile || !actualAppProfile) {
            return;
        }

        const propertyName: string | null = target.getAttribute("data-name");
        if (null == propertyName) {
            return;
        }
        const enabled: boolean = target.getAttribute('data-enabled') == 'true';
        const editFields = this.state.editFields;
        editFields[propertyName] = enabled;
        if (!enabled) {
            appProfile[propertyName] = actualAppProfile[propertyName];
        }
        this.setState({ applicationProfile: appProfile, editFields: editFields });
    }
    doSaveRecord = () => {
        const applicationProfile: ApplicationProfile | undefined = this.getApplicationEditedData();
        if (!applicationProfile) return;
        if (applicationProfile.backgroundUrl || applicationProfile.pageIcon || applicationProfile.iconUrl) {
            this.commonAjaxWithProgress(
                this.masterDataService.updateApplicationProfile,
                this.recordSaved, this.showCommonErrorAlert,
                applicationProfile
            )
        } else {
            this.commonAjax(
                this.masterDataService.updateApplicationProfile,
                this.recordSaved, this.showCommonErrorAlert,
                applicationProfile
            )
        }
    }
    getApplicationEditedData = (): ApplicationProfile | undefined => {
        const applicationProfile: ApplicationProfile | undefined = this.state.applicationProfile;
        const editFields: EditFields = this.state.editFields;
        if (!applicationProfile) return undefined;
        const editedApplication: ApplicationProfile = new ApplicationProfile();
        for (const key in editFields) {
            const element: boolean = editFields[key];
            if (element && key != 'backgroundUrl' && key != 'pageIcon' && key != 'iconUrl') {
                editedApplication[key] = applicationProfile[key];
            }
        }
        if (editFields.backgroundUrl && applicationProfile.backgroundUrl?.startsWith("data:image")) {
            editedApplication.backgroundUrl = applicationProfile.backgroundUrl;
        }
        if (editFields.pageIcon && applicationProfile.pageIcon?.startsWith("data:image")) {
            editedApplication.pageIcon = applicationProfile.pageIcon;
        }
        if (editFields.iconUrl && applicationProfile.iconUrl?.startsWith("data:image")) {
            editedApplication.iconUrl = applicationProfile.iconUrl;
        }
        return editedApplication;
    }
    postRecordSaved = (response: WebResponse) => { 
        this.props.setApplicationProfile(response.applicationProfile);
    }
    render()
    {
        const applicationProfile: ApplicationProfile | undefined = this.state.applicationProfile;
        if (!applicationProfile) return null;
        const editFields: EditFields = this.state.editFields;
        const bgUrl: string = applicationProfile.backgroundUrl ?? "";
        const pageIcon: string = applicationProfile.pageIcon ?? "";
        const iconUrl: string = applicationProfile.iconUrl ?? "";
        return (
            <div id="ApplicationProfile" className="container-fluid section-body">
                {this.titleTag()}
                <Card title="Profile Data">
                    <form onSubmit={this.saveRecord}>
                        <div className="container-fluid text-center" style={{ marginBottom: '10px' }}>
                            <img style={{ marginBottom: '10px' }} height="100" className="border border-primary" src={bgUrl.startsWith("data:image") ? bgUrl : baseImageUrl() + bgUrl} />
                            <EditImage name="backgroundUrl" edit={editFields.backgroundUrl} updateProperty={this.updateImageField} toggleInput={this.toggleInput} />
                        </div>
                        <FormGroup label="Name">
                            <EditField edit={editFields.name} updateProperty={this.updateProfileProperty} name="name" toggleInput={this.toggleInput} value={applicationProfile.name} />
                        </FormGroup>
                        <FormGroup label="Welcoming Message">
                            <EditField edit={editFields.welcomingMessage} updateProperty={this.updateProfileProperty} name="welcomingMessage" toggleInput={this.toggleInput} value={applicationProfile.welcomingMessage} />
                        </FormGroup>
                        <FormGroup label="Short Description">
                            <EditField edit={editFields.shortDescription} updateProperty={this.updateProfileProperty} name="shortDescription" toggleInput={this.toggleInput} value={applicationProfile.shortDescription} />
                        </FormGroup>
                        <FormGroup label="Address">
                            <EditField edit={editFields.address} updateProperty={this.updateProfileProperty} name="address" toggleInput={this.toggleInput} value={applicationProfile.address} />
                        </FormGroup>
                        <FormGroup label="About">
                            <EditField edit={editFields.about} updateProperty={this.updateProfileProperty} name="about" toggleInput={this.toggleInput} value={applicationProfile.about} />
                        </FormGroup>
                        <FormGroup label="Contact">
                            <EditField edit={editFields.contact} updateProperty={this.updateProfileProperty} name="contact" toggleInput={this.toggleInput} value={applicationProfile.contact} />
                        </FormGroup>
                        <FormGroup label="Background Color">
                            <EditField type="color" edit={editFields.color} updateProperty={this.updateProfileProperty} name="color" toggleInput={this.toggleInput} value={applicationProfile.color} />
                        </FormGroup>
                        <FormGroup label="Font Color">
                            <EditField type="color" edit={editFields.fontColor} updateProperty={this.updateProfileProperty} name="fontColor" toggleInput={this.toggleInput} value={applicationProfile.fontColor} />
                        </FormGroup>
                        <FormGroup label="Application Icon">
                            <img style={{ marginBottom: '10px' }} height="100" className="border border-primary" src={pageIcon.startsWith("data:image") ? pageIcon : baseImageUrl() + pageIcon} />
                            <EditImage name="pageIcon" edit={editFields.pageIcon} updateProperty={this.updateImageField} toggleInput={this.toggleInput} />
                        </FormGroup>
                        <FormGroup label="Logo">
                            <img style={{ marginBottom: '10px' }} height="100" className="border border-primary" src={iconUrl.startsWith("data:image") ? iconUrl : baseImageUrl() + iconUrl} />
                            <EditImage name="iconUrl" edit={editFields.iconUrl} updateProperty={this.updateImageField} toggleInput={this.toggleInput} />
                        </FormGroup>
                        <FormGroup  >
                            {this.state.fieldChanged() ? <input type="submit" className="btn btn-success" value="Save" /> : null}
                        </FormGroup>
                    </form>
                </Card>
            </div>
        )
    }

}

const mapDispatchToProps = (dispatch: Function) => ({
    setApplicationProfile: (applicationProfile: ApplicationProfile) => dispatch(setApplicationProfile(applicationProfile)),
})

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(EditApplicationProfile))