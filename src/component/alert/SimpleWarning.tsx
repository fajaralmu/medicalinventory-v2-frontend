
import React, { Component } from 'react';
export default class SimpleWarning extends Component<any, any>
{

    render() {
        if (this.props.show == false) return null;
        return (
            <div className="alert alert-warning">
                {this.props.children??"Error Occured"}
            </div>
        )
    }
}