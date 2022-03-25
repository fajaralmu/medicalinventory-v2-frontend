
import React, { Component, useState } from 'react';
import AnchorButton from '../navigation/AnchorButton';
const Modal = (props: {
    title?: any,
    toggleable?: boolean,
    showFooter?: boolean,
    show?: boolean,
    style?: any,
    footerContent?: any,
    children?: any,
}) => {
    const [open, setOpen] = useState(false);
    if (props.show === false) { 
        return null;
    }
    const showModal = () => setOpen(true);
    const hideModal = () => setOpen(false);

    const title = props.title ?? "Title";
    if (props.toggleable === true && !open) {
        return (
            <AnchorButton
                style={{ marginBottom: '10px' }}
                onClick={showModal}
                iconClassName="fas fa-angle-down"
            >
                Show {title}
            </AnchorButton>
        )
    }
    const attrs = (({ style, show, footerContent, toggleable, ...props }) => props)(props) // remove b and c
    return (
        <div {...attrs} className="modal-content " style={{ ...props.style, marginBottom: '10px' }}>
            <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                {
                    props.toggleable &&
                    <button
                        type="button"
                        className="btn btn-sm"
                        onClick={hideModal}
                        aria-label="Close"
                    >
                        <span aria-hidden="true">
                            <i className='fas fa-times' />
                        </span>
                    </button>
                }
            </div>
            <div className="modal-body">
                {props.children}
            </div>
            {props.footerContent || props.showFooter === true ?
                <div className="modal-footer">
                    {props.footerContent}
                </div>
                : null}
        </div>
    );
}
export default Modal;
