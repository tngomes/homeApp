import React, { Component, Fragment } from 'react';
import { Dimensions, View, Text, StyleSheet, ImageBackground, BackHandler } from 'react-native';
import helpers from "../../components/helpers";
import ContentDashBoard from '../../components/ContentDashBoard';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { MenuProvider } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomModal from '../../components/CustomModal';
import Houses from '../Houses';
import { clickButton } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationEvents } from "react-navigation";
import TouchID from 'react-native-touch-id';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

var { height, width } = Dimensions.get('window');
var textFontSize = width * 0.050;
var textFontSizeName = width * 0.080;

const styles = StyleSheet.create({
  box: {
    flex: 1,
    width: '100%',
    // height: 100,
    // borderWidth : 5,
    // margin: 10,
    // backgroundColor : 'red'
  },

  boxFull: {
    flex: 1,
    // width: '100%',
    // height: 100,
    // margin: 10,
    // backgroundColor: 'red',
  },

  image: {
    flex: 1,
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ clickButton }, dispatch);

const mapStateToProps = store => ({
  modalOpen: store.clickState.modalOpen
});

const DashBoard = class DashBoard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      navigation: props.navigation,
      user: {},
      visible_modal: null,
      board: [],
      multiple_board: false,
      update: 0,
    };

  }

  dateView() {
    var welCome = '';
    var now = new Date;

    if (now.getHours() >= 0 && now.getHours() < 5) {
      // document.write("Está de madrugada")
      welCome = 'Bom Dia ';
    }
    else if (now.getHours() >= 5 && now.getHours() < 12) {
      welCome = 'Bom Dia ';
    }
    else if (now.getHours() >= 12 && now.getHours() < 18) {
      welCome = 'Bom Tarde ';
    }
    else {
      welCome = 'Boa Noite ';
    }

    return welCome;
  }

  autentication() {

    TouchID.isSupported()
      .then(biometryType => {

        const optionalConfigObject = {
          title: 'Autenticação Obrigatória', // Android
          imageColor: '#02538b', // Android
          imageErrorColor: '#ff0000', // Android
          sensorDescription: 'Touch sensor', // Android
          sensorErrorDescription: 'Failed', // Android
          cancelText: 'Cancelar', // Android
          fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
          unifiedErrors: false, // use unified error messages (default false)
          passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
        };

        TouchID.authenticate('É necessário a autenticação para acessar o aplicativo', optionalConfigObject)
          .then(success => {
            console.log(success);
          })
          .catch(error => {
            BackHandler.exitApp();
          });

        // if (biometryType === 'TouchID') {
        //   // Touch ID is supported on iOS
        // } else if (biometryType === 'FaceID') {
        //   // Face ID is supported on iOS
        // } else if (biometryType === true) {
        //   // Touch ID is supported on Android
        // }

      })
      .catch(error => {
        // User's device does not support Touch ID (or Face ID)
        // This case is also triggered if users have not enabled Touch ID on their device
      });
  }

  render() {
    return (
      <ImageBackground resizeMode="stretch" source={require('../../../src/img/dashboard.png')} style={styles.image}>

        <View style={styles.container}>

          <View style={styles.box}>
            <MenuProvider>
              <Menu
                style={{
                  flexDirection: 'row-reverse',
                }}
                onSelect={(value) => this.OptionMenu(value)}>
                <MenuTrigger triggerTouchable={{ activeOpacity: 1, }}>
                  <FontAwesomeIcon style={{ marginRight: 20, marginTop: 20 }} icon={faEllipsisV} color="#ffff" size={20} />
                </MenuTrigger>
                <MenuOptions optionsContainerStyle={{ width: 150 }}>
                  {
                    this.state.multiple_board ? (
                      <MenuOption value={1}>
                        <Text style={{ fontWeight: 'bold', color: '#000000', fontSize: 15 }}>Alterar Placa</Text>
                      </MenuOption>
                    ) : null
                  }

                  <MenuOption value={2}>
                    <Text style={{ fontWeight: 'bold', color: '#000000', fontSize: 15 }}>Sair</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </MenuProvider>
          </View>

          <View style={styles.box}>
            <View style={{ width: 400, height: 120 }}>
              <Text style={{ color: '#FFFFFF', marginLeft: 20, marginBottom: 18, fontSize: textFontSize }}>{this.dateView()}</Text>
              <Text style={{
                color: '#FFFFFF', marginLeft: 20, marginBottom: 18, fontSize: textFontSizeName
              }}>{this.state.user.name}</Text>
            </View>
          </View>

          <View style={styles.boxFull}>
            <ContentDashBoard
              navigation={this.state.navigation}
              board={this.state.board}
            />
          </View>

          <NavigationEvents
            onWillFocus={async (payload) => {
              await this.updateBoard(payload);
            }}
          />

        </View>

        <CustomModal
          concent={this.renderContent(this.state.id)}
          visible_modal={this.state.visible_modal}
          navigation={this.props.navigation}>
        </CustomModal>

      </ImageBackground >
    )
  }

  async updateBoard(event) {
    await this.setView();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible_modal: nextProps.navigation.state.params.visible_modal,
      board: nextProps.navigation.state.params.board,
    })
  }

  renderContent(id) {

    switch (id) {
      case 1:
        return (
          <Houses navigation={this.props.navigation}></Houses>
        )
        break;
    }
  }

  OptionMenu(value) {
    switch (value) {
      case 1:
        this.setState({ visible: true, 'id': 1, visible_modal: true });
        break;
      case 2:
        BackHandler.exitApp();
        break;
    }
  }

  async setView() {
    var multiple_board = await helpers.getArrayStorage('boards');
    var id_board = await helpers.storageGetItem('id_board_main');
    var board = await helpers.infoBoardId(id_board);

    if (multiple_board && multiple_board.length > 1) {
      multiple_board = true
    } else {
      multiple_board = false
    }
    // this.state.navigation.navigate('MyBoards', { boards: await helpers.getArrayStorage('boards') });

    this.setState({ user: JSON.parse(await helpers.storageGetItem('user')), multiple_board: multiple_board, board: board, update: this.state.update + 1 });
  }

  async componentDidMount() {
    var touch_id = await helpers.storageGetItem('touch_id');
    var touch_id = await parseInt(touch_id) ? 1 : 0;

    if (touch_id) {
      this.autentication();
    }
    this.setView();
  }
}

DashBoard.navigationOptions = ({ navigation }) => ({
  header: null
})

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
