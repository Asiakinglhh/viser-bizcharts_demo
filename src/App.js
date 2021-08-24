import React from 'react';
// import './assets/css/App.css';
import Test from './components/Test.jsx';
// import Series from './components/Series';
import ReactNative from './components/ReactNative';
import { HashRouter as Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Switch>
          <Route path="/pcsalesonicsum" component={Test} />
          <Route path="/reactnative" component={ReactNative} />
      </Switch>
    </div>
  );
}

export default App;
