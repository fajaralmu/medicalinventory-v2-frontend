
import React from 'react';
const SimpleWarning = (props: { show?: boolean, children?: any, style?: any }) => {
  if (props.show === false) {
    return null;
  }
  return (
    <div style={props.style} className="alert alert-warning">
      {props.children ?? "Error Occured"}
    </div>
  );
};

export default SimpleWarning;