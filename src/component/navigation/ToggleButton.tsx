import React from 'react';
import './ToggleButton.css';

interface Props {
  onClick(val: boolean): void,
  active: boolean,
  disabled?: boolean,
  yesLabel?: string,
  noLabel?: string,
}
const ToggleButton = (props: Props) => {
  const onClick = () => {
    if (props.disabled === true) {
      return;
    }
    props.onClick(!props.active);
  }
  const yesLabel = props.yesLabel ?? 'ON';
  const noLabel = props.noLabel ?? 'OFF'
  const activeLabel = props.active ? yesLabel : noLabel;

  const active = props.active;
  return (
    <div className="d-flex" style={{ gap: '5px' }}>
      <div onClick={onClick} className={`toggleButtonContainer ${active ? 'bg-info' : 'bg-secondary'}`}>
        <div
          className='bg-light toggleButtonPointer'
          style={{ marginLeft: active ? 16 : 0 }}
        >
        </div>
      </div>
      <span>{activeLabel}</span>
    </div>
  );
};
export default ToggleButton;
