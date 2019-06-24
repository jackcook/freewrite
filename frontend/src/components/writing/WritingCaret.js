import React, { Component } from "react";
import "./WritingCaret.css";

class WritingCaret extends Component {
  constructor(props) {
    super(props);

    this.state = {
      caretVisible: true
    };

    setInterval(() => {
      this.setState({
        caretVisible: !this.state.caretVisible
      });
    }, 500);
  }

  render() {
    return (
      <div className={"WritingCaret" + (this.state.caretVisible ? "" : " invisible")} />
    );
  }
}

export default WritingCaret;
