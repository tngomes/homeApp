// import React from 'react';
//import { View, Button, Text } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Animated , View, Button, Text } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Map from "../../components/Map";

const Page1 = ({ navigation }) => (
  <Map />
);

Page1.navigationOptions = {
  title: 'Mapa',
  headerTintColor: '#ffffff',
  headerStyle: {
    backgroundColor: '#2C90FA',
    borderBottomColor: '#ffffff',
    // borderBottomWidth: 1,
  },
  headerTitleStyle: {
    fontSize: 18,
  },
}

export default Page1;