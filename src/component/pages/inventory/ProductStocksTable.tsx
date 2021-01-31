import React, { Component, Fragment } from 'react'
import ProductStock from './../../../models/ProductStock';
import Modal from './../../container/Modal';
import ProductFlow from './../../../models/ProductFlow';
import Product from '../../../models/Product';
import { tableHeader } from './../../../utils/CollectionUtil';

class State {

}
class Props {
    productStocks: ProductStock[] = []
}
export default class ProductStocksTable extends Component<Props, State> {


    render() {
        const stocks: ProductStock[] = this.props.productStocks;
        return (
            <div>
                <div className="row">
                    <div className="col-3"><strong>Name</strong></div>
                    <div className="col-9"><strong>Detail</strong></div>
                </div>
                {stocks.map((stock, i) => {
                    const product = stock.product;
                    const producFlows = stock.productFlows;
                    return (<Fragment key={"ps-" + i}>
                        <div className="row alert alert-light">
                            <div className="col-3">{product.name}</div>
                            <div className="col-9">
                                <Modal toggleable={true} title={product.name}>
                                    <DetailStock product={product} productFlows={producFlows} />
                                </Modal>
                            </div>
                        </div>
                    </Fragment>)
                })}
            </div>
        )
    }

}

const DetailStock = (props:{product:Product, productFlows:ProductFlow[]}) => {
    
    return (
        <table className="table table-striped">
            {tableHeader("No","Stock Id", "Qty", "Unit", "EXP Date")}
            {props.productFlows.map((productFlow, i)=>{
                
                return (
                    <tr key={"PF_DETAIL_STOCK"+productFlow.id+"-"+i}>
                        <td>{i+1}</td>
                        <td>{productFlow.id}</td>
                        <td>{productFlow.count}</td> 
                        <td>{props.product.unit?.name}</td>
                        <td>{new Date(productFlow.expiredDate).toDateString()}</td>
                    </tr>
                )
            })}
        </table>
    )
}