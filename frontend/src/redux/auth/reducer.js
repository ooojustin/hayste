import { parseSerializerError } from "../../common/utils";

const INIT_STATE = {
    user: null,
    token: null,
    loading: false,
    splash: false,
    error: null
};

const reducer = (state = INIT_STATE, action) => {
    switch (action.type) {    

        case "LOGIN_TOKEN_START":
            localStorage.setItem("token", action.token);
            return { 
                ...state, 
                token: action.token, 
                loading: true, 
                splash: action.pageLoad 
            };

        case "LOGIN_TOKEN_END":
            const user = "data" in action ? action.data : null;
            const token = user != null ? state.token : null;
            return { 
                ...state, 
                user, token,
                loading: false, 
                splash: false
            };

        case "LOGIN_CREDENTIALS_END":
            let lce_error = "An unknown exception has occurred.";
            if (action.success) {
                return { 
                    ...state, 
                    token: action.token, 
                    loading: false,
                    error: null
                };
            } else if (action.data)
                lce_error = parseSerializerError(action.data);
            return { 
                ...state, 
                token: null, 
                loading: false, 
                error: lce_error 
            };

        case "LOGIN_CREDENTIALS_START":
            return { 
                ...state, 
                user: null, 
                token: null,
                loading: true,
                error: null
            };

        default:
            return { ...state };

    }
}

export default reducer;
