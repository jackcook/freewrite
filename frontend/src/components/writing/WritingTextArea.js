import React, { Component } from "react";

import "./WritingTextArea.css";
import WritingCaret from "./WritingCaret";

class WritingTextArea extends Component {
  render() {
    return (
      <div className="WritingTextArea">
        <span className="content">{this.props.textLeft}</span>
        <WritingCaret visible={this.props.caretVisible} />
        <span className="content">{this.props.textRight}</span>
        <span className="placeholder">{(this.props.textLeft.length === 0 && this.props.textRight.length === 0) ? "It was a dark and stormy night..." : ""}</span>
      </div>
    );
  }
}

export default WritingTextArea;
