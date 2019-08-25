import React, { Component } from 'react';
import Joystick from 'react-joystick';
import ready from './assets/deploy-ready.gif';
import deploy from './assets/deploy-done.gif';
import './App.css'


class App extends Component {
  constructor(props){
    super.props();
    this.state = {
      input: []
    }
  }
  componentDidMount() {
    this.setupSocket();
  }

  setupSocket(channel) {
    const url = "ws://localhost:8000";
    this.socket = new WebSocket(url);
    this.socket.onopen = (event) => {
        console.log(`Socket is connected to "${url}"`)
    };
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.setState({
        input:data
      })
    }
  }

  sendToSocket(message) {
    this.socket.send(JSON.stringify(message));
  }

  closeSocket() {
    this.socket.close();
  }

  componentWillUnmount() {
    this.closeSocket();
  }

  render() {
    return (
      <div className='background'>
      <img src={ready} classNmae='effect_section'/>
        <div className='input_text'>ISTICK DEPLOY</div>
        <div className='input_section'>
          {this.state.input}
        </div>
      </div>
    )
  }
}

export default App;
