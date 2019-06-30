import React, { Component } from "react";
import "./WritingCaret.css";

class WritingCaret extends Component {
  render() {
    return (
      <div className={"WritingCaret" + (this.props.visible ? "" : " invisible")} />
    );
  }
}

export default WritingCaret;
