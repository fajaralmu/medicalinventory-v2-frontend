
import React from 'react';
import './Spinner.css';

const Spinner = (props: { show?: boolean }) => {
  const innerDivs = React.useMemo(() => {
    const items = new Array<JSX.Element>();
    for (let i = 0; i <= 11; i++) {
      items.push(<div key={`spinner-item-${i}`} />);
    }
    return items;
  }, []);
  return (
    <div
      style={{ width: '85px', height: '85px' }}
      className="container-fluid text-center d-block"
    >
      <div
        style={{ visibility: props.show === false ? 'hidden' : 'visible' }}
        className="lds-spinner"
      >
        {innerDivs}
      </div>
    </div>
  )
}

export default Spinner;
