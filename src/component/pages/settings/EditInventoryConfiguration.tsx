import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import Configuration from '../../../models/Configuration';
import WebResponse from '../../../models/common/WebResponse';
import Card from '../../container/Card';
import FormGroup from '../../form/FormGroup';
import Spinner from './../../loader/Spinner';
import BaseUpdateProfilePage from './BaseUpdateProfilePage';
import { EditField } from './settingHelper';

class EditFields {
  cycleTime = false;
  leadTime = false;
  expiredWarningDays = false;
}
class IState {
  config?: Configuration = undefined;
  editFields = new EditFields()
  fieldChanged = () => {
    for (const key in this.editFields) {
      if (this.editFields[key] === true) {
        return true;
      }
    }
    return false;
  }
}
class EditInventoryConfiguration extends BaseUpdateProfilePage {
  private actualConfig = new Configuration();
  state = new IState();
  constructor(props: any) {
    super(props, "Konfigurasi Persediaan");
  }
  loadConfiguration = () => {
    this.commonAjax(
      this.masterDataService.getByKey,
      this.configLoaded,
      this.showCommonErrorAlert,
      'configuration', 'code', 'APP_CONFIG'
    )
  }
  configLoaded = (response: WebResponse) => {
    if (response.entities && response.entities.length > 0) {
      const config = Object.assign(new Configuration(), response.entities[0]);
      this.actualConfig = Object.assign(new Configuration(), response.entities[0]);
      this.setState({ config });
    }
  }
  componentDidMount() {
    this.scrollTop();
    this.loadConfiguration();
  }
  updateProfileProperty = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    const { config } = this.state;
    if (!config) return;

    config[target.name] = target.value;
    this.setState({ config });
  }

  setProperty = (fieldName: string, value: any) => {
    const config = this.state.config;
    if (!config) return;
    config[fieldName] = value;
    this.setState({ config });
  }
  toggleInput = (e: MouseEvent) => {
    const target = e.target as HTMLAnchorElement;
    const { config } = this.state;
    const { actualConfig } = this;
    if (!target || !config) {
      return;
    }

    const propertyName = target.getAttribute("data-name");
    if (!propertyName) {
      return;
    }
    const enabled = target.getAttribute('data-enabled') === 'true';
    const editFields = this.state.editFields;
    editFields[propertyName] = enabled;
    if (!enabled) {
      config[propertyName] = actualConfig[propertyName];
    }
    this.setState({ config, editFields });
  }
  doSaveRecord = () => {
    const config = this.getEditedRecord();
    if (!config) return;
    this.commonAjax(
      this.masterDataService.updateConfiguration,
      this.recordSaved, this.showCommonErrorAlert,
      config
    )
  }
  getEditedRecord = () => {
    const { config, editFields } = this.state;
    if (!config) {
      return undefined;
    }
    const editedApplication = new Configuration();
    for (const key in editFields) {
      editedApplication[key] = config[key];
    }
    return editedApplication;
  }

  render() {
    const { config, editFields } = this.state;
    if (!config) {
      return <div className="container-fluid section-body"><Spinner /></div>;
    }
    const changed = this.state.fieldChanged();
    return (
      <div className="container-fluid section-body">
        <h2>Konfigurasi Persediaan</h2>
        <Card title="Konfigurasi Stok">
          <form onSubmit={this.saveRecord}>
            <FormGroup label="Waktu Siklus (Hari)">
              <EditField
                type="number"
                edit={editFields.cycleTime}
                updateProperty={this.updateProfileProperty}
                name="cycleTime"
                toggleInput={this.toggleInput}
                value={config.cycleTime}
              />
            </FormGroup>
            <FormGroup label="Waktu Tunggu Pemesanan (Hari)">
              <EditField
                type="number"
                edit={editFields.leadTime}
                updateProperty={this.updateProfileProperty}
                name="leadTime"
                toggleInput={this.toggleInput}
                value={config.leadTime}
              />
            </FormGroup>
            <FormGroup label="Peringatan Kadaluarsa (Hari)">
              <EditField
                type="number"
                edit={editFields.expiredWarningDays}
                updateProperty={this.updateProfileProperty}
                name="expiredWarningDays"
                toggleInput={this.toggleInput}
                value={config.expiredWarningDays}
              />
            </FormGroup>
            <FormGroup>
              {changed && <input type="submit" className="btn btn-success" value="Save" />}
            </FormGroup>
          </form>
        </Card>
      </div>
    )
  }

}

export default withRouter(connect(
  mapCommonUserStateToProps,
)(EditInventoryConfiguration))