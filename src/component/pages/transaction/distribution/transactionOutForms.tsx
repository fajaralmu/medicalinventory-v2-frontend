import React from 'react'
import Product from "../../../../models/Product";
import ProductFlow from "../../../../models/ProductFlow";
import Transaction from "../../../../models/Transaction";
import FormGroup from "../../../form/FormGroup";
import { ChangeEvent } from 'react';
import HealthCenter from '../../../../models/HealthCenter';
import Modal from '../../../container/Modal';
import AnchorButton from '../../../navigation/AnchorButton';

export const HealthCenterForm = (props: {
  value: undefined | HealthCenter,
  healthCenters: HealthCenter[],
  setHealthCenter(e: any): void
}) => {
  return (
    <form>
      <Modal toggleable={true} title="Health Center Destination">
        <FormGroup label="Health Center List">
          <select value={props.value?.id ?? -1} className="form-control" onChange={props.setHealthCenter}>
            {props.healthCenters.map((iem, i) => {
              return <option value={iem.id ?? 0} key={`hc-frm-${i}`}>{iem.name}</option>
            })}
          </select>
        </FormGroup>
      </Modal>
    </form>)
}

export const DestinationInfo = (props: { transaction: Transaction }) => {
  const { destination, healthCenterDestination, customer } = props.transaction;;
  return (
    <FormGroup >
      {destination == "HEALTH_CENTER" ? healthCenterDestination?.name ?? <i className="text-danger">Tidak ada puskesmas tujuan</i> : null}
      {destination == "CUSTOMER" ? customer?.name ?? <span className="text-danger"><i className="fas fa-exclamation-circle" /> Tidak ada pelanggan</span> : null}
    </FormGroup>
  )
}
export const ProductFlowItemInput = (props: { productFlow: ProductFlow, updateProductFlow(e: ChangeEvent): void, index: number, remove(index: number): void }) => {
  const { productFlow, index } = props;
  const { product, referenceProductFlow: ref, count } = productFlow;
  return (
    <tr>
      <td>{props.index + 1}</td>
      <td>{ref?.id}</td>
      <td>{product.name}</td>

      <td>{ref?.stock}</td>
      <td>
        <input
          required
          min={1}
          max={ref?.stock ?? 1}
          type="number"
          className="form-control"
          name="count"
          data-index={index}
          onChange={props.updateProductFlow}
          value={count}
        />
      </td>
      <td>{product.unit?.name}</td>
      <td>{ref?.generic ? "Yes" : "No"} </td>
      <td>
        {new Date(ref?.expiredDate ?? new Date()).toLocaleDateString("ID")}
      </td>
      <td>{ref?.batchNum}</td>
      <td>
        <AnchorButton
          iconClassName="fas fa-times"
          className="btn btn-danger"
          onClick={(e) => props.remove(index)}
        />
      </td>
    </tr>
  );
}