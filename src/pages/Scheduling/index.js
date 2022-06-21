
import { Animated, View, Button, Text, StyleSheet, Switch, TextInput, Picker } from 'react-native';
import React, { Component, Fragment } from 'react';
import helpers from "../../components/helpers";
import { Formik } from 'formik';
import * as yup from 'yup';
import DropdownAlert from 'react-native-dropdownalert';
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker';
import { styles } from "../../styles";
import moment from "moment";
import CheckBox from '@react-native-community/checkbox';
 

const Scheduling = class Scheduling extends React.Component {
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
            time_end: '00:00',
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

            time_end: yup
              .string()
              .required('Selecione o fim!')
              .notOneOf(
                [
                  yup.ref('time_start'),
                ],
                'Selecione um horário válido'
              )
              .test("is-greater", "Horario não permitido", (value) => {
                return moment(value, "HH:mm").isSameOrAfter(moment(this.state.time_start, "HH:mm"));
              })

            ,


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
                    await formik.setErrors({});

                    await formik.setFieldValue('channel', itemValue);

                    this.setState((state) => {
                      return { 'schedule_disabled_view': key != 0 ? false : true }
                    });

                    await this.setValuesInputs(formik, itemValue);
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
                <Text style={formik.touched.schedule && formik.errors.schedule ? styles.TextLabelError : styles.TextLabel}>Ativar Agendamento</Text>
                <CheckBox
                  style={formik.touched.schedule && formik.errors.schedule ? styles.TextDropdownInvalid : styles.TextDropdown}
                  selectedValue={formik.values.schedule}
                  value={formik.values.schedule}
                  onValueChange={async (itemValue, key) => {
                    formik.setFieldValue('schedule', itemValue);
                    await this.scheduleActive(formik, itemValue);
                  }}
                  disabled={this.state.schedule_disabled_view}
                />

                {formik.touched.schedule && formik.errors.schedule &&
                  <Text style={styles.TextError}>{formik.errors.schedule
                  }</Text>
                }
              </View>


              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 0.5 }}>
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

                <View style={{ flex: 0.5 }}>

                  <Text style={formik.touched.time_end && formik.errors.time_end ? styles.TextLabelError : styles.TextLabel}>Desligar</Text>
                  <DatePicker
                    androidMode="clock"
                    date={formik.values.time_end}
                    mode="time"
                    format="HH:mm"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    minuteInterval={10}
                    onDateChange={(time_end) => {
                      formik.setFieldValue('time_end', time_end);
                    }}
                    style={formik.touched.time_end && formik.errors.time_end ? styles.TextInputDatePicker : styles.TextInputDatePicker}
                    customStyles={{

                      dateInput: {
                        borderRadius: 5,
                      }
                    }}
                  />

                  {formik.touched.time_end && formik.errors.time_end &&
                    <Text style={styles.TextError}>{formik.errors.time_end}</Text>
                  }
                </View>
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

  async setValuesInputs(formik, itemValue) {
    if (itemValue) {
      //preencher timers
      var schedules = this.state.response['HA' + itemValue.replace(/[^\d]+/g, '')];
      var schedules = schedules.split("-");
      formik.setFieldValue('time_start', schedules[0]);
      formik.setFieldValue('time_end', schedules[1]);
      //preencher agendamento
      console.log(itemValue);
      console.log();
      var activateScheduling = this.state.response['AG' + itemValue.replace(/[^\d]+/g, '')];
      activateScheduling = parseInt(activateScheduling);
      formik.setFieldValue('schedule', activateScheduling ? true : false);
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

      await this.viewingChannelsMounts(response);
    }

  }

  async viewingChannelsMounts(response) {
    var channels = [];
    Object.keys(response).map(async (item, key) => {
      if (item.match(/Nm/)) {
        // console.log(response);
        var mount = {
          "name": item,
          "value": response[item],
        };
        channels.push(mount);
      }
    });

    this.setState((state) => {
      // Importante: use `state` em vez de `this.state` quando estiver atualizando.
      return { channels: channels, response: response }
    });
  }


  pickerDropdowlist(itemValue, itemIndex) {
    // console.log(itemValue, itemIndex);
    // console.log( Formik.values);
    // Formik.values.board = itemIndex;
  }

  rules_format(values) {
    const time_start = values.time_start;
    const time_end = values.time_end;
    const sp = time_start.split(":");
    const ep = time_end.split(":");

    const code = sp[0] + 'yz' + ep[0] + 'zl' + sp[1] + 'ld' + ep[1] + 'd';

    return code;
  }

  async scheduleActive(formik) {
    var board = [];


    if (formik.values.channel) {
      board = await this.getBoardState(formik.values.board);
    }
    var url = 'http://' + board.ip + ':' + board.door_new + '/L/?' + 'Agy' + formik.values.channel.replace(/[^\d]+/g, '') + 'yz' + (formik.values.schedule ? 0 : 1) + 'z';
    var response = await helpers.get(url);
    console.log(response);
    if (!response.success) {
      console.log(response.message);
    }

    this.viewingChannelsMounts(response);
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
  rulesSubmit(values) {
    var channel = values.channel.replace(/[^\d]+/g, '');
    channelInt = parseInt(channel);
    channel = channelInt >= 10 ? 'n' + channel.substring(1, 2) : channel;

    return {
      channel: channel,
    }
  }
  async save(values) {
    var board = [];
    board = await this.getBoardState(values.board);

    var ip = board.ip;
    var door_new = board.door_new
    const rules_format = this.rules_format(values);
    var url = 'http://' + ip + ':' + door_new + '/L/?' + 'W' + this.rulesSubmit(values).channel + 'Iy' + rules_format;
    // if (values.channel_name) {
    var response = await helpers.get(url);
    if (!response.success) {
      console.log(response.message);
    }

    await this.viewingChannelsMounts(response);


    this.dropdown.alertWithType('success', 'Sucesso', "Salvo com sucesso");

    // } else {
    //   this.dropdown.alertWithType('info', 'Informação', "Nada a Submeter");

    // }
  }
}

Scheduling.navigationOptions = {
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

export default Scheduling;