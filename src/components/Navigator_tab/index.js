import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';

import Page1 from '../../pages/Page1';
import Page2 from '../../pages/Page2';
import React, { Component } from 'react';
import { Animated, View, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Mychannels from '../../pages/Mychannels';
import Details from '../../components/Details';
import DashBoard from '../../pages/DashBoard';
import MyBoards from '../../pages/MyBoards';
import BoardRegister from '../../pages/BoardRegister';
import EditBoard from '../../pages/BoardEdit';
import ChannelEdit from '../../pages/ChannelEdit';
import Houses from '../../pages/Houses';
import ChannelConfigure from '../../pages/ChannelConfigure';
import BoardConfigure from '../../pages/BoardConfigure';
import BoardPulsator from '../../pages/BoardPulsator';
import BoardTime from '../../pages/BoardTime';
import Timer from '../../pages/Timer';
import Scheduling from '../../pages/Scheduling';
import RoomsSettings from '../../pages/RoomsSettings';
import RegisterRooms from '../../pages/RegisterRooms';
import Profile from '../../pages/Profile';

// import Icon from 'react-native-ionicons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { faHeart, faUser, faLightbulb, faHome, faCog, faDesktop } from "@fortawesome/free-solid-svg-icons";

const Rota1 = createStackNavigator({
  DashBoard: {
    screen: DashBoard,
    headerMode: "screen"
  },
});

const Rota2 = createStackNavigator({
  MyBoards: {
    screen: MyBoards,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      tabBarVisible: true,
      headerMode: "screen",
      headerTintColor: "#fff", //cor do texto cabeçalho
      headerStyle: {
        backgroundColor: "#02538b" //cor do cabeçalho
      }
    }),
  },

  BoardConfigure: {
    screen: BoardConfigure,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      tabBarVisible: true,
      headerMode: "screen",
      headerTintColor: "#fff", //cor do texto cabeçalho
      headerStyle: {
        backgroundColor: "#02538b" //cor do cabeçalho
      }
    }),
  },

  BoardRegister: {
    screen: BoardRegister,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      tabBarVisible: true,
      headerMode: "screen",
      headerTintColor: "#fff", //cor do texto cabeçalho
      headerStyle: {
        backgroundColor: "#02538b" //cor do cabeçalho
      }
    }),
  },

  BoardTime: {
    screen: BoardTime,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      tabBarVisible: true,
      headerMode: "screen",
      headerTintColor: "#fff", //cor do texto cabeçalho
      headerStyle: {
        backgroundColor: "#02538b" //cor do cabeçalho
      }
    }),
  },

  BoardPulsator: {
    screen: BoardPulsator,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      tabBarVisible: true,
      headerMode: "screen",
      headerTintColor: "#fff", //cor do texto cabeçalho
      headerStyle: {
        backgroundColor: "#02538b" //cor do cabeçalho
      }
    }),
  },

  Timer: {
    screen: Timer,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      tabBarVisible: true,
      headerMode: "screen",
      headerTintColor: "#fff", //cor do texto cabeçalho
      headerStyle: {
        backgroundColor: "#02538b" //cor do cabeçalho
      }
    }),
  },


  EditBoard: {
    screen: EditBoard,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      tabBarVisible: true,
      headerMode: "screen",
      headerTintColor: "#fff", //cor do texto cabeçalho
      headerStyle: {
        backgroundColor: "#02538b" //cor do cabeçalho
      }
    }),
  },
  ChannelEdit: {
    screen: ChannelEdit,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      tabBarVisible: true,
      headerMode: "screen",
      headerTintColor: "#fff", //cor do texto cabeçalho
      headerStyle: {
        backgroundColor: "#02538b" //cor do cabeçalho
      }
    }),
  },

  ChannelConfigure: {
    screen: ChannelConfigure,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      tabBarVisible: true,
      headerMode: "screen",
      headerTintColor: "#fff", //cor do texto cabeçalho
      headerStyle: {
        backgroundColor: "#02538b" //cor do cabeçalho
      }
    }),
  },
  Scheduling: {
    screen: Scheduling,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      tabBarVisible: true,
      headerMode: "screen",
      headerTintColor: "#fff", //cor do texto cabeçalho
      headerStyle: {
        backgroundColor: "#02538b" //cor do cabeçalho
      }
    }),
  },

  RoomsSettings: {
    screen: RoomsSettings,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      tabBarVisible: true,
      headerMode: "screen",
      headerTintColor: "#fff", //cor do texto cabeçalho
      headerStyle: {
        backgroundColor: "#02538b" //cor do cabeçalho
      }
    }),
  },

  RegisterRooms: {
    screen: RegisterRooms,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      tabBarVisible: true,
      headerMode: "screen",
      headerTintColor: "#fff", //cor do texto cabeçalho
      headerStyle: {
        backgroundColor: "#02538b" //cor do cabeçalho
      }
    }),
  },
  Mychannels: {
    screen: Mychannels,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      tabBarVisible: true,
      headerMode: "screen",
      headerTintColor: "#fff", //cor do texto cabeçalho
      headerStyle: {
        backgroundColor: "#02538b" //cor do cabeçalho
      }
    }),
  },
  Houses: {
    screen: Houses,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      tabBarVisible: true,
      headerMode: "screen",
      headerTintColor: "#fff", //cor do texto cabeçalho
      headerStyle: {
        backgroundColor: "#02538b" //cor do cabeçalho
      }
    }),
  },

});

const Rota3 = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
});


const Navigator_tab = createBottomTabNavigator({
  "Home": { //nome
    screen: Rota1, //pagina a carregar
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <FontAwesomeIcon icon={faHome} color="#02538b" size={25} />
    },
  },

  "Placas": {
    screen: Rota2,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <FontAwesomeIcon icon={faDesktop} color="#02538b" size={25} />,
    },

  },

  "Configurações": {
    screen: Rota3,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <FontAwesomeIcon icon={faCog} color="#02538b" size={25} />
    },
  },

}, {
  tabBarOptions: {
    activeTintColor: '#252b3e',
    inactiveTintColor: 'gray',
    showIcon: true,
    flex: 1,
  },
});


Navigator_tab.navigationOptions = {
  // Hide the header from AppNavigator stack
  header: null,

  headerStyle: {
    backgroundColor: '#2C90FA',
    borderBottomColor: '#ffffff',
    // borderBottomWidth: 1,
  },

};

export default Navigator_tab;