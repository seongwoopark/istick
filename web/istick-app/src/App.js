import React, { Component } from 'react';
// import Joystick from 'react-joystick';
import ready from './assets/deploy-ready.gif';
import deploy from './assets/deploy.gif';
import color_left from './assets/activated-arrow-left.png';
import color_left_down from './assets/activated-arrow-left-down.png';
import color_down from './assets/activated-arrow-down.png';
import color_right_down from './assets/activated-arrow-right-down.png';
import color_right from './assets/activated-arrow-right.png';
import color_A from './assets/activated-button-A.png';
import color_B from './assets/activated-button-B.png';


import './App.css'

class App extends Component {
  constructor(props){
    super(props);
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
      let input_arrows = event.input;
      let success = event.success;
  
      if(success){
        this.setState({
          success: success 
        })
        setTimeout(function(){
          console.log('success')
       }, 1500);
     
       }
      else if (JSON.stringify(this.state.input) !== JSON.stringify(input_arrows)){
      this.setState({
        input: input_arrows,
        success: success
      })
    }
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
      success: !this.state.success
    })
  }

  render() {
    const {input} = this.state.input
    const letter = ['A','B','C','D']
    const deploy_letter = ['-','-','D','E','P','L','O','Y','-','-']
    return (
      <div className='background'>
      <img src={this.state.success ? deploy:ready} className='effect_section'/>
        <div className='input_section'>
          <div className='input_bar'>
            <div className='input_text'>
              <p>ISTICK - DEPLOY</p>
            </div>
            <div className='answer_section'>
              <img src={color_left} className='arrows'/>
              <img src={color_left_down} className='arrows'/>
              <img src={color_down} className='arrows'/>
              <img src={color_right_down} className='arrows'/>
              <img src={color_right} className='arrows'/>
              <img src={color_A} className='arrows_letter'/>
              <img src={color_B} className='arrows_letter'/>

            </div>
          </div>
          <div className='show_input'>
            {this.state.success ? (
              deploy_letter.map(item=>{
                return <div className='letter-box deploy'>{item}</div>
              })
            ):
            (input ? 
              (input.map(item=>{
                return(
                letter.includes(item)?(
                    <div className='letter-box letter'>{item}</div>
                ) : 
                (<div className='letter-box arrow'>{item}</div>)
                )
              })
            ): null
            )
          }
          </div>
        </div>
        <button onClick={this.buttonClick.bind(this)}>succss</button>
      </div>
    )
  }
}

export default App;
