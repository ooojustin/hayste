import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import ReactModal from "react-modal";

const Modal = props => {

    // clone props and remove the ones that shouldn't be passed to the react modal
    let cprops = Object.assign({}, props);
    delete cprops.children;

    // add custom css classnames (see "src/css/modal.css")
    cprops.className = classnames("modal", cprops.className || "");
    cprops.overlayClassName = classnames("modal-overlay", cprops.overlayClassName || "");

    return (
        <ReactModal 
            className="modal"
            overlayClassName="modal-overlay"
            {...cprops}
        >
            { (props.title || props.onClose) &&
                <div className="flex flex-row justify-between text-xl">
                    <span className="font-bold">
                        {props.title}
                    </span>
                    <span>
                        { props.onClose &&
                            <svg onClick={props.onClose} xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 cursor-pointer text-red-400 hover:text-red-200" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        }
                    </span>
                </div>
            }
            {props.children}
        </ReactModal>
    );

}

Modal.propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func
};

export default Modal;
