import React, { Component } from 'react'
import AnchorButton from './AnchorButton';
interface Props {
    onClick(val: boolean): void,
    active: boolean,
    yesLabel?: string,
    noLabel?: string
}
const ToggleButton = (props: Props) => {
    const { active } = props;
    const toggleOn = () => props.onClick(true);
    const toggleOff = () => props.onClick(false);
    return (
        <div className="btn-group">
            <AnchorButton className={"btn  btn-sm " + (active ? "btn-dark" : "btn-light")} onClick={toggleOn} >
                {props.yesLabel ?? "Yes"}
            </AnchorButton>
            <AnchorButton className={"btn  btn-sm " + (active == false ? "btn-dark" : "btn-light")} onClick={toggleOff}  >
                {props.noLabel ?? "No"}
            </AnchorButton>

        </div>
    )
}

export default ToggleButton;
