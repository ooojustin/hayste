import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const largeStyles = [
    "ring-1",
    "ring-h-gray-200",
    "hover:ring-white",
    "hover:text-white",
    "duration-500",
    "rounded-xl",
    "shadow-lg",
    "py-3"
];

const normalStyles = [
    "text-white",
    "rounded-2xl",
    "px-3",
    "py-1",
    "bg-gradient-to-b"
];

const Button = props => {
    
    let classes = ["flex", "justify-center"];
    if (!props.large) {
        classes.push(...normalStyles);
        switch (props.color) {
            
            default:
                classes.push("from-red-300", "to-red-400");

        }
    } else
        classes.push(...largeStyles);

    let buttonProps = { ...props };
    delete buttonProps.large;
    delete buttonProps.color;
    delete buttonProps.children;
    delete buttonProps.className;

    return (
        <button 
            className={classnames(...classes, props.className)} 
            {...buttonProps}
        >
            {props.children}
        </button>
    );

}

Button.propTypes = {
    large: PropTypes.bool,
    color: PropTypes.string
};

export { Button }; 
