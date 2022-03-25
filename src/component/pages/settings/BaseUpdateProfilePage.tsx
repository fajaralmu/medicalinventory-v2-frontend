import { resolve } from 'inversify-react';
import { FormEvent } from 'react';
import WebResponse from '../../../models/common/WebResponse';
import MasterDataService from '../../../services/MasterDataService';
import BasePage from './../../BasePage';

export default abstract class BaseUpdateProfilePage extends BasePage {
    
    @resolve(MasterDataService)
    protected masterDataService: MasterDataService;
    
    constructor(props, title){
        super(props, title, true);
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

