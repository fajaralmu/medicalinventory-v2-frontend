import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import { baseImageUrl } from '../../../constant/Url';
import ApplicationProfile from '../../../models/ApplicationProfile';
import WebResponse from '../../../models/common/WebResponse';
import { setApplicationProfile } from '../../../redux/actionCreators';
import { toBase64v2 } from '../../../utils/ComponentUtil';
import Card from '../../container/Card';
import FormGroup from '../../form/FormGroup';
import BaseUpdateProfilePage from './BaseUpdateProfilePage';
import { EditField, EditImage } from './settingHelper';
class EditFields {
  name: boolean = false; pageIcon: boolean = false;
  welcomingMessage: boolean = false;
  contact: boolean = false; shortDescription: boolean = false;
  backgroundUrl: boolean = false; address: boolean = false;
  about: boolean = false; color: boolean = false; fontColor: boolean = false;
  iconUrl: boolean = false
}
class IState {
  applicationProfile?: ApplicationProfile = undefined;
  editFields: EditFields = new EditFields()
  fieldChanged = (): boolean => {
    for (const key in this.editFields) {
      if (this.editFields[key] === true) {
        return true;
      }
    }
    return false;
  }
}
class EditApplicationProfile extends BaseUpdateProfilePage {
  state: IState = new IState();
  constructor(props: any) {
    super(props, "Profil Aplikasi");
    this.state.applicationProfile = Object.assign(new ApplicationProfile(), this.getApplicationProfile());
  }
  updateProfileProperty = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    if (null === target) return;
    const applicationProfile: ApplicationProfile | undefined = this.state.applicationProfile;
    if (!applicationProfile) return;

    applicationProfile[target.name] = target.value;
    this.setState({ applicationProfile: applicationProfile });
  }

  updateImageField = (e: ChangeEvent) => {
    const target: HTMLInputElement | null = e.target as HTMLInputElement;
    if (null === target) return;
    const fieldName: string | null = e.target.getAttribute("name");
    if (null === fieldName) {
      return;
    }
    const fileName: string | undefined = target.files ? target.files[0].name : undefined;
    if (!fileName) return;
    toBase64v2(target).then((imageData) => {
      this.setAppProfileField(fieldName, imageData);
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
    if (null === target || !appProfile || !actualAppProfile) {
      return;
    }

    const propertyName: string | null = target.getAttribute("data-name");
    if (null === propertyName) {
      return;
    }
    const enabled: boolean = target.getAttribute('data-enabled') === 'true';
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
        this.recordSaved,
        this.showCommonErrorAlert,
        applicationProfile
      )
    } else {
      this.commonAjax(
        this.masterDataService.updateApplicationProfile,
        this.recordSaved,
        this.showCommonErrorAlert,
        applicationProfile
      )
    }
  }
  getApplicationEditedData = (): ApplicationProfile | undefined => {
    const { applicationProfile, editFields } = this.state;

    if (!applicationProfile) {
      return undefined;
    }
    const { backgroundUrl, pageIcon, iconUrl } = applicationProfile;

    const editedApplication: ApplicationProfile = new ApplicationProfile();
    for (const key in editFields) {
      const element: boolean = editFields[key];
      if (element && key != 'backgroundUrl' && key != 'pageIcon' && key != 'iconUrl') {
        editedApplication[key] = applicationProfile[key];
      }
    }
    if (editFields.backgroundUrl && backgroundUrl?.startsWith("data:image")) {
      editedApplication.backgroundUrl = backgroundUrl;
    }
    if (editFields.pageIcon && pageIcon?.startsWith("data:image")) {
      editedApplication.pageIcon = applicationProfile.pageIcon;
    }
    if (editFields.iconUrl && iconUrl?.startsWith("data:image")) {
      editedApplication.iconUrl = iconUrl;
    }
    return editedApplication;
  }
  postRecordSaved = (response: WebResponse) => {
    this.props.setApplicationProfile(response.applicationProfile);
  }
  render() {
    const { applicationProfile, editFields } = this.state;
    if (!applicationProfile) {
      return null;
    }
    const {
      backgroundUrl,
      pageIcon,
      name,
      welcomingMessage,
      shortDescription,
      about,
      address,
      contact,
      color,
      fontColor } = applicationProfile;

    const updateProp = this.updateProfileProperty;

    return (
      <div id="ApplicationProfile" className="container-fluid section-body">
        {this.titleTag()}
        <Card title="Profile Data">
          <form onSubmit={this.saveRecord}>
            <FormGroup label="Name">
              <EditField edit={editFields.name} updateProperty={updateProp} name="name" toggleInput={this.toggleInput} value={name} />
            </FormGroup>
            <FormGroup label="Welcoming Message">
              <EditField edit={editFields.welcomingMessage} updateProperty={updateProp} name="welcomingMessage" toggleInput={this.toggleInput} value={welcomingMessage} />
            </FormGroup>
            <FormGroup label="Short Description">
              <EditField edit={editFields.shortDescription} updateProperty={updateProp} name="shortDescription" toggleInput={this.toggleInput} value={shortDescription} />
            </FormGroup>
            <FormGroup label="Address">
              <EditField edit={editFields.address} updateProperty={updateProp} name="address" toggleInput={this.toggleInput} value={address} />
            </FormGroup>
            <FormGroup label="About">
              <EditField edit={editFields.about} updateProperty={updateProp} name="about" toggleInput={this.toggleInput} value={about} />
            </FormGroup>
            <FormGroup label="Contact">
              <EditField edit={editFields.contact} updateProperty={updateProp} name="contact" toggleInput={this.toggleInput} value={contact} />
            </FormGroup>
            <FormGroup label="Background Color">
              <EditField type="color" edit={editFields.color} updateProperty={updateProp} name="color" toggleInput={this.toggleInput} value={color} />
            </FormGroup>
            <FormGroup label="Font Color">
              <EditField type="color" edit={editFields.fontColor} updateProperty={updateProp} name="fontColor" toggleInput={this.toggleInput} value={fontColor} />
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