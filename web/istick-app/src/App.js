import React, { Component } from 'react';
import Joystick from 'react-joystick';
import ready from './assets/deploy-ready.gif';
import deploy from './assets/deploy.gif';
import './App.css'


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      input: [],
      success: false
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

  buttonClick(){
    this.setState({
      success:true
    })
  }

  render() {
    return (
      <div className='background'>
      <img src={this.state.success ? deploy:ready} className='effect_section'/>
        <div className='input_section'>
        <div className='input_text'>
          <p>ISTICK DEPLOY</p>
          </div>
          {this.state.input}
          <div className='arrow_show'></div>
        </div>
        <button onClick={this.buttonClick.bind(this)}></button>
      </div>
    )
  }
}

export default App;
