
import React, { Component } from 'react';
interface Props {
  attributes?: any,
  title?: string,
  className?: string,
  footerContent?: any,
  children?: any,
}
const Card = (props: Props) => {
  return (
    <div {...props.attributes} className={"card " + props.className}>
      {
        props.title &&
        <div className="card-header">
          {props.title}
        </div>
      }
      <div className="card-body">
        {props.children}
      </div>
      {
        props.footerContent &&
        <div className="card-footer">
          {props.footerContent}
        </div>
      }
    </div>
  )
}
export default Card;
