import React, { Component, Fragment } from "react";
import { View, Image } from "react-native";
import SocketIOClient from 'socket.io-client';

export default class Socket extends Component {
    socket = null;

  async componentDidMount() {
    this.socket = SocketIOClient('http://192.168.1.5:3000',{
      'reconnection': true,
       'reconnectionDelay': 500,
	      'reconnectionAttempts': Infinity, 
	      'transports': ['websocket'],  
    });

      this.manda("71985439973");
      this.login();
  }

    login(){
        let userName = "Lucas"
        data = {name: userName, userId: this.socket.id};
        this.emit('setSocketId', data);
    }
   manda (numero) {
    postaData = {
        valor : numero
    };

    this.socket.emit('chat message', postaData);   
    
    this.socket.on('chat message', (reponse)=>{
      console.log(reponse);
    });

    this.socket.on('connect', () => console.log('Socket is connected'));

    console.log(this.socket);
    console.log('OI');
    return true;
 }

  handleLocationSelected = (data, { geometry }) => {
  

  };

  handleBack = () => {
  
  };

  render() {
   
    return (
      <View style={{ flex: 1 }}>
       
      </View>
    );
  }
}
