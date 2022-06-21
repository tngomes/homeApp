// import React from 'react';
//import { View, Button, Text } from 'react-native';
import React, { Component, Fragment, } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { clickButton, clickKeyboard } from '../../actions';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { Text, Keyboard, Animated, View, Button, TextInput, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Map from "../../components/Map";
import { styles } from "../../styles";
import DropdownAlert from 'react-native-dropdownalert';
import helpers from "../../components/helpers";
// const Form = t.form.Form;
import { Formik } from 'formik';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faLightbulb, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
 

// const mapStateToProps = store => ({
//   modalOpen: store.clickState.modalOpen,
//   keyboardOpen: store.keyBoardState.keyboardOpen
// });

// const mapDispatchToProps = dispatch =>
//   bindActionCreators({ clickButton, clickKeyboard }, dispatch);

const BoardEdit = class BoardEdit extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      navigation: props.navigation,
      isEnabled: false,
      route_list: 'L',
      board: props.navigation ? props.navigation.getParam('board') : null,
    };
  }

  onTextChange() {

  }

  toggleSwitch(value) {
    this.setState({ 'isEnabled': value });
  }

  componentWillReceiveProps(nextProps) {
    console.log('testando...');
  }

  render() {
    return (
      <View style={styles.container}>
        <DropdownAlert updateStatusBar={false} ref={ref => this.dropdown = ref} />
        <Formik
          initialValues={{ name: this.state.board.name, ip: this.state.board.ip, door_current: this.state.board.door_new, door_new: this.state.board.door_new }}
          onSubmit={async (values) => {
            await this.save(values);
          }}
          validationSchema={yup.object().shape({

            name: yup
              .string()
              .required('Informe o Nome da placa!')
              .min(0, 'O Nome deve conter mais de 5 letras!')
              .max(100, 'O Nome deve conter menos de 100 letras!')
              .notOneOf(['admin', 'administrador'], 'Palavra impróprio!'),

            ip: yup
              .string()
              .required('Informe o Ip da placa!')
              .min(5, 'O Ip deve conter mais de 5 números!')
              .max(100, 'O Ip deve conter menos de 100 números!')
              .notOneOf(['admin', 'administrador'], 'Número impróprio!'),

            door_new: yup
              .string()
              .required('Informe a Porta da Placa!')
              .min(1, 'O Ip deve conter mais de 5 números!')
              .max(100, 'O Ip deve conter menos de 100 números!')
              .notOneOf(['admin', 'administrador'], 'Palavra impróprio!'),
          })}

        >
          {formik => (
            <React.Fragment>

              <View>
                <Text style={styles.TextLabel}>Nome</Text>
                <TextInput
                  onChangeText={formik.handleChange('name')}
                  onBlur={formik.handleBlur('name')}
                  maxLength={100}
                  style={!formik.errors.name ? styles.TextInput : styles.TextInputInvalid}
                  value={formik.values.name}
                >
                </TextInput>
                {formik.touched.name && formik.errors.name ?
                  <Text style={styles.TextInvalid}>{formik.errors.name}</Text>
                  : null
                }
              </View>

              <View>
                <Text style={styles.TextLabel}>Ip</Text>
                <TextInput
                  onChangeText={formik.handleChange('ip')}
                  onBlur={formik.handleBlur('ip')}
                  textContentType='telephoneNumber'
                  dataDetectorTypes='phoneNumber'
                  keyboardType='decimal-pad'
                  maxLength={100}
                  style={!formik.errors.ip ? styles.TextInput : styles.TextInputInvalid}
                  value={formik.values.ip}

                >
                </TextInput>
                {formik.touched.ip && formik.errors.ip ?
                  <Text style={styles.TextInvalid}>{formik.errors.ip}</Text>
                  : null
                }
              </View>


              <View>
                <Text style={styles.TextLabel}>Porta atual</Text>
                <TextInput
                  onChangeText={formik.handleChange('door_current')}
                  onBlur={formik.handleBlur('door_current')}
                  value={formik.values.door_current}
                  textContentType='telephoneNumber'
                  dataDetectorTypes='phoneNumber'
                  keyboardType='decimal-pad'
                  maxLength={100}
                  editable={false}
                  style={!formik.errors.door_current ? styles.TextInput : styles.TextInputInvalid}
                  value={formik.values.door_current}

                >
                </TextInput>
                {formik.touched.door_current && formik.errors.door_current &&
                  <Text style={styles.TextInvalid}>{formik.errors.door_current}</Text>
                }
              </View>

              <View>

                <Text style={styles.TextLabel}>Nova Porta</Text>
                <TextInput
                  onChangeText={formik.handleChange('door_new')}
                  onBlur={formik.handleBlur('door_new')}
                  value={formik.values.door_new}
                  textContentType='telephoneNumber'
                  dataDetectorTypes='phoneNumber'
                  keyboardType='decimal-pad'
                  maxLength={100}
                  style={!formik.errors.door_new ? styles.TextInput : styles.TextInputInvalid}
                  value={formik.values.door_new}
                >
                </TextInput>
                {formik.touched.door_new && formik.errors.door_new &&
                  <Text style={styles.TextInvalid}>{formik.errors.door_new}</Text>
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

  async save(values) {
    // console.log(values);

    try {

      if (!values) {
        return;
      }

      if (values.door_new != values.door_current) {
        var url = "http://" + values.ip + ":" + values.door_current + "/" + this.state.route_list + "/" + "?pty" + values.door_new + "y";
        var response = await helpers.get(url);
        if (!response.success) {
          console.log(response.message);
          this.dropdown.alertWithType('error', 'Erro', response.message);
          return;
        }
      }

      var boards = await helpers.getArrayStorage('boards');

      var new_boards = await boards.map((item, i) => {
        if (this.state.board.id == item.id) {
          item.ip = values.ip;
          item.door_new = values.door_new;
          item.name = values.name;
        }
        return item;
      });

      var new_boards = JSON.stringify(new_boards);

      await helpers.storageSetItem('boards', new_boards);

      this.dropdown.alertWithType('success', 'Atualizado', "Atualizado com sucesso");

      setTimeout(async () => {
        this.dropdown.close(); // close it
      }, 1000);

      setTimeout(async () => {
        this.state.navigation.navigate('MyBoards', { boards: await helpers.getArrayStorage('boards') });
        return;
      }, 2000);


    } catch (error) {
      console.log(error);
      this.dropdown.alertWithType('error', 'Error', "Falha ao salvar");
    }

  };

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

BoardEdit.navigationOptions = ({ navigation }) => ({
  title: 'Editar Placa',
  headerTintColor: '#ffffff',
  headerStyle: {
    backgroundColor: '#2C90FA',
    borderBottomColor: '#ffffff',
    // borderBottomWidth: 1,
  },
  headerTitleStyle: {
    fontSize: 18,
  },
})

export default BoardEdit;
