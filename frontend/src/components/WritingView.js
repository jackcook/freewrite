import React, { Component } from "react";

import "./WritingView.css";
import Api from "../api/api";

class WritingView extends Component {
  constructor(props) {
    super(props);

    this.textArea = React.createRef();

    this.state = {
      textValue: ""
    };

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onKeyDown(e) {
    clearTimeout(this.timeout);

    this.setState({
      textValue: e.target.value
    });

    this.timeout = setTimeout(() => {
      Api.continueText().then(response => {
        console.log(response);

        this.setState({
          textValue: this.state.textValue + response.data.text
        });
      });
    }, 2000);
  }

  render() {
    return (
      <div className="WritingView">
        <textarea placeholder="It was a dark and stormy night..." onChange={this.onKeyDown} ref={this.textArea} value={this.state.textValue} />
      </div>
    );
  }
}

export default WritingView;
