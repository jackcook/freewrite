import React, { Component } from "react";
import "./WritingSearchButton.css";

// Made this on an airplane when I couldn't download an icon l o l
class WritingSearchButton extends Component {
  render() {
    return (
      <div className="WritingSearchButton" onClick={this.props.onClick}>
        <div className="round-part" />
        <div className="stick-part" />
      </div>
    );
  }
}

export default WritingSearchButton;
