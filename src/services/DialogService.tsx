import React, { Component, createElement, ReactElement } from "react";
import { injectable } from "inversify";
import "reflect-metadata";
import DialogContainer from "../component/dialog/DialogContainer";
// import DialogPrompt from "../components/dialog/DialogPrompt";
import { DialogType } from "../constant/DialogType";
import { doItLater as invokeLater } from "../utils/EventUtil";

// ms
const INVOCATION_WAIT_DELAY = 500;

@injectable()
export default class DialogService {
    private container: DialogContainer;
    public setContainer = (container:DialogContainer) => {
        this.container = container;
    }
    public showInfo = (title:string, message:string) => {
        if (this.container.isShown)
        {
            invokeLater(()=>{
                this.showInfo(title, message)
            }, INVOCATION_WAIT_DELAY);
            return;
        }
        this.container.show(
            DialogType.INFO,
            title,
            message,
            true,
            console.info
        );
    }
    public showWarning = (title:string, message:string) => {
        if (this.container.isShown)
        {
            invokeLater(()=>{
                this.showWarning(title, message)
            }, INVOCATION_WAIT_DELAY);
            return;
        }
        this.container.show(
            DialogType.WARNING,
            title,
            message,
            true,
            console.info
        );
    }
    public showError = (title:string, message:string|Error) => {
        if (this.container.isShown)
        {
            invokeLater(()=>{
                this.showError(title, message)
            }, INVOCATION_WAIT_DELAY);
            return;
        }
        let messageContent;
        if (message instanceof Error) {
            messageContent = message.message;
        } else {
            if (typeof message === 'string' && message.trim().toLowerCase().startsWith("<!doctype html")) {
                messageContent = (
                    <div dangerouslySetInnerHTML={{
                        __html: message
                    }}>

                    </div>
                )
            } if (typeof message === 'object') {
                messageContent = message['result'];
            } else {
                messageContent = !message || message.trim() === '' ? "Unexpected error" : message.trim();
            }
        }
        this.container.show(
            DialogType.ERROR,
            title,
            messageContent,
            true,
            ()=>{},
            ()=>{},
            "Ok"
        );
        
    }

    public showConfirmDanger = (title:string, message:string) => {
        return this.showConfirm(title, message, DialogType.ERROR);
    }
    public showConfirmWarning = (title:string, message:string) => {
        return this.showConfirm(title, message, DialogType.WARNING);
    }

    public showConfirm = (title:string, message:string, type:DialogType = DialogType.INFO) => {
        
        return new Promise<boolean>((resolve, reject)=>{
            if (this.container.isShown)
            {
                invokeLater(()=>{ 
                    this.container.show(
                        type,
                        title,
                        message,
                        false,
                        (e:any) => {
                            resolve(true);
                        },
                        (e:any) => {
                            resolve(false);
                        }
                    );
                }, INVOCATION_WAIT_DELAY);
                return;
            }
            this.container.show(
                type,
                title,
                message,
                false,
                (e:any) => {
                    resolve(true);
                },
                (e:any) => {
                    resolve(false);
                }
            );
        });
    }
    
    public dismissAlert = () => {
        this.container.dismissAlert();
    }

    public showContent = ( title:string, content: ReactElement<any, typeof Component> ) => {
        return new Promise<boolean>((resolve, reject) => {
            let closeObserver = {
                close : () => {

                }
            };
            let el = createElement(content.type, {...content.props, closeObserver});
            this.container.showNoButtons(  title, el, (e:any) => { resolve(false) }, closeObserver  );
        });
    }
} 

interface DialogPromptProps  {
    message:string,
    onChange:(val:string)=>any
}