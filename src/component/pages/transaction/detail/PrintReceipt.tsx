import { resolve } from 'inversify-react';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from './../../../../constant/stores';
import AttachmentInfo from './../../../../models/common/AttachmentInfo';
import ReportService from './../../../../services/ReportService';
import BaseComponent from './../../../BaseComponent';
import AnchorWithIcon from './../../../navigation/AnchorWithIcon';

interface State {
  loading: boolean;
}
class PrintReceipt extends BaseComponent<any, State> {
  @resolve(ReportService)
  private reportService: ReportService;

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  startLoading = () => this.setState({ loading: true });
  endLoading = () => this.setState({ loading: false });
  receiptCreated = (attachment: AttachmentInfo) => {
    this.showConfirmation("Save " + attachment.name + " ?")
      .then((ok) => {
        if (!ok) return;
        Object.assign(document.createElement('a'), {
          target: '_blank',
          download: attachment.name,
          style: { display: 'none' },
          href: attachment.dataUrl,
        }).click();
      })

  }
  printReceipt = () => {
    this.commonAjaxWithProgress(
      this.reportService.printTransactionReceipt,
      this.receiptCreated,
      this.showCommonErrorAlert,
      this.props.transactionCode
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <AnchorWithIcon className="btn btn-dark">
          <span className="spinner-border spinner-border-sm" />
          Loading...
        </AnchorWithIcon>
      )
    }
    return (
      <AnchorWithIcon
        onClick={this.printReceipt}
        show={this.props.transactionCode != undefined}
        iconClassName="fas fa-file"
        className="btn btn-dark"
        label="Cetak Struk"
      />
    );
  }
}

export default withRouter(connect(
  mapCommonUserStateToProps,
)(PrintReceipt));
