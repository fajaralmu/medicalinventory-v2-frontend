import React, { Component, Fragment } from 'react'
import { DialogType } from  '../../constant/DialogType';
import { doItLater as invokeLater } from '../../utils/EventUtil';

type ButtonRef              = React.RefObject< HTMLButtonElement >;
const initialMargin         = '-560px';
const transitionDuration    = '250ms';
const BACK_COLOR            = 'rgba(100,100,100,0.7)';

const TITLE = 'Medical Inventory';

class State {
    backColor: string = 'transparent';
    marginTop: string = initialMargin;
}
interface Props  {
    onConfirm:(arg:any)=>any;
    onCancel:(arg:any)=>any;
    onClose:(arg:any)=>any;

    type:DialogType;
    yesOnly:boolean;
    yesLabel:string;

    title?:string;

    children:any;
}
class Dialog extends Component<Props, State> {
    yesButton:ButtonRef     = React.createRef();
    cancelButton:ButtonRef  = React.createRef();
    state:State             = new State();

    constructor(props:any) {
        super(props);
    }
    onConfirm = (e:any) => {        
        this.close(()=>{
            this.props.onConfirm(e);
        });
    }
    close = (callback:()=>any)=> {
        invokeLater(()=>{
            this.setState({ backColor:'transparent', marginTop: initialMargin }, ()=>{
                invokeLater(callback, 100);
            });
        }, 100);
    }
    onCancel = (e:any) => {
        this.close(()=>{
            if (this.props.onCancel) {
                this.props.onCancel(e);
            }
        });
    }
    onClose = (e:any) => {
        this.close(()=>{
            this.props.onClose(e);
        });
    }

    componentDidMount() {
        const focusCancelBtn = this.props.type === DialogType.ERROR || this.props.type === DialogType.WARNING ;
        if (!focusCancelBtn && this.yesButton.current)  {
            this.yesButton.current.focus();
        }  else if (focusCancelBtn && this.cancelButton.current)  {
            this.cancelButton.current.focus();
        } else if (focusCancelBtn && this.yesButton.current) {
            this.yesButton.current.focus();
        }

        invokeLater(()=>{
            let marginTop = this.stringContent ? '30vh' : '0vh';
            this.setState({backColor:BACK_COLOR, marginTop: marginTop})
        }, 100);
    }

    get stringContent() { return typeof this.props.children === "string"; }

    get headerClassName() : string
    {
        switch (this.props.type) {
            case DialogType.INFO:
            case DialogType.INFO_NO_BUTTONS : 
                                      return "bg-info text-light";
            case DialogType.WARNING : return "bg-warning text-dark";
            case DialogType.ERROR   : return "bg-danger text-light";
        
            default                 : return "bg-secondary";
        }
    }

    render() {
        const title     = this.props.title ? this.props.title:  "Info";
        const yesOnly   = this.props.yesOnly === true;
        const maxWidth  = this.stringContent? '500px': '85vw';

        const dialogStyle = {
            transitionDuration:  transitionDuration,
            marginTop: this.state.marginTop,
            maxWidth: maxWidth,
            marginLeft: 'auto',
            marginRight: 'auto'
        };
        const modalDialogClass =  this.stringContent ? "modal-dialog -modal-dialog-centered" : "-modal-dialog-centered";
        return (
            <Fragment>
                <Backdrop bgColor={this.state.backColor} />
                <div className="modal show d-block">
                    <div 
                        className={modalDialogClass}
                        style={dialogStyle}
                    >
                        <div className="modal-content mt-5">
                            <Header 
                                className={this.headerClassName} 
                                title={title} 
                                onClose={this.onClose} 
                            />
                            <div className="modal-body" style={{ maxHeight: '70vh', overflow: 'auto' }} >{this.props.children}</div>
                            { this.props.type === DialogType.INFO_NO_BUTTONS? 
                            <div className={"modal-footer "} >
                                <h6 className='w-100 text-center'>{TITLE}</h6>
                            </div> 
                            :
                            <Footer 
                                cancelButton={this.cancelButton} 
                                yesLabel={this.props.yesLabel}
                                yesButton={this.yesButton} 
                                yesOnly={yesOnly} 
                                onConfirm={this.onConfirm} 
                                onCancel={this.onCancel} 
                            /> }
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

function Backdrop(props:{bgColor:string}) {
    const style = { transitionDuration:transitionDuration, backgroundColor: props.bgColor };
    return (
        <div className="modal-backdrop" style={style} />
    );
}

function Footer(props:{yesLabel:string, yesButton:ButtonRef, cancelButton:ButtonRef, yesOnly:boolean, onConfirm:(e:any)=>any, onCancel?:(e:any)=>any}) {
    return (
        <div className={"modal-footer"} >
            <button 
                ref={props.yesButton} 
                type="button"
                onClick={props.onConfirm} 
                className="btn btn-outline-primary" >
                {props.yesLabel}
            </button>
            {props.yesOnly ? 
                null : 
                <button 
                    ref={props.cancelButton} 
                    type="button"
                    onClick={props.onCancel} 
                    className="btn btn-outline-secondary" >
                    No
                </button>}
        </div>
    )
}

function Header(props:{ title:string, className:string, onClose:(e:any)=>any }) {
    return (
        <div className={"modal-header " + props.className} >
            <h5 className="modal-title" id="exampleModalCenterTitle" >{props.title}</h5>
            <button onClick={props.onClose} type="button" className="close btn btn-text text-light" >
                <span><i className="fas fa-times" /></span>
            </button>
        </div>
    )
}

export default Dialog;