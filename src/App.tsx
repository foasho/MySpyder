import React from 'react';
import logo from './logo.svg';
import './App.css';
import styles from "./App.module.scss";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Route } from "react-router";
import { HomeComponent } from "./pages/Home";

const App: React.FC = () => {
  return (
    <div className={styles.appMain}>
      <div id="popup_modal"></div>
      <Router>
        <Switch>
          <Route render={() => <HomeComponent></HomeComponent>} path="/"></Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App;
