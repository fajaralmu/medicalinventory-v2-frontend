
import BaseComponent from './../../BaseComponent';
import { FormEvent } from 'react';
import MasterDataService from './../../../services/MasterDataService';
import WebResponse from './../../../models/WebResponse';
export default class BaseUpdateProfilePage extends BaseComponent {
    masterDataService: MasterDataService;
    constructor(props, title){
        super(props, true);
        document.title =title;
        this.masterDataService = this.getServices().masterDataService; 
    }
    componentDidMount() {
        this.validateLoginStatus();
    }
    saveRecord = (e: FormEvent) => {
        e.preventDefault();
        if (this.state.fieldChanged() == false) {
            return;
        } 
        this.showConfirmation("Save Data?")
            .then((ok)=> {
                if (ok) { this.doSaveRecord(); }
            })
    }
    doSaveRecord = () => {

    }
    postRecordSaved = (response: WebResponse) => {

    }
    recordSaved = (response: WebResponse) => {
        this.showInfo("Record Has Been Saved!");
        const editFields = this.state.editFields;
        for (const key in editFields) {
            editFields[key] = false;
        }
        this.setState({editFields:editFields},()=>{
            this.postRecordSaved(response)
        });
    }
}