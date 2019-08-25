import React, { Component } from 'react';
import Joystick from 'react-joystick';
import ready from './assets/deploy-ready.gif';
import deploy from './assets/deploy-done.gif';


class App extends Component {
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
      console.log(data);
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
      <div>
      <image src={ready} classNmae='effect_section'/>
        <div>
         input secgtion
        </div>
      </div>
    )
  }
}

export default App;
