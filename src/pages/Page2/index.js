// src/Page2.js

import React from 'react';
import { View, Button, Text } from 'react-native';
import Socket from "../../components/Socket";
const Page2 = () => (
  <Socket />
);

Page2.navigationOptions = {
  title: 'Ajuda',
}


export default Page2;