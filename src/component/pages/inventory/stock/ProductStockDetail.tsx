import React, { Component, Fragment } from 'react'
import ProductStock from '../../../../models/ProductStock';
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
        const product = this.props.product;

        return (
            <div className="row alert alert-light">
                <div className="col-3"><span className="badge badge-dark">{this.props.number}</span>{product.name}</div>
                <div className="col-9">
                    <Modal title={product.name} toggleable={true}>
                        {props.productFlows.length == 0 ? <SimpleWarning>No Data</SimpleWarning> :
                            <table className="table table-striped">
                                {tableHeader("No", "Stock Id", "Qty", "Used", "Stock", "Unit", "EXP Date")}
                                {props.productFlows.map((productFlow, i) => {

                                    return (
                                        <tr key={"PF_DETAIL_STOCK" + productFlow.id + "-" + i}>
                                            <td>{i + 1}</td>
                                            <td>{productFlow.id}</td>
                                            <td>{productFlow.count}</td>
                                            <td>{productFlow.usedCount}</td>
                                            <td>{productFlow.stock}</td>
                                            <td>{props.product.unit?.name}</td>
                                            <td>{new Date(productFlow.expiredDate).toDateString()}</td>
                                        </tr>
                                    )
                                })}
                            </table>
                        }
                    </Modal>
                </div>
            </div>
        )
    }
}

export default connect(
    mapCommonUserStateToProps
)(ProductStockDetail)