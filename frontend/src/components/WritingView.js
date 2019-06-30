import React, { Component } from "react";

import "./WritingView.css";
import WritingSearchButton from "./writing/WritingSearchButton";
import WritingSearchPanel from "./writing/WritingSearchPanel";
import WritingTextArea from "./writing/WritingTextArea";
import WritingTitle from "./writing/WritingTitle";

class WritingView extends Component {
  constructor(props) {
    super(props);

    this.caret = React.createRef();

    this.state = {
      caretVisible: true,
      commandDown: false,
      optionDown: false,
      textLeft: localStorage.getItem("textLeft") || "",
      textRight: localStorage.getItem("textRight") || ""
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handlePanelClose = this.handlePanelClose.bind(this);
    this.handlePanelOpen = this.handlePanelOpen.bind(this);
    this.restartCaretTimer = this.restartCaretTimer.bind(this);

    this.restartCaretTimer(true);
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
    document.removeEventListener("keyup", this.handleKeyUp, false);
  }

  handleKeyDown(e) {
    console.log(e);

    var i = 0;

    if (e.key.length === 1) {
      this.setState({
        textLeft: this.state.textLeft + e.key
      });
    } else if (e.keyCode === 37) {
      // Arrow left
      if (this.state.optionDown) {
        let inSpaces = true;

        for (var i = this.state.textLeft.length - 1; i >= 0; i--) {
          if (this.state.textLeft.charAt(i) !== " " && this.state.textLeft.charAt(i) !== "\n") {
            inSpaces = false;
          } else if (!inSpaces) {
            break;
          }
        }

        this.setState({
          textLeft: this.state.textLeft.substring(0, i + 1),
          textRight: this.state.textLeft.substring(i + 1, this.state.textLeft.length) + this.state.textRight
        });
      } else if (this.state.commandDown) {
        e.preventDefault();

        if (this.state.textLeft.indexOf("\n") === -1) {
          this.setState({
            textLeft: "",
            textRight: this.state.textLeft + this.state.textRight
          });
        } else {
          this.setState({
            textLeft: this.state.textLeft.substring(0, this.state.textLeft.lastIndexOf("\n") + 1),
            textRight: this.state.textLeft.substring(this.state.textLeft.lastIndexOf("\n") + 1, this.state.textLeft.length) + this.state.textRight
          });
        }
      } else {
        this.setState({
          textLeft: this.state.textLeft.substring(0, this.state.textLeft.length - 1),
          textRight: this.state.textLeft.charAt(this.state.textLeft.length - 1) + this.state.textRight
        });
      }
    } else if (e.keyCode === 39) {
      // Arrow right
      if (this.state.optionDown) {
        let inSpaces = true;

        for (i = 0; i < this.state.textRight.length; i++) {
          if (this.state.textRight.charAt(i) !== " " && this.state.textRight.charAt(i) !== "\n") {
            inSpaces = false;
          } else if (!inSpaces) {
            break;
          }
        }

        this.setState({
          textLeft: this.state.textLeft + this.state.textRight.substring(0, i),
          textRight: this.state.textRight.substring(i, this.state.textRight.length)
        });
      } else if (this.state.commandDown) {
        e.preventDefault();

        if (this.state.textRight.indexOf("\n") === -1) {
          this.setState({
            textLeft: this.state.textLeft + this.state.textRight,
            textRight: ""
          });
        } else {
          this.setState({
            textLeft: this.state.textLeft + this.state.textRight.substring(0, this.state.textRight.indexOf("\n")),
            textRight: this.state.textRight.substring(this.state.textRight.indexOf("\n"), this.state.textRight.length)
          });
        }
      } else {
        this.setState({
          textLeft: this.state.textLeft + this.state.textRight.charAt(0),
          textRight: this.state.textRight.substring(1, this.state.textRight.length)
        });
      }
    } else if (e.keyCode === 8) {
      // Delete
      if (this.state.optionDown) {
        let inSpaces = true;

        for (i = this.state.textLeft.length - 1; i >= 0; i--) {
          if (this.state.textLeft.charAt(i) !== " ") {
            inSpaces = false;
          } else if (!inSpaces) {
            break;
          }
        }

        this.setState({
          textLeft: this.state.textLeft.substring(0, i + 1)
        });
      } else if (this.state.commandDown) {
        this.setState({
          textLeft: ""
        });
      } else {
        this.setState({
          textLeft: this.state.textLeft.substring(0, this.state.textLeft.length - 1)
        });
      }
    } else if (e.keyCode === 18) {
      // Option
      this.setState({
        optionDown: true
      });
    } else if (e.keyCode === 91) {
      // Command
      this.setState({
        commandDown: true
      });
    } else if (e.keyCode === 13) {
      // Enter
      this.setState({
        textLeft: this.state.textLeft + "\n"
      });
    }

    this.restartCaretTimer();
  }

  handleKeyUp(e) {
    if (e.keyCode === 18) {
      // Option
      this.setState({
        optionDown: false
      });
    } else if (e.keyCode === 91) {
      // Command
      this.setState({
        commandDown: false
      });
    }
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

  restartCaretTimer(firstTime) {
    if (this.caretInterval) {
      clearInterval(this.caretInterval);
    }

    if (!firstTime) {
      this.setState({
        caretVisible: true
      });
    }

    this.caretInterval = setInterval(() => {
      this.setState({
        caretVisible: !this.state.caretVisible
      });
    }, 500);

    localStorage.setItem("textLeft", this.state.textLeft);
    localStorage.setItem("textRight", this.state.textRight);
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
        <WritingTextArea
          caretVisible={this.state.caretVisible}
          textLeft={this.state.textLeft}
          textRight={this.state.textRight} />
      </div>
    );
  }
}

export default WritingView;
