import { StackNavigator, } from 'react-navigation';
import DashBoard from './pages/DashBoard';
import Navigator_tab from '../src/components/Navigator_tab';
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import React, { Component } from 'react';
import { View } from 'react-native';
import helpers from "./components/helpers";
import BeWelCome from './pages/BeWelCome';
import ViewBlank from './pages/ViewBlank';



class Routes extends Component {
  constructor(props) {
    super(props)

    this.state = {
      actionWelcome: '',
      route: 'ViewBlank'
    }

    // this.setState((state) => {
    //   return {
    //     'actionWelcome': ''// await helpers.getArrayStorage('boards');
    //   }
    // })

  }

  async componentDidMount() {
    this.setState(async () => {
      let board = await helpers.getArrayStorage('boards');

      let flag = board.length ? true : false;
      let valid = await helpers.storageGetItem('user')
      this.setState({ 'route': !valid ? 'BeWelCome' : 'Navigator_tab' });
      return { 'actionWelcome': flag };
    });
  }


  mountNavigator() {

    const Navigation =
      createAppContainer(
        createStackNavigator({
          BeWelCome: BeWelCome,
          Navigator_tab: Navigator_tab,
          ViewBlank: ViewBlank
        }, {
          headerMode: 'screen',
          initialRouteName: this.state.route,
          cardStyle: {
            backgroundColor: '#044573',
          },
        })
      );

    return (
      <Navigation></Navigation>
    );
  }

  render() {
    return this.mountNavigator()
  }
}

export default Routes;