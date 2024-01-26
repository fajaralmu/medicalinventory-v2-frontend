import { resolve } from "inversify-react";
import React, { ReactElement, RefObject } from "react";
import { Component } from "react";
import { DialogType } from "../../constant/DialogType";
import DialogService from "../../services/DialogService";
import Dialog from "./Dialog";

type DialogState = { show: boolean };

export default class DialogContainer extends Component<any, DialogState> {

  // dialog props
  dialogTitle: string;
  dialogContent: any;
  dialogYesOnly: boolean;

  yesLabel: string = "Yes";

  dialogOnConfirm: (e: any) => any;
  dialogOnCancel: (e: any) => any;

  onCloseCallback?: (e: any) => any;

  dialogType: DialogType = DialogType.INFO;

  @resolve(DialogService)
  private dialogService: DialogService;
  private ref: RefObject<Dialog> = React.createRef();

  constructor(props: any) {
    super(props);
    this.state = {
      show: false,
    };
  }

  // fired when confirmed/canceled
  public dismissAlert = () => {
    if (this.ref.current) {
      this.ref.current.close(() => {
        this.setState({ show: false });
      })
      return;
    }
    this.setState({ show: false });
  }

  // fired when pressing [X] button
  dialogOnClose = (e: any) => {
    this.setState({ show: false }, () => {
      if (this.onCloseCallback) {
        this.onCloseCallback(e);
      }
      this.resetProps();
    });
  }
  setContent(content: ReactElement<any, typeof Component>) {
    this.dialogContent = content;
    this.forceUpdate();
  }
  componentDidMount() {
    this.dialogService.setContainer(this);
  }
  resetProps = () => {
    this.onCloseCallback = undefined;
    this.yesLabel = "Yes";
  }
  get isShown() { return this.state.show }

  public showNoButtons = (title: string, content: any, onClose: (e: any) => any, closeObj?: { close: () => any }) => {
    this.dialogType = DialogType.INFO_NO_BUTTONS;
    this.dialogTitle = title;
    this.dialogContent = content;
    if (closeObj)
      closeObj.close = this.dismissAlert;

    this.display();
  }
  public show = (
    type: DialogType,
    title: string,
    content: any,
    yesOnly: boolean,
    onConfirm: (e: any) => any,
    onCancel?: (e: any) => any,
    yesLabel?: string
  ) => {

    this.dialogType = type;
    this.dialogTitle = title;
    this.dialogContent = content;
    this.dialogYesOnly = yesOnly;
    this.yesLabel = yesLabel ? yesLabel : this.yesLabel;

    this.dialogOnConfirm = (e: any) => {
      this.dismissAlert();
      onConfirm(e);
    }
    this.onCloseCallback = onCancel;
    if (!yesOnly) {

      this.dialogOnCancel = (e: any) => {
        this.dismissAlert();
        if (onCancel) {
          onCancel(e);
        }
      };
    }
    this.display();
  }

  display() {
    this.setState({ show: true });
  }

  render(): React.ReactNode {

    return (
      this.state.show ?
        <Dialog
          ref={this.ref}
          title={this.dialogTitle}
          yesOnly={this.dialogYesOnly}
          onConfirm={this.dialogOnConfirm}
          onCancel={this.dialogOnCancel}
          onClose={this.dialogOnClose}
          type={this.dialogType}

          yesLabel={this.yesLabel}
        >
          {this.dialogContent}
        </Dialog> : null
    );
  }
}
