import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BarStacks from './BarStacksEG.js'
import BarStack from './BarStack.js'
//import Temp from './Temp.js'

class App extends Component {
  render() {
    const clicked = (data) => {alert(`clicked: ${JSON.stringify(data)}`)}
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
	    <BarStacks width={500} height={500} onClick={clicked}/>
        <BarStack width={500} height={500}/>
      </div>
    );
  }
}

export default App;
