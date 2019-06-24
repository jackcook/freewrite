import React, { Component } from "react";
import "./WritingCloseButton.css";

class WritingCloseButton extends Component {
  render() {
    return (
      <div className="WritingCloseButton" onClick={this.props.onClick}>
        <div className="first-cross" />
        <div className="second-cross" />
      </div>
    );
  }
}

export default WritingCloseButton;
