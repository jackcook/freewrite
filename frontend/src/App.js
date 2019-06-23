import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";

import "./App.css";
import WritingView from "./components/WritingView";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/" component={WritingView} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
