import React, { Component } from 'react';
import { Dimensions, Image, Text, StyleSheet, Animated, View, Button, TouchableOpacity, ScrollView } from 'react-native'
import {
  Container, TabsContainer, TabItem, TabText,
} from './styles';
import helpers from "../../components/helpers";
var { height, width } = Dimensions.get('window');
var textFontSize = width * 0.03;
var base64 = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;

const styles = StyleSheet.create({

  TabItem: {
    // flex: 1,
    width: 120,
    height: 180,
    backgroundColor: "gray",
    opacity: 0.9,
    marginLeft: 5,
    borderRadius: 10
  },

  boxStyle: {
    flex: 1,
    // width: 100,
    // height: 100,
    borderRadius: 10,
    backgroundColor: '#294f94',
  },

  TabText: {
    fontSize: textFontSize,
    color: '#FFF',
    marginRight: 10,
  },

  img: {
    flex: 1,
    borderRadius: 10,
    height: '100%',
    width: '100%',
    resizeMode: 'stretch'
  },

  scrollView: {

  },

});

export default class CategoriesHouse extends Component {


  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      // filePath: {},
      // display: false,
      // categories : {},
      categories: props.categories,
      navigation: props.navigation
    };
  }

  render() {
    // console.log(this.props.categories);
    return (
      // <View>
      // <TabsContainer style={{ flex: 1 }}>
      <ScrollView
        // flex=1,
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          // width :  Dimensions.get('window').width * 2
        }}
      >
        {this.renderCategories()}
      </ScrollView >


      // </TabsContainer>

      // </View>

    );
  }
  renderCategories() {
    if (this.state && this.props.categories) {
      return Object.keys(this.props.categories).map((item, i) => {
        return (
          <View key={i} style={{ flex: 1 }} >
            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.showTable(this.props.categories[i].id)} key={i}>

              <View style={styles.TabItem} >
                <View style={styles.boxStyle} key={i} >
                  {
                    base64.test(this.props.categories[i].img) ? (
                      <Image
                        style={styles.img}
                        source={{ uri: `data:image/png;base64,${this.props.categories[i].img}` }}
                      />
                    )
                      : (
                        <Image
                          style={styles.img}
                          source={this.props.categories[i].img}
                        />
                      )
                  }

                </View>

                <Text style={styles.TabText}>{this.props.categories[i].name}</Text>
                <Text style={styles.TabText}> {this.props.categories[i].devices} Devices</Text>

              </View>
            </TouchableOpacity>
          </View>
        );
      });
    }
  }

  async showTable(id_category) {
    var main = parseInt(await helpers.storageGetItem('id_board_main'));
    var board = await helpers.infoBoardId(main);
    this.state.navigation.navigate('Mychannels', { 'board': board, id_category: id_category });
  }

};