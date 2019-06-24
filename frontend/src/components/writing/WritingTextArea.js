import React, { Component } from "react";

import "./WritingTextArea.css";
import WritingCaret from "./WritingCaret";

class WritingTextArea extends Component {
  render() {
    return (
      <div className="WritingTextArea">
        <span className="placeholder">It was a dark and stormy night...</span>
        <span className="content">fdsa</span>
        <WritingCaret />
        <span className="content">asdf</span>
        <span className="placeholder">asdf</span>
      </div>
    );
  }
}

export default WritingTextArea;
