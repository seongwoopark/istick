import React, { Component } from 'react';
import Joystick from 'react-joystick';
import ready from './assets/deploy-ready.gif';
import deploy from './assets/deploy.gif';
import './App.css'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      input: [],
      success: false,
      success_set:['←', '↙','↓','↘','→','A','B'],
      success_flag:[false,false,false,false,false,false,false],
      success_index: 0,
      failed: false
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
    const inputlist = this.state.input;
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const data_input = data.input
      if(JSON.stringify(inputlist)!==JSON.stringify(data_input)){
        this.checkNext(data_input);
      }
    }
  }

  checkNext(data_input){
    // let copy_input = JSON.parse(JSON.stringify(data_input.reverse()));
    const state_input = this.state.input;
    const state_input_length = state_input.length;
    // let index = this.state.success_index;
    let success_set = this.state.success_set;
    let success_flag = this.state.success_flag;
    let index = this.state.success_index;

    // data input을 state-input 크기만큼 잘라서 새로 저장, 나머지도 ㄸㅏ로 저장
    const slice_input = data_input.slice(0, state_input_length);
    const slice_left = data_input.slice(state_input_length, );
    
    // 자른 배열이랑 state-input value 가 같고 나머지 set가 success_set 인덱스와 같으면 success flag index true
    // check if ['a','a','a','b','b'] next can be ['a','a','a','b','b','b','c','d']
    let new_success_set = []
    console.log('suc-set',success_set)
    console.log('suc-flag',success_flag)
    console.log('index',index)

    console.log('slice-input',slice_input)
    console.log('slice_left',slice_left)

    if(JSON.stringify(slice_input) === JSON.stringify(state_input)){
      for(var i=0; i<slice_left.length; i++){
        if(success_set[index+i] === slice.left[i]){
          success_flag[index+i] = true;
          index += 1;
        }else{
          this.setState({
            failed: true
          })
          return
        }
      }
    }
    // state 저장
    this.setState({
      input:data_input,
      success_flag: success_flag,
      success_index: index,
    })

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
      {/* <img src={this.state.success ? deploy:ready} className='effect_section'/> */}
        <div className='input_section'>
          <div className='input_text'>
            <p>ISTICK DEPLOY</p>
          </div>
          <div className='arrow_show'>
            {this.state.failed ? 'FAILED!!!': null}
            {this.state.success_flag}
          </div>
        </div>
        <button onClick={this.buttonClick.bind(this)}></button>
      </div>
    )
  }
}

export default App;
