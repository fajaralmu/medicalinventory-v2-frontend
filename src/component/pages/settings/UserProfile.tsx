import { resolve } from 'inversify-react';
import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import { baseImageUrl } from '../../../constant/Url';
import WebResponse from '../../../models/common/WebResponse';
import { toBase64v2 } from '../../../utils/ComponentUtil';
import Card from '../../container/Card';
import FormGroup from '../../form/FormGroup';
import User from './../../../models/User';
import { setLoggedUser } from './../../../redux/actionCreators';
import UserService from './../../../services/UserService';
import BaseUpdateProfilePage from './BaseUpdateProfilePage';
import { EditField, EditImage } from './settingHelper';
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
            if (this.editFields[key] == true) {
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
        if (null == target) return;
        const user: User | undefined = this.state.user;
        if (!user) return;

        user[target.name] = target.value;
        this.setState({ user: user });
    }
    updateProfleImage = (e:ChangeEvent) => {
        const target: HTMLInputElement | null = e.target as HTMLInputElement;
        if (null == target) return;
        const app = this;
        const fileName:string|undefined = target.files ? target.files[0].name : undefined;
        if (!fileName) return;
        toBase64v2(target).then(function(imageData) {
           app.setProfileImage(imageData);
        }).catch(console.error);
    }
    setProfileImage = (imageData:string) => {
        const user:User|undefined = this.state.user;
        if (!user) return;
        user.profileImage = imageData;
        this.setState({user:user});
    }
    toggleInput = (e: MouseEvent) => {
        const target: HTMLAnchorElement | null = e.target as HTMLAnchorElement;
        const user: User | undefined = this.state.user;
        const actualLoggedUser: User | undefined = this.getLoggedUser();
        if (null == target || !user || !actualLoggedUser) {
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
            user[propertyName] = actualLoggedUser[propertyName];
        }
        this.setState({ user: user, editFields: editFields });
    }
    
    doSaveRecord = () => {
        const user: User | undefined = this.getEditedRecord();
        if (!user) return;
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
            const element:boolean = editFields[key];
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
        const user: User | undefined = this.state.user;
        if (!user) return null;
        const editFields: EditField = this.state.editFields;
        return (
            <div id="UserProfile" className="container-fluid section-body">
                {this.titleTag()}
                <Card title="Profile Data">
                    <form onSubmit={this.saveRecord}>
                        <div className="container-fluid text-center" style={{marginBottom:'10px'}}>
                            <img style={{marginBottom:'10px'}} width="100" height="100" className="rounded-circle border border-primary" src={user.profileImage?.startsWith("data:image")?user.profileImage:baseImageUrl() + user.profileImage} />
                            <EditImage name="profileImage" edit={editFields.profileImage} updateProperty={this.updateProfleImage} toggleInput={this.toggleInput} />
                        </div>
                        <FormGroup label="User Name">
                            <EditField edit={editFields.username} updateProperty={this.updateProfileProperty} name="username" toggleInput={this.toggleInput} value={user.username} />
                        </FormGroup>
                        <FormGroup label="Name">
                            <EditField edit={editFields.displayName} updateProperty={this.updateProfileProperty} name="displayName" toggleInput={this.toggleInput} value={user.displayName} />
                        </FormGroup>
                        <FormGroup label="Password">
                            <EditField edit={editFields.password} updateProperty={this.updateProfileProperty} name="password" toggleInput={this.toggleInput} value={user.password} />
                        </FormGroup>
                        <FormGroup  >
                           {this.state.fieldChanged()? <input type="submit" className="btn btn-success" value="Save" />:null}
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
)(UserProfile))