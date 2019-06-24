import React, { Component } from "react";

import "./WritingView.css";
import Api from "../api/api";
import WritingSearchButton from "./writing/WritingSearchButton";
import WritingSearchPanel from "./writing/WritingSearchPanel";
import WritingTextArea from "./writing/WritingTextArea";
import WritingTitle from "./writing/WritingTitle";

class WritingView extends Component {
  constructor(props) {
    super(props);

    this.caret = React.createRef();

    this.state = {
      caretVisible: true
    };

    this.handlePanelClose = this.handlePanelClose.bind(this);
    this.handlePanelOpen = this.handlePanelOpen.bind(this);

    setTimeout(() => {
      this.caretInterval = setInterval(() => {
        this.setState({
          caretVisible: !this.state.caretVisible
        });
      }, 500);
    }, 500);
  }

  handlePanelClose() {
    this.setState({
      searchPanelVisible: false
    });
  }

  handlePanelOpen() {
    this.setState({
      searchPanelVisible: true
    });
  }

  render() {
    return (
      <div className="WritingView" onKeyDown={this.onKeyDown}>
        <WritingSearchPanel
          visible={this.state.searchPanelVisible}
          onCloseClick={this.handlePanelClose} />
        <div className="top">
          <WritingTitle />
          <WritingSearchButton onClick={this.handlePanelOpen} />
        </div>
        <WritingTextArea />
      </div>
    );
  }
}

export default WritingView;
