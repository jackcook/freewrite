import React, { Component } from "react";

import "./WritingSearchPanel.css";
import WritingCloseButton from "./WritingCloseButton";

class WritingSearchPanel extends Component {
  render() {
    return (
      <div className={"WritingSearchPanel" + (this.props.visible === undefined ? "" : (this.props.visible ? " visible" : " invisible"))}>
        <WritingCloseButton onClick={this.props.onCloseClick} />
      </div>
    );
  }
}

export default WritingSearchPanel;
