
import React from 'react';
interface IProps {
    show?: undefined | boolean;
    className?: undefined | string;
    style?: undefined | any;
    onClick?: undefined | any;
    iconClassName?: undefined | string;
    attributes?: undefined | any;
    children?: any;
}
const AnchorButton = (props: IProps) => {
    if (props.show == false) return null;
    const btnClassName = props.className ?? "btn btn-outline-secondary";
    return (
        <a
            style={props.style}
            onClick={props.onClick}
            className={btnClassName}
            {...props.attributes}
        >
            {
                props.iconClassName &&
                <i className={`${props.iconClassName} ${props.children ? 'mr-2' : ''}`} />
            }
            {props.children}
        </a>
    )

}

export default AnchorButton;
