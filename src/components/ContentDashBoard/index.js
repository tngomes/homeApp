import React, { Component } from 'react';
import { Image, Text, StyleSheet, Animated, View, Button, TouchableOpacity } from 'react-native'
import helpers from "../../components/helpers";
import isEqual from 'lodash/isEqual';

import CategoriesHouse from '../CategoriesHouse';
import { Console } from 'console';


const styles = StyleSheet.create({
});

// const imgFixed = [
//   { "name": "trox1", "devices": 8, "image": require('../../../src/assets/category/livingRoom.png') },
//   { "name": "Cozinha", "devices": 0, "image": require('../../../src/assets/category/kitchen.png') },
//   { "name": "Banheiro", "devices": 0, "image": require('../../../src/assets/category/bathroom.png') },
//   { "name": "Quarto", "devices": 0, "image": require('../../../src/assets/category/bedroom.png') }
// ]
export default class ContentDashBoard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
      board: [],
      categories: []
    };
  }

  triggerModal = () => {
    this.setState({
      display: true
    });
  }

  async getRoomsDevice(categories) {
    let rooms_devices = await helpers.getArrayStorage('rooms_devices');


    for (const i in categories) {
      categories[i].devices = 0;

      for (const key in rooms_devices) {
        if (rooms_devices[key].id_room == categories[i].id) {
          categories[i].devices += 1;
        }
      }
    }
    return categories;
  }

  async componentDidMount() {
    // const id = await helpers.storageGetItem('id_board_main');
    // if (id) {
    //   let categories = await helpers.infoRoomBoardId(id);
    //   categories = this.validImg(categories);
    //   categories = await this.getRoomsDevice(categories);

    //   this.setState({ categories: categories });
    // }
  }

  validImg(categories) {
    for (const key in categories) {
      if (!categories[key]['img']) {
        switch (parseInt(key)) {
          case 0:
            categories[key]['img'] = require('../../../src/assets/category/livingRoom.png');
            break;
          case 1:
            categories[key]['img'] = require('../../../src/assets/category/kitchen.png');
            break;
          case 2:
            categories[key]['img'] = require('../../../src/assets/category/bathroom.png');
            break;
          case 3:
            categories[key]['img'] = require('../../../src/assets/category/bedroom.png');
            break;
          default:
            categories[key]['img'] = '';
        }
      }
    }
    return categories;
  }


  componentWillReceiveProps(nextProps) {
    // this.setState({ visible_modal: nextProps.navigation.state.params.visible_modal, board: nextProps.navigation.state.params.board })
  }


  async componentDidUpdate(prevProps, prevState, nextState) {
    if (this.props.board) {
      let categories = await helpers.infoRoomBoardId(this.props.board.id);
      categories = this.validImg(categories);
      categories = await this.getRoomsDevice(categories);

      let valid = JSON.stringify(categories) == JSON.stringify(this.state.categories);

      if (!valid) {
        categories = await this.getRoomsDevice(categories);

        this.setState((state, props) => {
          return { categories: categories, board: this.props.board }
        });
      }
    }
  }

  render() {
    return (
      <View style={{ flexPasswordForgot: 1, marginBottom: 15 }}>
        <Text style={{ color: '#FFFFFF', marginLeft: 25, marginBottom: 10 }}>{this.props.board ? this.props.board.room_name : ''}</Text>

        {this.renderButtons()}

      </View>

    );
  }


  renderButtons() {
    // console.log(this.state.categories);
    return (
      <CategoriesHouse style={{ flex: 1 }} categories={this.state.categories} navigation={this.state.navigation}>

      </CategoriesHouse>
    );
  }
}