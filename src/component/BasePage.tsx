import React from 'react'
import { greeting } from '../utils/StringUtil';
import BaseComponent from './BaseComponent';
export default abstract class BasePage<P, S> extends BaseComponent<P, S> {

    protected title: undefined | string;
    constructor(props, title: string) {
        super(props);
        this.title = title;
        if (this.title) {
            document.title = this.title;
        }
    }
    componentDidMount() {
        this.scrollTop();
    }
    userGreeting() {
        return <>{greeting()}, <strong>{this.getLoggedUser()?.displayName}</strong><hr /></>
    }
    titleTag(additionalText?: string) {
        return (
            <React.Fragment>
                <h2>{this.title} {additionalText ?? ""}</h2>
                <hr />
            </React.Fragment>
        )
    }
}