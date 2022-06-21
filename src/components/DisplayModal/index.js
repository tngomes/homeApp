import React, { Component } from 'react';
import { Modal, View, Image, Text, StyleSheet, CloseButton, TouchableWithoutFeedback, Button } from 'react-native';
import {
  TextInfoModal,
  ImageInfoModal
} from "./styles";


export default class DisplayModal extends Component {

    // constructor(props){
      // super(props);
   
    // }
    state = {
      props: {
        display :  false,
        // image : '',
        data : '',
      },
      visible : false,
      teste : false,
    };
    

  closeModal = () => {
    if(this.state.visible  && this.props.display){
         this.setState({
          teste : true
         });
         // console.log("TESTE: " + this.state.teste);
    }
  }

  render() {
    return (
       <Modal visible={ this.state && this.state.visible && this.props.display } animationType = "slide" 
         onRequestClose={ () => console.log('closed') }>
        <View>

        <Button
              title="Left button"
              onPress={this.closeModal}
        />

          {/* <Image 
            source = { this.state.props.image } 
            style = { styles.image } /> */}
          <TextInfoModal>
            {/* { this.state.props.data } */}
          </TextInfoModal>
        
        </View>
      </Modal>
    )
  }

  // componentDidMount() {
  //   this.setState({visible: false});
  // }

  // componentDidUpdate = () => {
    componentDidUpdate(prevProps, prevState, snapshot) {
  
    // console.log(this.props); ENVIADO
    // console.log(this.state.props);  COMO ESTA 
    // console.log(this.state); COMO ESTA 

    console.log(this.props.display);
    console.log(this.state.visible);
 
    if (this.state && !this.state.visible && this.props.display) {
          this.setState({
            visible : true,
          });
     }
  }
}

// const styles = StyleSheet.create({
//   image: {
//     marginTop: 20,
//     marginLeft: 90,
//     height: 200,
//     width: 200
//   },
//   text: {
//     fontSize: 20,
//     marginLeft: 150
//   }
// })