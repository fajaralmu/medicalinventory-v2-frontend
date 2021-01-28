

import React, { RefObject, Component, FormEvent, Fragment, ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import './Login.css';
import { performLogin } from '../../../redux/actionCreators';
import Spinner from './../../loader/Spinner';
class IState {
    loading:boolean = false; username:string = ""; password: string = "";
}
class Login extends BaseComponent{
    state:IState = new IState();
    constructor(props: any) {
        super(props, false);
    }
    startLoading = () => this.setState({ loading: true });
    endLoading = () => this.setState({ loading: false });
    login(e: FormEvent) {
        e.preventDefault();
        this.props.performLogin(this.state.username,this.state.password, this);
    }
    componentDidMount(){
        document.title = "Login";
        if (this.isUserLoggedIn()) {
            this.props.history.push("/dashboard");
        }
    }
    componentDidUpdate(){
    
        console.debug("Login update");
        console.debug("logged in : ", this.props.loginStatus);
        console.debug("logged user : ", this.getLoggedUser());
        if (this.isUserLoggedIn()) {
            this.props.history.push("/dashboard");
        }
    }
    updateCredentialProperty = (e:ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        const name:string|null = target.getAttribute("name");
        if (null == name) return;
        this.setState({[name]: target.value});
    }
    render() {
        return (
            <div id="Login">
                <form name='login' onSubmit={(e) => { this.login(e) }}
                    method='POST' className="form-signin">
                    <div className="text-center">
                        <h2><i className="fas fa-user-circle"></i></h2>
                        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                    </div>
                    <UsernameField value={this.state.username} onChange={this.updateCredentialProperty}/>
                    <PasswordField value={this.state.password} onChange={this.updateCredentialProperty}/>
                    {this.state.loading ? <Spinner/>:<button className="btn btn-lg btn-success btn-block" type="submit">Sign in</button>}
                    <input name="transport_type" type="hidden" value="rest" />
                </form>
            </div>
        )
    }

}
const PasswordField = ({value, onChange}) => {
    return <Fragment>
        <label className="sr-only">Password</label>
        <input name="password" value={value} onChange={onChange} type="password" id="inputPassword" className="form-control"
            placeholder="Password" required />
    </Fragment>
}
const UsernameField = ({value, onChange}) => {
    return (<Fragment>
        <label className="sr-only">Username</label>
        <input name="username" value={value} onChange={onChange} type="text" id="username" className="form-control"
            placeholder="Username" required autoFocus />
    </Fragment>)
}
const mapDispatchToProps = (dispatch: Function) => ({
    performLogin: (username: string, password: string, app: any) => dispatch(performLogin(username, password, app))
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(Login))