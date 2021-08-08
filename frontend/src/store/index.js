import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import Thunk from 'redux-thunk';
import reducers from '../redux/reducers';

export const configureStore = () =>
    createStore(reducers, composeWithDevTools(applyMiddleware(Thunk)));
