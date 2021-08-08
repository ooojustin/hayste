import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

import { css } from "@emotion/react";
import PropagateLoader from "react-spinners/PropagateLoader";

import { 
    Button, 
    Input 
} from "../components/core";

import { 
    api,
    loginWithToken
} from "../redux/auth/actions";
import { parseSerializerError } from "../common/utils";

class Register extends Component {

    state = {
        username: "",
        email: "",
        password1: "",
        password2: "",
        loading: false
    };

    onChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    onRegister = e => {

        e.preventDefault();
        
        if (this.state.password1 !== this.state.password2) {
            toast.error("Your password and confirmation password do not match.");
            return;
        }

        const params = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password1
        };
        
        this.setState({ loading: true });
        api.post("auth/register", params)
        .then(r => {
            this.setState({ loading: false });
            const token = r.data.token;
            this.props.loginWithToken(token);
        })
        .catch(ex => {
            this.setState({ loading: false });
            console.log(ex);
            let msg = "An unknown error has occurred.";
            if (ex.response)
                msg = parseSerializerError(ex.response.data);
            toast.error(msg);
        });

    };

    render() {
        return (
            <Fragment>
                <div className="bg-white bg-opacity-11 backdrop-blur-lg rounded-xl border border-h-gray-200 flex flex-col shadow-2xl px-14 py-8">
                    <div className="flex flex-row items-center mb-8">
                        <div className="h-14 w-14 bg-h-gray-200 rounded-md mr-4 flex-none" />
                        <div className="flex flex-col">
                            <span className="font-semibold text-white text-3xl">steamid.shop</span>
                            <span className="font-normal">We step in, where speed matters the most</span>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-7 mb-20">
                        <PropagateLoader 
                            color="white"
                            loading={this.state.loading}
                            css={css`
                                text-align: center;
                                margin-bottom: 1.25rem;
                            `}
                        />
                        <Input large icon="user" placeholder="Username" name="username" value={this.state.username} onChange={this.onChange} />
                        <Input large icon="mail" placeholder="Email address" name="email" value={this.state.email} onChange={this.onChange} />
                        <Input large icon="lock" placeholder="Password" type="password" name="password1" value={this.state.password1} onChange={this.onChange} />
                        <Input large icon="lock" placeholder="Confirm password" type="password" name="password2" value={this.state.password2} onChange={this.onChange} />
                        <Button large onClick={this.onRegister}>Register</Button>
                        <span className="self-center font-normal">Already have an account? <Link to="/login"><span className="text-white">Click here</span></Link></span>
                    </div>
                    <div className="text-h-gray-600 font-normal cursor-default self-center">&copy; 2021 STEAMID.SHOP</div>
                </div>
            </Fragment>
        );
    }

}

export default connect(null, {
    loginWithToken
})(Register);
