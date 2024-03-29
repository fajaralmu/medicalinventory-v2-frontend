import { resolve } from 'inversify-react';
import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import WebResponse from '../../../models/common/WebResponse';
import Card from '../../container/Card';
import FormGroup from '../../form/FormGroup';
import User from './../../../models/User';
import { setLoggedUser } from './../../../redux/actionCreators';
import UserService from './../../../services/UserService';
import BaseUpdateProfilePage from './BaseUpdateProfilePage';
import { EditField } from './settingHelper';
interface EditField { username: boolean, displayName: boolean, password: boolean, profileImage: boolean }
class IState {
  user?: User = undefined;
  editFields: EditField = {
    username: false,
    displayName: false,
    password: false,
    profileImage: false
  };
  fieldChanged = (): boolean => {
    for (const key in this.editFields) {
      if (this.editFields[key] === true) {
        return true;
      }
    }
    return false;
  }
}
class UserProfile extends BaseUpdateProfilePage {
  @resolve(UserService)
  private userService: UserService;
  state: IState = new IState();
  constructor(props: any) {
    super(props, "Profil Pemgguna");
    this.state.user = Object.assign(new User(), this.getLoggedUser());
  }
  updateProfileProperty = (e: ChangeEvent) => {
    const target: HTMLInputElement | null = e.target as HTMLInputElement;
    if (!target) return;
    const { user } = this.state;
    if (!user) return;

    user[target.name] = target.value;
    this.setState({ user });
  }
  toggleInput = (e: MouseEvent) => {
    const target = e.target as HTMLAnchorElement;
    const { user } = this.state;
    const actualLoggedUser = this.getLoggedUser();
    if (!target || !user || !actualLoggedUser) {
      return;
    }
    const propertyName = target.getAttribute("data-name");
    if (!propertyName) {
      return;
    }
    const enabled: boolean = target.getAttribute('data-enabled') === 'true';
    const editFields = this.state.editFields;
    editFields[propertyName] = enabled;
    if (!enabled) {
      user[propertyName] = actualLoggedUser[propertyName];
    }
    this.setState({ user, editFields });
  }

  doSaveRecord = () => {
    const user = this.getEditedRecord();
    if (!user) {
      return;
    }
    if (user.profileImage) {
      this.commonAjaxWithProgress(
        this.userService.updateProfile,
        this.recordSaved, this.showCommonErrorAlert,
        user
      )
    } else {
      this.commonAjax(
        this.userService.updateProfile,
        this.recordSaved, this.showCommonErrorAlert,
        user
      )
    }
  }
  getEditedRecord = (): User | undefined => {
    const user: User | undefined = this.state.user;
    const editFields: EditField = this.state.editFields;
    if (!user) return undefined;
    const editedUser: User = new User();
    for (const key in editFields) {
      const element: boolean = editFields[key];
      if (element && key != 'profileImage') {
        editedUser[key] = user[key];
      }
    }
    if (editFields.profileImage && user.profileImage?.startsWith("data:image")) {
      editedUser.profileImage = user.profileImage;
    }
    return editedUser;
  }
  postRecordSaved = (response: WebResponse) => {
    this.props.setLoggedUser(response.user);
  }

  render() {
    const { user, editFields } = this.state;
    if (!user) {
      return null;
    }
    const { username, displayName, password } = user;
    return (
      <div id="UserProfile" className="container-fluid section-body">
        {this.titleTag()}
        <Card title="Profile Data">
          <form onSubmit={this.saveRecord}>
            <FormGroup label="User Name">
              <EditField
                edit={editFields.username}
                updateProperty={this.updateProfileProperty}
                name="username"
                toggleInput={this.toggleInput}
                value={username}
              />
            </FormGroup>
            <FormGroup label="Name">
              <EditField
                edit={editFields.displayName}
                updateProperty={this.updateProfileProperty}
                name="displayName"
                toggleInput={this.toggleInput}
                value={displayName}
              />
            </FormGroup>
            <FormGroup label="Password">
              <EditField
                edit={editFields.password}
                updateProperty={this.updateProfileProperty}
                type="password"
                name="password"
                toggleInput={this.toggleInput}
                value={password}
              />
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
  setLoggedUser: (user: User) => dispatch(setLoggedUser(user)),
})

export default withRouter(connect(
  mapCommonUserStateToProps,
  mapDispatchToProps
)(UserProfile));
