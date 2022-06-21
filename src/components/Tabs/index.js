import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import  {Image, Text, StyleSheet, Animated, View, Button, TouchableOpacity} from 'react-native'
import {
  Container, TabsContainer, TabItem, TabText,
} from './styles';
import DisplayModal from '../DisplayModal';

const styles = StyleSheet.create({
   boxStyle: {
        height: 114, 
        width: 120, 
        backgroundColor: '#294f94', 
        borderRadius : 10,
      },
});
// var tabs =  function Tabs({ translateY }) {
 export default class Tabs extends Component {

   constructor(props){
      super(props);
      console.log(props.navigation);
      // this.setState({navigation : props.navigation}) ;

      this.state = {
        // filePath: {},
        // display: false,
        // categories : {},
        navigation : props.navigation
      };

    }

 animatedValue = new Animated.Value(0);



  triggerModal = () => {
    this.setState({
        display : true
    });
  }

  componentDidMount() {
    this.setState({
      categories : [
        {"name": "Sala", "devices":3, "imagem": "https://fotos.vivadecora.com.br/decoracao-sala-de-estar-studioeloyefreitas-13428-proportional-height_cover_medium.jpg"},
        {"name": "Cozinha","devices":8, "imagem": "https://a-static.mlcdn.com.br/618x463/cozinha-completa-madesa-vicenza-com-armario-e-balcao/madesa/g20150074lst/639de777ace2dc9dc63acb34cd82e54c.jpg"},
        {"name": "Banheiro","devices":4, "imagem": "https://imagens-revista.vivadecora.com.br/uploads/2019/11/revestimento-3d-para-banheiro-branco-planejado-Foto-Pinterest.jpg"},
        {"name": "Quarto","devices":4, "imagem": "https://www.tuacasa.com.br/wp-content/uploads/2016/01/como-decorar-quarto-de-casal.jpg"}
      ]
   });
  }
  
   render() {
     console.log("PERFORMACE");
      return (
       <View>
       <Container style={{
        transform: [{
          translateY: this.animatedValue.interpolate({
            inputRange: [0, 380],
            outputRange: [0, 30],
            extrapolate: 'clamp',
          }),
        }],
        opacity: this.animatedValue.interpolate({
          inputRange: [0, 380],
          outputRange: [1, 0.3],
          extrapolate: 'clamp',
        }),
      }}
      >
   

      <View>
     
      <TabsContainer>
        {this.renderButtons()}
        </TabsContainer>
      </View>

           {/* <TouchableOpacity onPress={()=>this.triggerModal()}>
                    <TabItem  >
                      <Icon name="arrow-downward" size={24} color="#FFF" />
                      <TabText>Offline</TabText>
                    </TabItem>
          </TouchableOpacity> */}

      </Container>

      <DisplayModal 
            // image = 'https://a-static.mlcdn.com.br/618x463/cozinha-completa-madesa-vicenza-com-armario-e-balcao/madesa/g20150074lst/639de777ace2dc9dc63acb34cd82e54c.jpg'//{ Krunal }
            display = { this.state.display }
            data = "Krunal"
           
          />
          
    </View>
      )
    }

    showTable(key){
      console.log(key);
      this.state.navigation.navigate('Mychannels')
    }

    renderButtons() {
     
      if(this.state && this.state.categories){

        return  Object.keys(this.state.categories).map((item, i) => {
          return (
            <View key={i}>
              <TouchableOpacity onPress={()=>this.showTable(i)} key={i}>
              <TabItem style={{ borderRadius:10}} >
                <View style={styles.boxStyle} key={i} >
                  <Image
                    style={{flex:1, borderRadius:10 }}
                    source={{uri: this.state.categories[i].imagem}}
                  />
                </View> 
                <TabText>{this.state.categories[i].name}</TabText>
                <TabText>{this.state.categories[i].devices} Devices</TabText>
              </TabItem>
              </TouchableOpacity>
            </View>
          );
        });
    }
    
    }
}