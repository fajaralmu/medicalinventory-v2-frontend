
import React from 'react';
import './Spinner.css';

const Spinner = (props: {show?: boolean}) => {
    const innerDivs:JSX.Element[] = new Array<JSX.Element>();
    for (let i = 0; i <= 11; i++) {
        innerDivs.push(<div key={"spinner-item-"+i}></div>);
    }
    return (
        <div 
            style={{ width:'85px', height:'85px' }}
            className="container-fluid text-center d-block"
        >
                <div
                    style={{visibility: props.show === false?'hidden':'visible'}}
                    className="lds-spinner"
                >
                {innerDivs}
            </div>
        </div>
    )
}

export default Spinner;
