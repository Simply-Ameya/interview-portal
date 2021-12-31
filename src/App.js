import React from "react";
import Finish from "./components/Finish";
import Questions from "./components/Questions";

import Start from "./components/Start";
import { BrowserRouter, Switch, Route } from "react-router-dom";
export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route component={Start} exact path="/" />
          <Route path="/questions/:id" component={Questions} />
          <Route path="/finish/:id" component={Finish} />
        </Switch>
      </BrowserRouter>
      // <Questions />
    );
  }
}
