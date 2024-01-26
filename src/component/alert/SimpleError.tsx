
import React, { Component } from 'react'
const SimpleError = (props: { show?: boolean, children?: any }) => {
  const { show, children } = props;
  if (show === false) {
    return null;
  }
  return (
    <div className="alert alert-danger">
      {children ?? "Error Occured"}
    </div>
  );
};

export default SimpleError;