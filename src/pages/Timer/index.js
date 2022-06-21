import { Animated, View, Button, Text, StyleSheet, Switch, TextInput, Picker, CheckBox } from 'react-native';
import React, { Component, Fragment } from 'react';
import helpers from "../../components/helpers";
import { Formik } from 'formik';
import * as yup from 'yup';
import DropdownAlert from 'react-native-dropdownalert';
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker';
import { styles } from "../../styles";
import moment from "moment";

 

const Timer = class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigation: props.navigation,
      route_list: 'L',
      channel_name: '',
      board: props.navigation ? props.navigation.getParam('board') : null,
      schedule_disabled_view: true,
      channel: '',
      'time_start': '00:00',
    };

  }

  render() {
    return (
      <View style={styles.container}>
        <DropdownAlert updateStatusBar={false} ref={ref => this.dropdown = ref} />

        <Formik
          initialValues={{
            board: this.state.board ? this.state.board.id : '',
            channel: this.state.channel,

            time_start: '00:00',
          }}
          onSubmit={async (values, { setSubmitting, setValues }) => {
            await this.save(values);
            // console.log(values);
            // setTimeout(() => {
            //   var payload = { ...values, channel: values.channel } // Construct the new payload
            //   setValues(payload) // Updates Formik's internal state
            // }, 100);


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

            time_start: yup
              .string()
              .required('Selecione o inicio!'),

          })}

        >
          {formik => (
            <React.Fragment>
              <View>
                <Text style={formik.touched.board && formik.errors.board ? styles.TextLabelError : styles.TextLabel}>Placa</Text>
                <Picker
                  style={formik.touched.board && formik.errors.board ? styles.TextDropdownInvalid : styles.TextDropdown}
                  // passing value directly from formik
                  selectedValue={formik.values.board}
                  // changing value in formik
                  onValueChange={async (itemValue, key) => {
                    await this.getChannelsBoard(itemValue);
                    formik.setFieldValue('board', itemValue);

                  }}

                  value={formik.values.board}

                >
                  <Picker.Item label="Selecione" value="" />
                  {this.PickerItemBoards()}
                </Picker>
                {formik.touched.board && formik.errors.board ?
                  <Text style={styles.TextError}>{formik.errors.board}</Text>
                  : null
                }
              </View>

              <View>
                <Text style={formik.touched.channel && formik.errors.channel ? styles.TextLabelError : styles.TextLabel}>Canal</Text>
                <Picker
                  style={formik.touched.channel && formik.errors.channel ? styles.TextDropdownInvalid : styles.TextDropdown}
                  // passing value directly from formik
                  selectedValue={formik.values.channel}
                  // changing value in formik
                  onValueChange={async (itemValue, key) => {
                    formik.setFieldValue('channel', itemValue);

                    this.setState({ 'schedule_disabled_view': key != 0 ? false : true });
                    this.setValuesInputs(formik, itemValue);
                  }}

                  value={formik.values.channel}

                >
                  <Picker.Item label="Selecione" value="" />
                  {this.PickerItemChannel()}
                </Picker>
                {formik.touched.channel && formik.errors.channel ?
                  <Text style={styles.TextError}>{formik.errors.channel}</Text>
                  : null
                }
              </View>

              <View>
                <Text style={formik.touched.time_start && formik.errors.time_start ? styles.TextLabelError : styles.TextLabel}>Acionar</Text>
                <DatePicker
                  androidMode="clock"
                  date={formik.values.time_start}
                  mode="time"
                  format="HH:mm"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  minuteInterval={10}
                  onDateChange={(time_start) => {
                    formik.setFieldValue('time_start', time_start);
                    this.setState({ 'time_start': time_start });
                  }}
                  style={formik.touched.time_start && formik.errors.time_start ? styles.TextInputDatePicker : styles.TextInputDatePicker}
                  customStyles={{

                    dateInput: {
                      borderRadius: 5,
                    }
                  }}
                />

                {formik.touched.time_start && formik.errors.time_start &&
                  <Text style={styles.TextError}>{formik.errors.time_start}</Text>
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

                  <Button
                    style={{ fontSize: 20, color: 'green' }}
                    styleDisabled={{ color: 'red' }}
                    onPress={formik.handleSubmit} title="Submit"
                    title="Salvar"
                  >
                  </Button>
                </View>
              </View>

            </React.Fragment>
          )}
        </Formik>
      </View>
    )
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

  setValuesInputs(formik, itemValue) {
    if (itemValue) {
      //preencher timers
      var schedules = this.state.response['HA' + itemValue.replace(/[^\d]+/g, '')];
      var schedules = schedules.split("-");
      formik.setFieldValue('time_start', schedules[0]);
      //preencher agendamento
      console.log(itemValue);
      console.log();
      var activateTimer = this.state.response['AG' + itemValue.replace(/[^\d]+/g, '')];
      activateTimer = parseInt(activateTimer);
      formik.setFieldValue('schedule', activateTimer ? true : false);
    }
  }
  async componentDidMount() {
    this.setState({ boards: await helpers.getArrayStorage('boards') });

    if (this.state.board) {
      await this.getChannelsBoard(this.state.board.id);
    }
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
          // console.log(response);
          var teste = {
            "name": item,
            "value": response[item],
          };

          channels.push(teste);
        }
      });

      this.setState({ channels: channels, response: response });

    }

  }


  pickerDropdowlist(itemValue, itemIndex) {
    // console.log(itemValue, itemIndex);
    // console.log( Formik.values);
    // Formik.values.board = itemIndex;
  }

  rules_format(values) {
    const time_start = values.time_start;
    const code = '';
    //const sp = time_start.split(":");
    //const code = sp[0] + 'yz' + ep[0] + 'zl' + sp[1] + 'ld' + ep[1] + 'd';

    return code;
  }

  async scheduleActive(formik, value) {
    var board = [];


    if (formik.values.channel) {
      board = await this.getBoardState(formik.values.board);
    }
    var url = 'http://' + board.ip + ':' + board.door_new + '/L/?' + 'Agy' + formik.values.channel.replace(/[^\d]+/g, '') + 'yz' + (formik.values.schedule ? 0 : 1) + 'z';
    var response = await helpers.get(url);
    if (!response.success) {
      console.log(response.message);
    }

    // Agy1yz1z

  }

  async rulesScheduleActive() {

  }

  async getBoardState(id) {
    var board = [];

    this.state.boards.map((item, key) => {
      if (item.id == id) {
        board = item;
      }
    });
    return board;
  }

  async save(values) {
    var time_start = values.time_start;
    time_start = moment.duration(time_start).asSeconds();
    var board = [];
    board = await this.getBoardState(values.board);

    var ip = board.ip;
    var door_new = board.door_new
    console.log(values.channel);
    console.log(values.channel.replace(/[^\d]+/g, ''));
    var indice = values.channel.replace(/[^\d]+/g, '');
    //console.log ('AG' + indice );
    console.log (this.state.response[indice]);
    var valor = this.state.response[indice];
      if(!parseInt(valor)){
        this.dropdown.alertWithType('error', 'Erro', "Existe um agendamento ativo para este canal!");
        return;
      }

    const rules_format = this.rules_format(values);

    var url = 'http://' + ip + ':' + door_new + '/L/?' + 'Ty' + values.channel.replace(/[^\d]+/g, '') + 'yz' + time_start + 'z';
    var response = await helpers.get(url);
    if (!response.success) {
      console.log(response.message);
      return;
    }
    this.dropdown.alertWithType('success', 'Sucesso', "Salvo com sucesso");

    //  else {
    //   this.dropdown.alertWithType('info', 'Informação', "Nada a Submeter");

    //   }
  }
}

Timer.navigationOptions = {
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

export default Timer;