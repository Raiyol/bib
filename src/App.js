import React, { Component } from 'react';
import Header from './Header';
import List from './List';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends Component {
  render() {
    return (
      <div className="container">
        <Header />
        <List />
      </div>
    )
  }
}
export default App;