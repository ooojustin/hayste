import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { 
    Redirect,
    Route, 
    Switch,
    NavLink
} from "react-router-dom";

import NavIcons from "./NavIcons";
import NavLinks, { sections } from "./NavLinks";

const NavItem = props => {
    return (
        <NavLink to={props.path} activeClassName="text-white" className="flex group duration-500 hover:text-white">
            <li className="flex flex-row items-center gap-5">
                { NavIcons[props.icon] }
                { props.text }
                { props.ping && NavIcons.ping }
            </li>
        </NavLink>
    );
}

class PanelLayout extends Component {

    renderPanel = props => {
        
        // force user to login before accessing the panel
        if (!this.props.user)
            return <Redirect to={{ pathname: '/login', state: { from: props.location }} } />;

        return (
            <div className="bg-white bg-opacity-11 flex-1 backdrop-blur-lg rounded-xl border border-h-gray-200 flex flex-row shadow-2xl max-h-full">
                
                {/* sidebar & navigation links */}
                <div className="flex flex-col border-r border-h-gray-400 pl-10 pr-14 py-6">

                    {/* site icon & title */}
                    <div className="flex flex-row items-center mb-9">
                        <div className="h-10 w-10 bg-h-gray-200 rounded-md mr-4"></div>
                        <span className="text-2xl font-semibold text-white">steamid.shop</span>
                    </div>

                    {/* navigation links */}
                    <div className="flex flex-1 flex-col">
                        { sections.map((section, x) => (
                            <Fragment key={x}>
                                <span className="mb-6 cursor-default">{section}</span>
                                <ul className="space-y-5 mb-16">
                                    { NavLinks.filter(o => o.section === section).map((obj, y) => 
                                        <NavItem key={y} {...obj} /> 
                                    )}
                                </ul>
                            </Fragment>
                        ))}
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                        <div className="flex flex-row gap-1.5 cursor-pointer text-red-400 hover:text-red-200" onClick={this.logout}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg> Logout
                        </div>
                        <div className="text-h-gray-600 font-normal cursor-default">
                            &copy; 2021 STEAMID.SHOP
                        </div>
                    </div>
                
                </div>

                {/* dynamically render route content */}
                <div className="flex flex-1 flex-col pr-10 pl-14 py-6">
                    <Switch>
                        {NavLinks.map((obj, i) => (
                            <Route
                                path={obj.path}
                                component={obj.component}
                                exact={Boolean(obj.exact)}
                                key={i}
                            />
                        ))}
                    </Switch>
                </div>

            </div>
        );

    }

    logout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }

    render = () => (<Route path="/panel" render={this.renderPanel} />);

}

const mapStateToProps = state => state.auth;

export default connect(mapStateToProps, null)(PanelLayout);
