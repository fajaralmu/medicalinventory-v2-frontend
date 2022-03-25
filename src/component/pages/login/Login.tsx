

import React, { RefObject, Component, FormEvent, Fragment, ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import './Login.css';
import { performLogin } from '../../../redux/actionCreators';
import Spinner from './../../loader/Spinner';
class IState {
    loading: boolean = false; username: string = ""; password: string = "";
}
class Login extends BaseComponent {
    state: IState = new IState();
    
    startLoading = () => this.setState({ loading: true });
    endLoading = () => this.setState({ loading: false });
    login(e: FormEvent) {
        e.preventDefault();
        this.props.performLogin(this.state.username, this.state.password, this);
    }
    componentDidMount() {
        document.title = "Login";
        if (this.isUserLoggedIn()) {
            this.props.history.push("/dashboard");
        }
    }
    componentDidUpdate() {

        // console.debug("Login update");
        // console.debug("logged in : ", this.props.loginStatus);
        // console.debug("logged user : ", this.getLoggedUser());
        if (this.isUserLoggedIn()) {
            this.props.history.push("/dashboard");
        }
    }
    updateCredentialProperty = (e: ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        const name: string | null = target.getAttribute("name");
        if (null == name) return;
        this.setState({ [name]: target.value });
    }
    render() {
        return (
            <div id="Login" className="text-center">


                <svg style={{ marginTop: '20px' }} width="200" height="201"  >
                    <g fill="transparent" stroke="black" strokeWidth={3}>
                        <path className="animated-svg house"
                            d="M 100 0 L 0 100 L 15 100 L 15 200 L 185 200  L 185 100 L 200 100  Z"
                        />
                        <circle className="animated-svg circle"  
                            cx={100} cy={122} r={68} />
                        <path className="animated-svg plus"  
                            d="M 41 111 L 88 111 L 88 64 L 113 64 
                            L 113 111 L 158 111 L 158 135 L 113 135 
                            L 113 181 L 88 181 L 88 135 L 41 135 Z" 
                        />
                    </g>
                </svg>
                <form name='login' onSubmit={(e) => { this.login(e) }}
                    method='POST' className="form-signin">
                    <UsernameField value={this.state.username} onChange={this.updateCredentialProperty} />
                    <PasswordField value={this.state.password} onChange={this.updateCredentialProperty} />
                    {this.state.loading ? <Spinner /> : <button className="btn btn-lg btn-dark btn-block" type="submit">Masuk</button>}
                    <input name="transport_type" type="hidden" value="rest" />
                </form>
            </div>
        )
    }

}
const PasswordField = ({ value, onChange }) => {
    return <Fragment>
        <label className="sr-only">Kata Sandi</label>
        <input name="password" value={value} onChange={onChange} type="password" id="inputPassword" className="form-control border border-dark"
            placeholder="Password" required />
    </Fragment>
}
const UsernameField = ({ value, onChange }) => {
    return (<Fragment>
        <label className="sr-only">Nama Pengguna</label>
        <input name="username" value={value} onChange={onChange} type="text" id="username" className="form-control border border-dark"
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