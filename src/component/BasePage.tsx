import React from 'react'
import BaseComponent from './BaseComponent';
export default class BasePage extends BaseComponent {

    protected title:undefined|string;
    constructor(props, title:undefined|string, authentiacted:undefined|boolean) {
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
    // render () {
    //     return (
    //         <></>
    //     )
    // }
}