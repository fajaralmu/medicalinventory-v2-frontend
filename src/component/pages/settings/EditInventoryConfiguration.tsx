import React, { ChangeEvent, Component, FormEvent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseComponent from '../../BaseComponent';
import Configuration from '../../../models/Configuration';
import Card from '../../container/Card';
import FormGroup from '../../form/FormGroup'; 
import WebResponse from '../../../models/common/WebResponse';
import { toBase64v2 } from '../../../utils/ComponentUtil';
import { EditField, EditImage } from './settingHelper';
import MasterDataService from '../../../services/MasterDataService'; 
import Spinner from './../../loader/Spinner';
import BaseUpdateProfilePage from './BaseUpdateProfilePage';
class EditFields {
    cycleTime:boolean = false; leadTime:boolean =false;
    expiredWarningDays:boolean = false;
}
class IState {
    config?: Configuration = undefined;
    editFields: EditFields = new EditFields()
    fieldChanged = (): boolean => {
        for (const key in this.editFields) {
            if (this.editFields[key] == true) {
                return true;
            }
        }
        return false;
    }
}
class EditInventoryConfiguration extends BaseUpdateProfilePage {
 
    actualConfig: Configuration = new Configuration();
    state: IState = new IState();
    constructor(props: any) {
        super(props, "Konfigurasi Persediaan");
    }
    loadConfiguration = () => {
        this.commonAjax(
            this.masterDataService.getByKey,
            this.configLoaded,
            this.showCommonErrorAlert,
            'configuration','code','APP_CONFIG'
        )
    }
    configLoaded = (response:WebResponse) => {
        if (response.entities && response.entities.length>0){
            const config = Object.assign(new Configuration(), response.entities[0]);
            this.actualConfig = Object.assign(new Configuration(), response.entities[0]);
            this.setState({config: config});
        }
    }
    componentDidMount() {
        this.scrollTop();
        this.loadConfiguration();
    }
    updateProfileProperty = (e: ChangeEvent) => {
        const target: HTMLInputElement | null = e.target as HTMLInputElement;
        if (null == target) return;
        const config: Configuration | undefined = this.state.config;
        if (!config) return;

        config[target.name] = target.value;
        this.setState({ config: config });
    }
 
    setProperty = (fieldName: string, value: any) => {
        const config: Configuration | undefined = this.state.config;
        if (!config) return;
        config[fieldName] = value;
        this.setState({ config: config });
    }
    toggleInput = (e: MouseEvent) => {
        const target: HTMLAnchorElement | null = e.target as HTMLAnchorElement;
        const config: Configuration | undefined = this.state.config;
        const actualConfig: Configuration = this.actualConfig;
        if (null == target || !config ) {
            return;
        }

        const propertyName: string | null = target.getAttribute("data-name");
        if (null == propertyName) {
            return;
        }
        const enabled: boolean = target.getAttribute('data-enabled') == 'true';
        const editFields = this.state.editFields;
        editFields[propertyName] = enabled;
        if (!enabled) {
            config[propertyName] = actualConfig[propertyName];
        }
        this.setState({ config: config, editFields: editFields });
    }
    doSaveRecord = () => {
        const config: Configuration | undefined = this.getEditedRecord();
        if (!config) return;
        this.commonAjax(
            this.masterDataService.updateConfiguration,
            this.recordSaved, this.showCommonErrorAlert,
            config
        )
    }
    getEditedRecord = (): Configuration | undefined => {
        const { config, editFields } = this.state;
        if (!config) {
            return undefined;
        }
        const editedApplication: Configuration = new Configuration();
        for (const key in editFields) { 
            editedApplication[key] = config[key]; 
        }
       
        return editedApplication;
    }

    render() {
        const { config, editFields } = this.state;
        if (!config) {
            return <div className="container-fluid section-body"><Spinner/></div>;
        }
        return (
            <div className="container-fluid section-body">
                <h2>Inventory Configuration</h2>
                <Card title="Inventory Configuration">
                    <form onSubmit={this.saveRecord}> 
                        <FormGroup label="Cycle Time">
                            <EditField type="number" edit={editFields.cycleTime} updateProperty={this.updateProfileProperty} 
                            name="cycleTime" toggleInput={this.toggleInput} value={config.cycleTime} />
                        </FormGroup>
                         
                        <FormGroup label="Lead Time">
                            <EditField type="number" edit={editFields.leadTime} updateProperty={this.updateProfileProperty} 
                            name="leadTime" toggleInput={this.toggleInput} value={config.leadTime} />
                        </FormGroup>
                        <FormGroup label="Exp Date Warning">
                            <EditField type="number" edit={editFields.expiredWarningDays} updateProperty={this.updateProfileProperty} 
                            name="expiredWarningDays" toggleInput={this.toggleInput} value={config.expiredWarningDays} />
                        </FormGroup>
                        <FormGroup  >
                            {this.state.fieldChanged() ? <input type="submit" className="btn btn-success" value="Save" /> : null}
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