import React from 'react'
import Product from "../../../../models/Product";
import ProductFlow from "../../../../models/ProductFlow";
import Transaction from "../../../../models/Transaction";
import FormGroup from "../../../form/FormGroup"; 
import { ChangeEvent } from 'react';
import HealthCenter from '../../../../models/HealthCenter';
import Modal from '../../../container/Modal';
import AnchorButton from '../../../navigation/AnchorButton';

export const HealthCenterForm = (props: {value:undefined|HealthCenter, healthCenters:HealthCenter[], setHealthCenter(e:any):void }) => {

    return (<form>
         <Modal toggleable={true}  title="Health Center Destination">
            <FormGroup label="Health Center List">
                <select value={props.value?.id??-1} className="form-control" onChange={props.setHealthCenter}>
                    {props.healthCenters.map((hc,i)=>{
                        return <option value={hc.id} key={"hc-frm-"+i}>{hc.name}</option>
                    })}
                </select>
            </FormGroup>
         </Modal>
    </form>)
}

export const DestinationInfo  = (props:{transaction:Transaction}) => {
    const destination = props.transaction.destination;
    const healthCenterDestionation = props.transaction.healthCenterDestination;
    const customer = props.transaction.customer;
    return (
        <FormGroup >
            {destination== "HEALTH_CENTER"?  healthCenterDestionation?.name ?? <i className="text-danger">Tidak ada puskesmas tujuan</i>:null}
            {destination== "CUSTOMER" ? customer?.name ?? <span className="text-danger"><i className="fas fa-exclamation-circle"/> Tidak ada pelanggan</span>:null}
        </FormGroup>
    )
}
export const ProductFlowItemInput = (props: { productFlow: ProductFlow, updateProductFlow(e: ChangeEvent): void, index: number, remove(index: number): void }) => {
    const product: Product = props.productFlow.product;
    const productFlow: ProductFlow = props.productFlow;
    return (<tr>
        <td>{props.index + 1}</td>
        <td>{productFlow.referenceProductFlow?.id}</td>
        <td>{product.name}</td>
        
        <td>{productFlow.referenceProductFlow?.stock} </td>
        <td><input required min={1} max={productFlow.referenceProductFlow?.stock??1} type="number" className="form-control" name="count" data-index={props.index} onChange={props.updateProductFlow}
            value={productFlow.count} />
        </td>
        <td>{product.unit?.name}</td>
        <td>{productFlow.referenceProductFlow?.generic?"Yes":"No"} </td>
        <td>
            {new Date(productFlow.referenceProductFlow?.expiredDate ?? new Date()).toLocaleDateString("ID")}
        </td>
        <td><AnchorButton iconClassName="fas fa-times" className="btn btn-danger" onClick={(e) => {
            props.remove(props.index);
        }} /></td>
    </tr>)
}