import axios from "axios";

const createAxiosInstance = (conf = { }) => {
    return axios.create({
        baseURL: "http://localhost:8000/", // TODO put in a config file, maybe use env
        timeout: 10000,
        ...conf
    });
};

export let api = createAxiosInstance();

export const loginWithToken = (token, pageLoad = false) => dispatch => {
    dispatch({ type: "LOGIN_TOKEN_START", token, pageLoad });
    const conf = { headers: { "Authorization": "Token " + token } };
    api.get("auth/user", conf)
    .then(response => {
        dispatch({ type: "LOGIN_TOKEN_END", data: response.data });
        api = createAxiosInstance(conf); // re-create api instance w/ auth header
    }).catch(ex => {
        dispatch({ type: "LOGIN_TOKEN_END" });
    });
}

export const loginWithCredentials = (username, password) => dispatch => {
    dispatch({ type: "LOGIN_CREDENTIALS_START" });
    api.post("auth/login", { username, password })
    .then(r => {
        dispatch({ 
            type: "LOGIN_CREDENTIALS_END",
            success: true,
            token: r.data.token 
        });
    })
    .catch(ex => {
        dispatch({ 
            type: "LOGIN_CREDENTIALS_END", 
            success: false,
            data: ex.response ? ex.response.data : null
        });
    });
};
