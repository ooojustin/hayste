import React, { Component, Fragment } from "react";
import { toast } from "react-toastify";

import { css } from "@emotion/react";
import PulseLoader from "react-spinners/PulseLoader";
import PropagateLoader from "react-spinners/PropagateLoader";

import { Input } from "../components/core";
import Modal from "../components/Modal";

import {
    loadSteamAccounts,
    addSteamAccount,
    deleteSteamAccount
} from "../common/requests";

export default class Accounts extends Component {

    state = {
        username: "",
        password: "",
        adding: false,
        adding_loading: false,
        loading: false,
        data: null
    }

    componentDidMount() {
        this.loadAccounts();
    }

    loadAccounts = () => {
        this.setState({ loading: true });
        loadSteamAccounts()
        .then(r => {
            this.setState({
                loading: false,
                data: r.data
            });
        })
        .catch(ex => {
            this.setState({ loading: false });
            toast.error("An error occurred while loading your accounts.");
            console.log("Failed to load steam.SteamAccounts:", ex);
        });
    }

    onChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    addAccount = () => {
        const { username, password } = this.state;
        this.setState({ adding_loading: true });
        addSteamAccount(username, password)
        .then(r => {
            toast.success("Steam account saved.", { autoClose: 3000 });
            this.closeAdd();
            this.loadAccounts();
        })
        .catch(ex => {
            this.setState({ adding_loading: false });
            const status = ex.response ? ex.response.status : null;
            // NOTE: backend.common.exceptions.SteamAccountLoginException.status_code = 470
            const msg = status === 470 ? "Failed to login with provided steam account credentials." : "Failed to save steam account.";
            toast.error(msg);
            console.log("Failed to create steam.SteamAccount:", ex, ex.response);
        });
    }

    closeAdd = () => {
        this.setState({
            adding: false,
            adding_loading: false,
            username: "",
            password: ""
        });
    }

    deleteAccount = account => {
        console.log(account);
        this.setState({ loading: true });
        deleteSteamAccount(account.id)
        .then(r => {
            toast.success("Account removed.", { autoClose: 3000 });
            this.loadAccounts();
        })
        .catch(ex => {
            this.setState({ loading: false });
            toast.error("Failed to delete account.");
            console.log("Failed to delete steam.SteamAccount:", ex);
        });
    }

    addDialog = () => {
        const { username, password } = this.state;
        const disabled = !username || !password;
        return (
            <Modal title="Add an Account" isOpen={this.state.adding} onClose={this.closeAdd} className="w-1/3">
                <div className="flex flex-col space-y-5 mt-5">
                    <PropagateLoader 
                        color="white"
                        loading={this.state.adding_loading}
                        css={css`
                            text-align: center;
                            margin-bottom: 1.25rem;
                        `}
                    />
                    <Input large icon="user" placeholder="Username" name="username" value={this.state.username} onChange={this.onChange} type="text" />
                    <Input large icon="lock" placeholder="Password" name="password" value={this.state.password} onChange={this.onChange} type="password" />
                    <button onClick={this.addAccount} disabled={disabled} className="flex justify-center rounded-xl bg-green-700 hover:bg-green-800 disabled:bg-gray-500 disabled:cursor-default text-white font-semibold py-3">
                        Add Account
                    </button>
                </div>
            </Modal>
        );
    }

    render() {
        const accounts = this.state.data;
        return (
            <Fragment>
                <div className="flex flex-row gap-2 text-xl">
                    Accounts
                    <div className="cursor-pointer mt-1 text-green-600 hover:text-green-300" onClick={() => this.setState({ adding: true })}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                { this.state.loading &&
                    <div className="my-5">
                        <PulseLoader 
                            color="white"
                            loading={this.state.loading}
                            css={css`text-align: left;`}
                        />
                    </div>
                }
                <div className="flex flex-col space-y-3 mt-3 max-w-md">
                    { accounts && accounts.map((account, i) => (
                        <div className="flex flex-row justify-between text-white px-3 py-3 bg-black bg-opacity-20 rounded" key={i}>
                            <span>
                                {account.username}
                            </span>
                            <span>
                                <svg onClick={() => this.deleteAccount(account)} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer text-red-400 hover:text-red-200" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>
                    ))}
                </div>
                {this.addDialog()}
            </Fragment>
        );
    }

}
