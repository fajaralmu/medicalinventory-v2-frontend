import React from 'react';
import { FormEvent } from 'react';
import MasterDataService from './../../../services/MasterDataService';
import WebResponse from '../../../models/common/WebResponse';
import BasePage from './../../BasePage'

export default class BaseUpdateProfilePage extends BasePage {
    masterDataService: MasterDataService;
    constructor(props, title){
        super(props, title, true);
        this.masterDataService = this.getServices().masterDataService; 
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
    // render(){
    //     return (<></>)
    // }
}

