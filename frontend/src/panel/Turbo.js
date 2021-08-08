import React, { Component, Fragment } from "react";
import { toast } from "react-toastify";
import PageVisibility from 'react-page-visibility';

import { css } from "@emotion/react";
import PulseLoader from "react-spinners/PulseLoader";
import PropagateLoader from "react-spinners/PropagateLoader";

import { Input } from "../components/core";
import Modal from "../components/Modal";
import SwapCard from "../components/SwapCard";
import AccountSelect from "../components/AccountSelect";

import { api } from "../redux/auth/actions";
import { clone } from "../common/utils";

const init_adding = {
    target: "",
    threads: 10,
    account: null,
    open: false,
    loading: false
};

export default class Turbo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_visible: true,
            adding: clone(init_adding),
            loading: false,
            data: null,
        }
    }

    componentDidMount() {
        // load swaps on page load & automatically every 5 seconds
        this.loadSwaps();
        setInterval(() => this.loadSwaps(false), 5000);
        setInterval(this.updateCounts, 2000);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.data && this.state.data) {
            // detect newly claimed ids automatically for a ui notification
            const prevClaimed = prevState.data.claimed;
            const claimed = this.state.data.claimed;
            if (prevClaimed.length !== claimed.length) {
                claimed.forEach(o => {
                    const pc = prevClaimed.filter(po => po.id === o.id);
                    if (!pc.length)
                        toast.success(`Claimed an id: ${o.target}`);
                });
            }    
        }
    }

    loadSwaps = (load = true) => {
        if (load)
            this.setState({ loading: true });
        api.get("steam/swaps/split")
        .then(r => {
            this.setState({
                loading: false,
                data: r.data
            });
        })
        .catch(ex => {
            this.setState({ loading: false });
            toast.error("An error occurred while loading your turbos.")           
        });
    }

    updateCounts = () => {
        
        if (!this.state.is_visible)
            return;

        const swaps = this.state.data;
        if (!swaps)
            return;
        
        const ids = [];
        swaps.waiting.forEach(s => ids.push(s.id));
        api.post("steam/swaps/counts", ids)
        .then(r => {
            this.setState(ps => ({ 
                data: { 
                    waiting: r.data,
                    ...ps.data
                }    
            }));
        });

    }

    handleVisibilityChange = is_visible => this.setState({ is_visible });

    setAdding = (obj) => this.setState(ps => ({ adding: { ...ps.adding, ...obj }}));

    closeAdding = () => this.setAdding(init_adding);

    onChange = e => {
        const { name, value } = e.target;
        this.setAdding({ [name]: value });
    }

    addDialog = () => {
        const { target, account } = this.state.adding;
        const threads = parseInt(this.state.adding.threads) || 0;
        const disabled = !target || !account || !threads || threads > 100;
        return (
            <Modal title="Create Instance" isOpen={this.state.adding.open} onClose={this.closeAdding} className="w-1/3">
                <div className="flex flex-col space-y-5 mt-5">
                    <PropagateLoader 
                        color="white"
                        loading={this.state.adding.loading}
                        css={css`
                            text-align: center;
                            margin-bottom: 1.25rem;
                        `}
                    />
                    <Input value={target} name="target" onChange={this.onChange} placeholder="Target" type="text" className="text-white" />
                    <Input value={threads} name="threads" onChange={this.onChange} placeholder="Threads" type="number" min={1} max={100} className="text-white" />
                    <AccountSelect value={account} onChange={o => this.setAdding({ account: o })} />
                    <button onClick={this.createSwap} disabled={disabled} className="flex justify-center rounded-xl bg-green-700 hover:bg-green-800 disabled:bg-gray-500 disabled:cursor-default text-white font-semibold py-3">
                        Submit
                    </button>
                </div>
            </Modal>
        );
    }

    createSwap = () => {
        const params = {
            target: this.state.adding.target,
            threads: this.state.adding.threads,
            account: this.state.adding.account.value
        };
        this.setAdding({ loading: true });
        api.post("steam/swaps", params)
        .then(r => {
            toast.success("Created new turbo instance.");
            this.closeAdding();
            this.loadSwaps();
        })
        .catch(ex => {
            this.setAdding({ loading: false });
            console.log("Failed to create SteamSwap instance:", ex);
            toast.error("An error occurred while loading your turbos.");
        });
    }

    render() {
        const swaps = this.state.data;
        return (
            <PageVisibility onChange={this.handleVisibilityChange}>
                <div>
                    <div className="flex flex-row gap-2 text-xl">
                        Turbo
                        <div className="cursor-pointer mt-1 text-green-600 hover:text-green-300" onClick={() => this.setAdding({ open: true })}>
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
                    <div className="grid grid-cols-4 gap-4 mt-3">
                        { swaps && 
                            <Fragment>
                                <Fragment>
                                    {
                                        swaps.waiting.map((swap, i) => (
                                            <SwapCard data={swap} key={i} />
                                        ))
                                    }
                                </Fragment>
                                <Fragment>
                                    {
                                        swaps.claimed.map((swap, i) => (
                                            <SwapCard data={swap} key={i} />
                                        ))
                                    }
                                </Fragment>
                                <Fragment>
                                    {
                                        swaps.failed.map((swap, i) => (
                                            <SwapCard data={swap} key={i} />
                                        ))
                                    }
                                </Fragment>
                            </Fragment>
                        }
                    </div>
                    {this.addDialog()}
                </div>
            </PageVisibility>
        );
    }

}
