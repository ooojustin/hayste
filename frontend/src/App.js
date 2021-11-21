import React from "react";
import { Helmet }  from "react-helmet";
import { Provider } from "react-redux";
import { configureStore } from "./store";

import { BrowserRouter } from "react-router-dom";
import RouteManager from "./components/RouteManager";

import { ToastContainer } from "react-toastify";

import Modal from "react-modal";
Modal.setAppElement("#root");

function App() {
    const store = configureStore();
    return (
        <Provider store={store}>
            <div className="max-h-screen overflow-hidden min-h-screen bg-gradient-to-tr from-h-gray-900 to-h-gray-800 px-24 py-12 text-h-gray-200 text-sm font-semibold w-screen flex items-center justify-center absolute -z-10">
                
                {/* document head manager */}
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>hayste</title>
                    <link rel="canonical" href="https://hayste.co" />
                </Helmet>
                
                {/* container + default config for toast notifications */}
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                />

                <BrowserRouter>
                    <RouteManager />
                </BrowserRouter>

            </div>
        </Provider>
    );
}

export default App;
