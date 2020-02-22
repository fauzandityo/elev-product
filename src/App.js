import React from 'react';
import './App.css';

import Home from './pages/Home';

class App extends React.Component {
  
  render() {    
    return (
      <React.Fragment>
        <div className="App">
          <header className="App-header">
            <h1>ELEVENIA</h1>
          </header>
        </div>
        <Home />
      </React.Fragment>
    )
  }
}

export default App;
