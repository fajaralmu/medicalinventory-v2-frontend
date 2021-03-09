import React, { Component, Fragment } from 'react'
import { tableHeader } from '../../../../utils/CollectionUtil';
import HealthCenter from '../../../../models/HealthCenter';
import ProductFlow from '../../../../models/ProductFlow';
import Product from '../../../../models/Product';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import Modal from '../../../container/Modal';
import SimpleWarning from '../../../alert/SimpleWarning';

class State {

}
class Props {
    product: Product = new Product();
    productFlows: ProductFlow[] = [];
    location: HealthCenter = new HealthCenter();
    number: number = 1;
}
class ProductStockDetail extends Component<Props, State> {

    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
        const product: Product = Object.assign(new Product(), this.props.product);
        let stock: number = 0;
        return (
            <div className="row alert alert-light">
                <ProductImage number={props.number} product={product} />
                <div className="col-9">
                    <Modal title={product.name + "(" + product.code + ")"} toggleable={true}>
                        <div style={{ width: '100%', overflow: 'scroll' }} >
                            {props.productFlows.length == 0 ? <SimpleWarning>No Data</SimpleWarning> :
                                <table className="table table-striped">
                                    {tableHeader("No", "Id", "Qty", "Digunakan", "Stok", "Unit", "Kadaluarsa", "Lokasi")}
                                    <tbody>
                                        {props.productFlows.map((productFlow, i) => {
                                            stock += productFlow.stock;
                                            return (
                                                <tr key={"PF_DETAIL_STOCK" + productFlow.id + "-" + i}>
                                                    <td>{i + 1}</td>
                                                    <td>{productFlow.id}</td>
                                                    <td>{productFlow.count}</td>
                                                    <td>{productFlow.usedCount}</td>
                                                    <td>{productFlow.stock}</td>
                                                    <td>{props.product.unit?.name}</td>
                                                    <td>{new Date(productFlow.expiredDate).toLocaleDateString()}</td>
                                                    <td>{productFlow.stockLocation}</td>
                                                </tr>
                                            )
                                        })}
                                        <tr>
                                            <td colSpan={4}>Total Stok</td>
                                            <td >{stock}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            }</div>
                    </Modal>
                </div>
            </div>
        )
    }
}

const ProductImage = (props: { product: Product, number: number }) => {
    const product = props.product;
    return (
        <div className="col-3">
            <div className="card bg-light"  >
                <img className="card-img-top " src={product.getDefaultImageUrl()} />
                <div className="card-body">
                    <p className="card-text">{props.number} - {product.name}</p>
                </div>
            </div>
        </div>
    )
}

export default connect(
    mapCommonUserStateToProps
)(ProductStockDetail)