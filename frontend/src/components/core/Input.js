import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const icons = {
    user:
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>,
    mail:
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>,
    lock:
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
};

const Input = props => {

    let classes = [
        "outline-none",
        "bg-white",
        "bg-opacity-11",
        "w-full",
        "text-h-gray-200",
        "focus:text-white",
        "placeholder-h-gray-200",
        "focus:placeholder-w",
        "focus:ring-1",
        "ring-h-gray-200",
        "duration-500",
        "rounded-lg",
        "shadow-lg"
    ];

    if (props.large)
        classes.push("py-3");
    else
        classes.push("py-2");
    
    const icon = props.icon ? icons[props.icon] : null;
    if (icon)
        classes.push("pl-12", "pr-3");
    else
        classes.push("px-3");

    let inputProps = { ...props };
    delete inputProps.large;
    delete inputProps.icon;
    delete inputProps.children;
    delete inputProps.className;

    return (
        <div className="flex text-h-gray-200 focus-within:text-white items-center duration-500">
            { icon }
            <input
                className={classnames(...classes, props.className)}
                {...inputProps}
            />
        </div>
    );

}

Input.propTypes = {
    large: PropTypes.bool,
    icon: PropTypes.string,
    type: PropTypes.string
}

Input.defaultProps = {
    type: "text"
};

export { Input };
