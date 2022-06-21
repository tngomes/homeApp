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
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';



const BoardTime = class BoardTime extends React.Component {
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
            // board: this.state.board ? this.state.board.id : '',
            // channel: this.state.channel,

            // time_start: '00:00',
          }}
          onSubmit={async (values, { setSubmitting, setValues }) => {
            await this.save(values);

          }}
          validationSchema={yup.object().shape({

            // board: yup
            //   .string()
            //   .required('Selecione a Placa!'),

            // channel: yup
            //   .string()
            //   .required('Selecione o canal!'),

            // channel_name: yup
            //   .string(),

            // time_start: yup
            //   .string()
            //   .required('Selecione o inicio!'),

          })}

        >
          {formik => (
            <React.Fragment>
              <View style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginTop: 20
              }}>

                <View styles={{

                }}>
                  <FontAwesomeIcon icon={faClock} color="#02538b" size={80} />
                </View>

                <View styles={{

                }}>
                  <Text>Ajustar hora, data e dia da semana</Text>
                </View>

                <View style={{
                  width: '70%'
                }}>

                  <Button
                    style={{ fontSize: 20, color: 'green' }}
                    styleDisabled={{ color: 'red' }}
                    onPress={formik.handleSubmit} title="Submit"
                    title="Sincronizar"
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

  async componentDidMount() {
    this.setState({ boards: await helpers.getArrayStorage('boards') });
  }

  rules_format(values) {
    var day = moment().format('MM/DD/YYYY');
    var hours = moment().format('h:mm:ss');
    var dayWeek = moment().isoWeekday() + 1;

    var mount = 'DHy' + day.toString() + 'yz' + hours.toString() + 'zx' + dayWeek.toString() + 'x';
    return mount;
  }

  async save(values) {
    var board = [];
    board = this.state.board

    var ip = board.ip;
    var door_new = board.door_new


    const rules_format = this.rules_format(values);

    var url = 'http://' + ip + ':' + door_new + '/L/?' + rules_format;
    console.log(url);
    var response = await helpers.get(url);
    console.log(response);
    if (!response.success) {
      console.log(response.success);
      this.dropdown.alertWithType('error', 'Erro', response.message);
      return;
    }
    this.dropdown.alertWithType('success', 'Sucesso', "Salvo com sucesso");

    //  else {
    //   this.dropdown.alertWithType('info', 'Informação', "Nada a Submeter");

    //   }
  }
}

BoardTime.navigationOptions = {
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

export default BoardTime;