

import React, { ChangeEvent, Fragment } from 'react';
import BaseComponent from '../../BaseComponent';
import Product from '../../../models/Product';
import Modal from '../../container/Modal';
import MasterDataService from '../../../services/MasterDataService';
import WebResponse from '../../../models/common/WebResponse';
import FormGroup from '../../form/FormGroup';
import AnchorWithIcon from '../../navigation/AnchorWithIcon';
import Spinner from '../../loader/Spinner';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { resolve } from 'inversify-react';
interface IState {
  product?: Product;
  recordList?: Product[] | undefined;
  recordNotFound: boolean;
  loading: boolean;
  productName: string;
}
class ProductFormV2 extends BaseComponent<any, IState> {
  @resolve(MasterDataService)
  private masterDataService: MasterDataService;
  constructor(props: any) {
    super(props);
    this.state = {
      recordNotFound: false,
      loading: false,
      productName: '',
    };
  }
  startLoading = () => this.setState({ loading: true });
  endLoading = () => this.setState({ loading: false });
  reset = (e: any) => {
    this.setState({ productName: '' })
  }
  searchRecord = (e) => {
    e?.preventDefault();
    if (this.state.productName.trim() === '') return;
    this.loadRecords();
  }
  recordsLoaded = (response: WebResponse) => {
    if (!response.entities || !response.entities[0]) {
      throw new Error("Produk tidak ditemukan");
    }
    // if (this.props.setProduct) {
    //     this.props.setProduct(response.entities[0]);
    // }
    this.setState({ recordList: response.entities, recordNotFound: false });
  }
  setProduct = (product: Product) => {
    this.setState({ productName: product.name ?? '', product: product, recordList: undefined, recordNotFound: false });
    if (this.props.setProduct) {
      this.props.setProduct(product);
    }
  }
  recordsNotFound = (e: any) => {
    this.setState({ recordNotFound: true, product: undefined, recordList: undefined });
  }
  loadRecords = () => {
    if (this.state.loading) return;
    if (!this.state.productName || this.state.productName.trim() === '') {
      this.setState({ recordList: [] });
      return;
    }
    this.commonAjaxWithProgress(
      this.masterDataService.getProductsByName,
      this.recordsLoaded,
      this.recordsNotFound,
      this.state.productName,
    );
  }
  private changeTimeout: any = null;
  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.changeTimeout) {
      clearTimeout(this.changeTimeout);
    }
    this.setState({ productName: event.target.value }, () => {
      const changeTimeout = setTimeout(() => {
        this.loadRecords();
        if (changeTimeout) {
          clearTimeout(changeTimeout);
        }
      }, 400);
      this.changeTimeout = changeTimeout;
    });
  }
  render() {
    const recordList = this.state.recordList ?? [];
    return (
      <form onSubmit={this.searchRecord}>
        <Modal
          toggleable={true}
          title="Pilih Produk"
          footerContent={
            <>
              <AnchorWithIcon
                iconClassName="fas fa-list"
                attributes={{ target: '_blank' }}
                to="/management/product"
                className="btn btn-outline-secondary"
              />
              <input type="submit" className="btn btn-secondary" value="Cari" />
              <input type="reset" onClick={this.reset} className="btn btn-outline-secondary" />
            </>
          }
        >
          <div className="form-group">
            <FormGroup label="Nama"  >
              <input
                name="productName"
                type="text"
                className="form-control"
                onChange={this.onChange}
                value={this.state.productName ?? ''}
                placeholder="Nama"
                required
              />
              {recordList.length > 0 &&
                (
                  <div
                    style={{ position: 'absolute', zIndex: 200 }}
                    className="container-fluid bg-light rounded-sm border border-dark"
                  >
                    {recordList.map(p => {
                      return (
                        <div
                          className="option-item"
                          onClick={() => this.setProduct(p)}
                          style={{ cursor: 'pointer' }}
                          key={`p-${p.code}_${p.id}`}
                        >
                          {p.name}
                        </div>
                      )
                    })}
                    <a onClick={this.recordsNotFound}><i className="fas fa-times" />&nbsp;close</a>
                  </div>
                )}
            </FormGroup>
          </div>
          <ProductDetail
            loading={this.state.loading}
            product={this.state.product}
            notFound={this.state.recordNotFound}
          />
        </Modal>
      </form >
    )
  }
}

const ProductDetail = (props: { loading: boolean, product?: Product, notFound: boolean }) => {
  const style = { height: '120px' };
  if (props.loading) {
    return <div style={style}><Spinner /></div>;
  }
  if (true === props.notFound) {
    return <div style={style}><div className="alert alert-warning">Produk tidak ditemukan</div></div>;
  }
  if (!props.product) {
    return <div style={style}><div className="alert alert-secondary">Silakan pilih produk</div></div>;
  }
  const { product } = props;
  return (
    <div style={style}>
      <h4>{product.name}</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Kode</th>
            <th>Unit</th>
            {/* <th>Category</th>
                    <th>Price@Unit</th>
                    <th>Qty</th> */}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{product.code}</td>
            <td>{product.unit ? product.unit.name : '-'}</td>
            {/* <td>{product.category ? product.category.name : '-'}</td>
                        <td style={{ fontFamily: 'monospace' }}>{product.price}</td>
                        <td>{product.count}</td> */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default withRouter(connect(
  mapCommonUserStateToProps,
)(ProductFormV2));
