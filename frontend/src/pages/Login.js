import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { css } from "@emotion/react";

import PropagateLoader from "react-spinners/PropagateLoader";

import { 
    Button,
    Input
} from "../components/core";

import {
    loginWithCredentials
} from "../redux/auth/actions";

class Login extends Component {

    state = {
        username: "",
        password: ""
    };
    
    componentDidUpdate(prevProps) {
        const { user } = this.props;
        if (!prevProps.user && user)
            toast.dark(`Welcome back to hayste, ${user.username}!`);
    }

    onChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    submitLogin = e => {
        e.preventDefault();
        const { username, password } = this.state;
        this.props.loginWithCredentials(username, password);
    }

    render() {
        return (
            <Fragment>
                <div className="bg-white bg-opacity-11 backdrop-blur-lg rounded-xl border border-h-gray-200 flex flex-col shadow-2xl px-14 py-8">
                    <div className="flex flex-row items-center mb-8">
                        <div className="h-14 w-14 bg-h-gray-200 rounded-md mr-4 flex-none" />
                        <div className="flex flex-col">
                            <span className="font-semibold text-white text-3xl">hayste.co</span>
                            <span className="font-normal">We step in, where speed matters the most</span>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-7 mb-20">
                        <PropagateLoader 
                            color="white"
                            loading={this.props.loading}
                            css={css`
                                text-align: center;
                                margin-bottom: 1.25rem;
                            `}
                        />
                        <Input large icon="user" placeholder="Username" name="username" value={this.state.username} onChange={this.onChange} type="text" />
                        <Input large icon="lock" placeholder="Password" name="password" value={this.state.password} onChange={this.onChange} type="password" />
                        <Button large onClick={e => this.submitLogin(e)}>Login</Button>
                        <span className="self-center font-normal">Forgot your password? <Link to="/recover"><span className="text-white">Click here</span></Link></span>
                        <span className="self-center font-normal">Want to join hayste? <Link to="/register"><span className="text-white">Click here</span></Link></span>
                    </div>
                    <div className="text-h-gray-600 font-normal cursor-default self-center">&copy; 2021 HAYSTE</div>
                </div>
            </Fragment>
        );
    }

}

const mapStateToProps = state => state.auth;

export default connect(mapStateToProps, {
    loginWithCredentials
})(Login);
