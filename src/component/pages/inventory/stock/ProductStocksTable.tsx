import React, { Component, Fragment } from 'react'
import ProductStockDetail from './ProductStockDetail';
import ProductStock from '../../../../models/stock/ProductStock';
import HealthCenter from './../../../../models/HealthCenter';
import SimpleWarning from '../../../alert/SimpleWarning';

interface Props {
  productStocks: ProductStock[];
  startingNumber: number;
  location: HealthCenter;
}
const ProductStocksTable = (props: Props) => {
  const { productStocks, startingNumber, location } = props;
  return (
    <div>
      <div className="row">
        <div className="col-3"><strong>Nama</strong></div>
        <div className="col-9"><strong>Rincian</strong></div>
      </div>
      {
        productStocks.length === 0 ?
          <SimpleWarning style={{ marginTop: '10px' }}>Tidak ada data</SimpleWarning>
          :
          productStocks.map((stock, i) => {
            const product = stock.product;
            const producFlows = stock.productFlows;
            return (
              <Fragment key={"ps-" + i}>
                <ProductStockDetail
                  number={startingNumber + i}
                  location={location}
                  product={product}
                  productFlows={producFlows}
                />
              </Fragment>
            )
          })}
    </div>
  );
};

export default ProductStocksTable;
