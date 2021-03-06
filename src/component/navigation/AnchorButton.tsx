
import React, { Component } from 'react';
interface IProps {
    show?:undefined|boolean;
    className?:undefined|string;
    style?:undefined|any;
    onClick?:undefined|any;
    iconClassName?:undefined|string;
    attributes?:undefined|any;
}
export default class AnchorButton extends Component<IProps, any>
{
    constructor(props:any) {
        super(props);
    }
    render() {
        if (this.props.show == false) return null;
        const btnClassName = this.props.className??"btn btn-outline-secondary";
        return (
            <a style={this.props.style} {...this.props.attributes} onClick={this.props.onClick} className={btnClassName} >
                {this.props.iconClassName?
                <span style={this.props.children?{marginRight:'5px'}:{}}><i className={this.props.iconClassName}/></span>
                :
                null}
                {this.props.children}
            </a>
        )
    }
}