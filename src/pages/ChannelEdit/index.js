
import { ScrollView, TouchableOpacity, Keyboard, Animated, View, Button, Text, StyleSheet, Switch, TextInput, Picker } from 'react-native';
import React, { Component, Fragment, } from 'react';
import helpers from "../../components/helpers";
import { Formik } from 'formik';
import * as yup from 'yup';
import DropdownAlert from 'react-native-dropdownalert';
import { Dropdown } from 'react-native-material-dropdown';
import { styles } from "../../styles";
import { clickButton, clickKeyboard } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

 
const mapStateToProps = store => ({
  modalOpen: store.clickState.modalOpen,
  keyboardOpen: store.keyBoardState.keyboardOpen
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ clickButton, clickKeyboard }, dispatch);

const ChannelEdit = class ChannelEdit extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      navigation: props.navigation,
      route_list: 'L',
      channel_name: '',
      board: props.navigation ? props.navigation.getParam('board') : null,
    };
  }


  async  getCategory() {

  }

  async onChange(value, state) {

  }

  render() {
    return (

      <View style={styles.container}>
        <DropdownAlert updateStatusBar={false} ref={ref => this.dropdown = ref} />
        <Formik
          initialValues={{ board: this.state.board ? this.state.board.id : '', channel_name: '', channel: this.state.channel, room: '' }}
          onSubmit={async (values, { setSubmitting, setValues }) => {
            await this.save(values);
            setTimeout(() => {
              var payload = { ...values, channel: values.channel } // Construct the new payload
              setValues(payload) // Updates Formik's internal state
            }, 1000);
          }}

          validationSchema={yup.object().shape({

            board: yup
              .string()
              .required('Selecione a Placa!'),

            channel: yup
              .string()
              .required('Selecione o canal!'),

            channel_name: yup
              .string(),

            room: yup
              .string()

          })}

        >
          {formik => (

            <React.Fragment>

              <View>

                <Text style={styles.TextLabel}>Acesso Local</Text>

                <Switch
                  onValueChange={(value) => {
                    this.toggleSwitch(value);
                  }}
                  style={styles.Switch}

                  value={this.state.isEnabled}
                  trackColor={{ true: '#38ef7d', false: '#d3d3d3' }} // fundo
                  thumbColor={{ true: '#38ef7d', false: '#a0a0a0' }} //ataque 
                />
                {formik.touched.is_enabled && formik.errors.is_enabled &&
                  <Text style={styles.TextError}>{formik.errors.is_enabled}</Text>
                }
              </View>



              <View>


                <Text style={styles.TextLabel}>Placa</Text>
                <Picker
                  style={!formik.errors.board ? styles.TextDropdown : styles.TextDropdownInvalid}
                  // passing value directly from formik
                  selectedValue={formik.values.board}
                  // changing value in formik
                  onValueChange={async (itemValue, key) => {
                    console.log(itemValue, key);
                    await this.getChannelsBoard(itemValue);
                    formik.setFieldValue('board', itemValue);
                  }}
                  value={formik.values.board}
                >
                  <Picker.Item label="Selecione" value="" />
                  {this.PickerItemBoards()}
                </Picker>
                {formik.touched.board && formik.errors.board &&
                  <Text style={styles.TextError}>{formik.errors.board}</Text>
                }

              </View>



              <View>

                <Text style={styles.TextLabel}>Canal</Text>
                <Picker
                  style={!formik.errors.channel ? styles.TextDropdown : styles.TextDropdownInvalid}
                  // passing value directly from formik
                  selectedValue={formik.values.channel}
                  // changing value in formik
                  onValueChange={async (itemValue, key) => {
                    formik.setFieldValue('channel', itemValue);
                  }}

                  value={formik.values.channel}

                >
                  <Picker.Item label="Selecione" value="" />
                  {this.PickerItemChannel()}
                </Picker>
                {formik.touched.channel && formik.errors.channel &&
                  <Text style={styles.TextError}>{formik.errors.channel}</Text>
                }
              </View>

              <View>

                <Text style={styles.TextLabel}>Comódo</Text>
                <Picker
                  style={!formik.errors.room ? styles.TextDropdown : styles.TextDropdownInvalid}
                  // passing value directly from formik
                  selectedValue={formik.values.room}
                  // changing value in formik
                  onValueChange={async (itemValue, key) => {
                    formik.setFieldValue('room', itemValue);
                  }}

                  value={formik.values.room}

                >
                  <Picker.Item label="Selecione" value="" />
                  {this.PickerItemRoom()}
                </Picker>
                {formik.touched.room && formik.errors.room &&
                  <Text style={styles.TextError}>{formik.errors.room}</Text>
                }
              </View>

              <View>
                <Text style={styles.TextLabel}>Alterar Nome</Text>
                <TextInput
                  onChangeText={formik.handleChange('channel_name')}
                  onBlur={formik.handleBlur('channel_name')}
                  value={formik.values.channel_name}
                  maxLength={100}
                  style={!formik.errors.channel_name ? styles.TextInput : styles.TextInvalid}
                >
                </TextInput>

                {formik.touched.channel_name && formik.errors.channel_name &&
                  <Text style={styles.TextError}>{formik.errors.channel_name}</Text>
                }
              </View>




              <View style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginTop: 20

              }}>

                <View style={{
                  width: '70%'
                }}>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={formik.handleSubmit}
                  >
                    <Text style={{ color: '#ffff' }}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>


            </React.Fragment>
          )}
        </Formik>
      </View>
    )
  }

  async getChannelsBoard(id) {
    if (id) {
      var board = [];
      this.state.boards.map((item, key) => {
        if (item.id == id) {
          board = item;
        }
      });

      // console.log(board);
      var url = "http://" + board.ip + ":" + board.door_new + "/" + this.state.route_list + "/";

      var response = await fetch(url)
        .then(async (response) => {
          if (!response.ok) {
            return helpers.validStatus(response.status);
          }
          return response.json();
        })
        .then(async (data) => {
          return data;
        })
        .catch(async (error) => {
          return helpers.validStatus(0, error);
        });

      var channels = [];
      Object.keys(response).map(async (item, key) => {
        if (item.match(/Nm/)) {

          var teste = {
            "name": item,
            "value": response[item],
          };

          channels.push(teste);
        }
      });

      this.setState({ channels: channels });

    }

  }

  PickerItemRoom() {
    if (this.state && this.state.rooms) {
      itens = [];

      for (let index = 0; index < this.state.rooms.length; index++) {
        if (this.state.rooms[index].id_board == this.state.board.id) {
          itens.push(
            <Picker.Item key={index} label={this.state.rooms[index].name} value={this.state.rooms[index].id} />
          )
        }
      }

      return itens;

    } else {
      return (
        <Picker.Item label={'-'} value={""} />
      );
    }
  }


  PickerItemChannel() {
    if (this.state && this.state.channels) {
      return Object.keys(this.state.channels).map((item, i) => {
        return (
          <Picker.Item key={i} label={this.state.channels[i].value} value={this.state.channels[i].name} />
        );
      });
    } else {
      return (
        <Picker.Item label={'-'} value={""} />
      );
    }
  }
  PickerItemBoards() {

    if (this.state && this.state.boards) {
      return Object.keys(this.state.boards).map((item, i) => {
        return (
          <Picker.Item key={i} label={this.state.boards[i].name} value={this.state.boards[i].id} />
        );
      });
    } else {
      return (
        <Picker.Item label={'-'} value={""} />
      );
    }

  }

  pickerDropdowlist(itemValue, itemIndex) {
    // console.log(itemValue, itemIndex);
    // console.log( Formik.values);
    // Formik.values.board = itemIndex;
  }

  async save(values) {
    var board = [];
    this.state.boards.map((item, key) => {
      if (item.id == values.board) {
        board = item;
      }
    });

    var ip = board.ip;
    var door_new = board.door_new
    var url = 'http://' + ip + ':' + door_new + '/L/?' + 'cny' + values.channel.replace(/[^\d]+/g, '') + 'yz' + values.channel_name + 'z';
    if (values.channel_name) {
      var response = await helpers.get(url);
      if (!response.success) {
        console.log(response.message);
      }


      var arrayChanels = this.state.channels.map((item, key) => {
        if (item.name == values.channel) {
          item.value = values.channel_name;
          console.log(item);
        }
        return item;

      });

      this.setState({ channels: arrayChanels });
    }

    var elements = await helpers.getArrayStorage('rooms_devices');

    console.log(elements);

    let mount = {
      id_room: values.room,
      channel: parseInt(values.channel.replace(/[^\d]+/g, '')),
      id_board: values.board
    }

    valid = false;

    for (let index = 0; index < elements.length; index++) {
      if (elements[index].id_board == mount.id_board && elements[index].channel == mount.channel) {
        valid = true;
        elements[index].id_room = mount.id_room;
        mount = elements;
      }
    }

    if (valid) {
      saveStorage = await helpers.storageArrayStorage('rooms_devices', mount);
    } else {
      saveStorage = await helpers.pushArrayStorage('rooms_devices', mount);
    }


    console.log(saveStorage);


    this.dropdown.alertWithType('success', 'Sucesso', "Salvo com sucesso");



  }

  async componentDidMount() {
    // console.log(await helpers.getArrayStorage('rooms'));
    this.setState({
      boards: await helpers.getArrayStorage('boards'),
      rooms: await helpers.getArrayStorage('rooms')
    });

    if (this.state.board) {
      await this.getChannelsBoard(this.state.board.id);
    }

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      this._keyboardDidShow();
    });

    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      this._keyboardDidHide();
    });
  }


  componentWillUnmount() {
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }
    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
    }
  }

  _keyboardDidShow() {
    // alert(this.props);
    this.setState({ keyboardDidShow: true });

    // alert('Keyboard Shown');
  }

  _keyboardDidHide() {
    // alert('Keyboard Hidden');
    this.setState({ keyboardDidShow: false });

  }



}

ChannelEdit.navigationOptions = {
  title: 'Configurações',
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

export default connect(mapStateToProps, mapDispatchToProps)(ChannelEdit);
