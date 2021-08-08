import React, { Component } from "react";
import AsyncSelect from "react-select/async";

import { loadSteamAccounts } from "../common/requests";

const white = (o = 1) => `rgba(255, 255, 255, ${o})`;
const customStyles = {
    input: provided => ({
        color: white()
    }),
    control: (provided, state) => ({
        ...provided,
        backgroundColor: white(0.09),
        borderColor: state.isFocused ? "rgb(229, 231, 235)" : white(0)
    }),
    option: (provided, state) => ({
        ...provided,
        background: state.isFocused ? white(0.2) : "transparent", //white(state.isFocused ? 0.2 : 0.09),
        color: white()
    }),
    menu: provided => ({
        ...provided,
        background: "black"
    }),
    singleValue: provided => ({
        ...provided,
        color: white()
    })
};

const loadOptions = (query, callback) => {
    loadSteamAccounts(query)
    .then(r => {
        const accounts = r.data;
        const data = accounts.map(o => ({ value: o.id, label: o.username }));
        callback(data);
    })
    .catch(ex => {
        console.log("Failed to load steam accounts in AccountSelect", ex);
    });
};

class AccountSelect extends Component {

    state = {
        query: ""
    }

    changeQuery = query => this.setState({ query });

    render() {
        return (
            <AsyncSelect
                placeholder="Steam Account..."
                loadOptions={loadOptions}
                cacheOptions
                defaultOptions
                onInputChange={this.changeQuery}
                styles={customStyles}
                {...this.props}
            />
        );
    };

}

export default AccountSelect;
