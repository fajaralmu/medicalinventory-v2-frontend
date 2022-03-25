
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
            <a
                style={this.props.style}
                onClick={this.props.onClick}
                className={btnClassName}
                {...this.props.attributes}
            >
                {
                    this.props.iconClassName &&
                    <i className={`${this.props.iconClassName} mr-2`}/>
                }
                {this.props.children}
            </a>
        )
    }
}