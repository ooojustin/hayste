import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";

import { 
    Route, 
    Switch,
    withRouter
} from "react-router-dom";

import PanelLayout from "../panel/Layout/index";

import HomePage from "../pages/Home";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";

import { loginWithToken } from "../redux/auth/actions";

class RouteManager extends Component {

    componentDidMount() {

        if (!this.props.user) {
            const token = localStorage.getItem("token");
            if (token != null)
                this.props.loginWithToken(token, true);
        }

    }

    componentDidUpdate(prevProps) {

        if (!this.props.splash) {
            if (!prevProps.token && this.props.token)
                this.props.loginWithToken(this.props.token);
        }

        if (!prevProps.user && this.props.user) {
            console.log("Logged in:", this.props.user);
            this.props.history.push("/panel/dashboard");
        }

        if (prevProps.error !== this.props.error && this.props.error)
            toast.error(this.props.error);

    }

    render() {
        return (
            <Fragment>
                <PanelLayout />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />
                </Switch>
            </Fragment>
        );
    }

}

const mapStateToProps = state => state.auth;

export default withRouter(connect(mapStateToProps, {
    loginWithToken
})(RouteManager))
