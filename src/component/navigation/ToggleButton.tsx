import React, { Component } from 'react'
import AnchorButton from './AnchorButton';
interface Props {
    onClick(val:boolean):void,
    active:boolean
}
export default class ToggleButton extends Component<Props, any>{
    
    render() {
        const active = this.props.active;
        return (
            <div className="btn-group">
                <AnchorButton className={"btn  btn-sm " + (active == false ? "btn-dark" : "btn-light")} onClick={(e) => this.props.onClick(false)}  >No</AnchorButton>
                <AnchorButton className={"btn  btn-sm " + (active ? "btn-dark" : "btn-light")} onClick={(e) => this.props.onClick(true)} >Yes</AnchorButton>
            </div>
        )
    }
}