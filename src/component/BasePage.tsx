import React from 'react'
import { greeting } from '../utils/StringUtil';
import BaseComponent from './BaseComponent';
export default class BasePage extends BaseComponent {

    protected title:undefined|string;
    constructor(props, title :string, authentiacted:boolean = false) {
        super(props, authentiacted);
        this.title = title;
        if (this.title) {
            document.title = this.title;
        }
    }
    componentDidMount() {
        this.validateLoginStatus(()=>{
            this.scrollTop();
        });
    }
    userGreeting() {
        return <>{greeting()}, <strong>{this.getLoggedUser()?.displayName}</strong><hr/></>
    }
    titleTag() {
        return <React.Fragment>
            <h2>{this.title}</h2>
            <hr/>
        </React.Fragment>
    }
    // render () {
    //     return (
    //         <></>
    //     )
    // }
}