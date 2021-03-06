import React, { Component, Fragment } from 'react' 
import ProductStockDetail from './ProductStockDetail';
import ProductStock from '../../../../models/stock/ProductStock';
import HealthCenter from './../../../../models/HealthCenter';
import SimpleWarning from '../../../alert/SimpleWarning';

class State {

}
class Props {
    productStocks: ProductStock[] = [];
    startingNumber: number = 1;
    location: HealthCenter = new HealthCenter()
}
export default class ProductStocksTable extends Component<Props, State> {


    render() {
        const stocks: ProductStock[] = this.props.productStocks;
        let number: number = this.props.startingNumber;
        return (
            <div>
                <div className="row">
                    <div className="col-3"><strong>Nama</strong></div>
                    <div className="col-9"><strong>Rincian</strong></div>
                </div>
                {stocks.length == 0?
                <SimpleWarning style={{marginTop: '10px'}}>Tidak ada data</SimpleWarning>
                :
                stocks.map((stock, i) => {
                    const product = stock.product;
                    const producFlows = stock.productFlows;
                    return (<Fragment key={"ps-" + i}>
                        <ProductStockDetail number={number+i} location={this.props.location} product={product} productFlows={producFlows} />
                    </Fragment>)
                })}
            </div>
        )
    }

}
