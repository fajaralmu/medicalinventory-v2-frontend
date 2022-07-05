

import React, { ChangeEvent, FormEvent, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { performLogin } from '../../../redux/actionCreators';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import BaseComponent from './../../BaseComponent';
import Spinner from './../../loader/Spinner';
import './Login.css';

class State {
    loading = false;
    username = "";
    password = "";
}
class Login extends BaseComponent<any, State> {
    constructor(props) {
        super(props);
        this.state = new State();
    }    
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
        if (this.isUserLoggedIn()) {
            this.props.history.push("/dashboard");
        }
    }
    render() {
        return (
            <div id="Login" className="text-center">
                <Icon />
                <form name='login' onSubmit={(e) => { this.login(e) }}
                    method='POST' className="form-signin">
                    <UsernameField value={this.state.username} onChange={this.handleInputChange} />
                    <PasswordField value={this.state.password} onChange={this.handleInputChange} />
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
        <input
            name="password"
            value={value}
            onChange={onChange}
            type="password"
            id="inputPassword"
            className="form-control border border-dark"
            placeholder="Password"
            required
        />
    </Fragment>
}
const UsernameField = ({ value, onChange }) => {
    return (<Fragment>
        <label className="sr-only">Nama Pengguna</label>
        <input 
            name="username"
            value={value}
            onChange={onChange}
            type="text"
            id="username"
            className="form-control border border-dark"
            placeholder="Username"
            required
            autoFocus
        />
    </Fragment>)
}

const Icon = () => {
    return (
        <svg style={{ marginTop: '20px' }} width="200" height="201"  >
            <g fill="transparent" stroke="black" strokeWidth={3}>
                <path 
                    className="animated-svg house"
                    d="M 100 0 L 0 100 L 15 100 L 15 200 L 185 200  L 185 100 L 200 100  Z"
                />
                <circle
                    className="animated-svg circle"  
                    cx={100}
                    cy={122}
                    r={68}
                />
                <path
                    className="animated-svg plus"  
                    d="M 41 111 L 88 111 L 88 64 L 113 64 
                    L 113 111 L 158 111 L 158 135 L 113 135 
                    L 113 181 L 88 181 L 88 135 L 41 135 Z" 
                />
            </g>
        </svg>
    )
}

const mapDispatchToProps = (dispatch: Function) => ({
    performLogin: (username: string, password: string, app: any) => dispatch(performLogin(username, password, app))
})

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(Login))