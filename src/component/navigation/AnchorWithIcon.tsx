
import React from 'react';
import { Link } from 'react-router-dom';

const AnchorWithIcon = (props) => {
  const content = React.useMemo(() => {
    return (
      <>
        {
          props.iconClassName &&
          <i className={`${props.iconClassName} ${props.children ? 'mr-2' : ''} `} />
        }
        {props.children}
      </>
    );
  }, []);
  
  if (props.show === false)
    return null;
  
  const btnClassName = props.className ?? "btn btn-outline-secondary";  
  
  if (props.to) {
    return (
      <Link
        {...props.attributes}
        to={props.to}
        style={props.style}
        onClick={props.onClick}
        className={btnClassName}
      >
        {content}
      </Link>
    );
  }
  return (
    <a
      {...props.attributes}
      style={props.style}
      onClick={props.onClick}
      className={btnClassName}
    >
      {content}
    </a>
  );
}

export default AnchorWithIcon;