import React, { Component } from 'react';
// import Joystick from 'react-joystick';
import ready from './assets/deploy-ready.gif';
import deploy from './assets/deploy.gif';
import deploy_finished from './assets/deploy-finished.png'

import './App.css'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      input: [],
      success: false,
      finish: false,
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
      const data = JSON.parse(event.data);
      let input_arrows = data.input;
      let success = data.success;
      const finish = this.state.finish;
      if(finish){
        return;
      }
      if(success){
        this.setState({
          input: [],
          success: success 
        })
        setTimeout(() => {
          this.setState({
            finish:true
          })
       }, 5000);
     
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

  // buttonClick(){ 
  //   this.setState({
  //     finish: false
  //   })
  // }

  render() {
    const input = this.state.input
    const letter = ['A','B','C','D']
    const deploy_letter = ['-','-','D','E','P','L','O','Y','-','-']
    const answer_set = ['←', '↙', '↓', '↘', '→', 'A', 'B']

    return (
      <div className='background'>
      <img src={this.state.finish? deploy_finished : this.state.success ? deploy:ready} className='effect_section'/>
        <div className='input_section'>
          <div className='input_bar'>
            <div className='input_text'>
              <p>ISTICK - DEPLOY</p>
            </div>
            <div className='answer_section'>
             { answer_set.map(item=>{
                return(
                  <div className='answer_button'>{item}</div>
                )
              })
            }
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
        {/* <button onClick={this.buttonClick.bind(this)}>REFRESH</button> */}
      </div>
    )
  }
}

export default App;
