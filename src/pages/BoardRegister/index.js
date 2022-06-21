// import React from 'react';
//import { View, Button, Text } from 'react-native';
import React, { Component, Fragment } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Text, Picker, View, Button, TextInput, StyleSheet, Switch, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import DropdownAlert from 'react-native-dropdownalert';
import helpers from "../../components/helpers";
import { styles } from "../../styles";
import { Formik } from 'formik';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faLightbulb, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";



const BoardRegister = class BoardRegister extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      navigation: props.navigation,
      isEnabled: false,
      route_list: 'L',
      loading: false,
      categorys: [
        {
          name: 'Residencial',
          value: 1
        },
        {
          name: 'Comercial',
          value: 2
        },
      ]
    };
  }

  onTextChange() {

  }

  toggleSwitch(value) {
    this.setState({ 'isEnabled': value });
  }


  render() {
    return (
      <View style={styles.containerView}>
        <View>
          <DropdownAlert updateStatusBar={false} ref={ref => this.dropdown = ref} />
        </View>


        <Formik
          initialValues={{ name: '', ip: '', door_new: '80', category: '' }}
          onSubmit={(values) => {
            this.save(values);
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

            category: yup
              .string()
              .required('Informe a Categoria!')
          })}

        >
          {formik => (
            <Fragment>

              <View>
                <Text style={styles.TextLabel}>Acesso Local</Text>

                <Switch
                  onValueChange={(value) => {
                    this.toggleSwitch(value);
                  }}

                  value={this.state.isEnabled}
                  trackColor={{ true: '#38ef7d', false: '#d3d3d3' }} // fundo
                  thumbColor={{ true: '#38ef7d', false: '#a0a0a0' }} //ataque 
                />
              </View>


              <View>

                <Text style={styles.TextLabel}>Nome</Text>
                <TextInput
                  onChangeText={formik.handleChange('name')}
                  onBlur={formik.handleBlur('name')}
                  maxLength={100}
                  style={!formik.errors.name ? styles.TextInput : styles.TextInvalid}
                  value={formik.values.name}
                >
                </TextInput>
                {formik.touched.name && formik.errors.name ?
                  <Text style={styles.TextError}>{formik.errors.name}</Text>
                  : null
                }
              </View>


              <View>

                <Text style={styles.TextLabel}>Ip</Text>
                <TextInput
                  onChangeText={formik.handleChange('ip')}
                  onBlur={formik.handleBlur('ip')}
                  keyboardType='decimal-pad'
                  autoCapitalize="words" //verificar oq é 
                  maxLength={100}
                  style={!formik.errors.ip ? styles.TextInput : styles.TextInvalid}
                  value={formik.values.ip}

                >
                </TextInput>
                {formik.touched.ip && formik.errors.ip ?
                  <Text style={styles.TextError}>{formik.errors.ip}</Text>
                  : null
                }
              </View>


              <View>
                <Text style={styles.TextLabel}>Porta atual</Text>
                <TextInput
                  onChangeText={formik.handleChange('door_new')}
                  onBlur={formik.handleBlur('door_new')}
                  value={formik.values.door_new}
                  keyboardType='decimal-pad'
                  autoCapitalize="words" //verificar oq é 
                  maxLength={100}
                  style={!formik.errors.door_new ? styles.TextInput : styles.TextInvalid}
                  value={formik.values.door_new}
                >
                </TextInput>
                {formik.touched.door_new && formik.errors.door_new &&
                  <Text style={styles.TextError}>{formik.errors.door_new}</Text>
                }
              </View>


              <View>
                <Text style={styles.TextLabel}>Categoria</Text>
                <Picker
                  style={!formik.errors.category ? styles.TextDropdown : styles.TextDropdownInvalid}
                  // passing value directly from formik
                  selectedValue={formik.values.category}
                  // changing value in formik
                  onValueChange={async (itemValue, key) => {
                    formik.setFieldValue('category', itemValue);
                  }}

                  value={formik.values.category}

                >
                  <Picker.Item label="Selecione" value="" />
                  {this.PickerItemCategory()}
                </Picker>
                {formik.touched.category && formik.errors.category &&
                  <Text style={styles.TextError}>{formik.errors.category}</Text>
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
                    disabled={this.state.loading}
                  >
                    {
                      this.state.loading ?
                        (
                          <ActivityIndicator size="small" color="#ffff" />
                        )
                        :
                        (
                          <Text style={{ color: '#ffff' }}>Salvar</Text>
                        )
                    }

                  </TouchableOpacity>
                </View>
              </View>
            </Fragment>
          )}
        </Formik>

      </View>

    )
  }

  async save(values) {
    this.setState({ loading: true })
    try {

      if (!values) {
        this.setState({ loading: false })

        return;
      }

      var url = "http://" + values.ip + ":" + values.door_new + "/" + this.state.route_list + "/";
      var response = await helpers.get(url);

      if (!response.success) {
        this.setState({ loading: false })
        this.dropdown.alertWithType('error', 'Erro', response.message);
        return;
      }

      const obj2 = {
        id: new Date().getTime(),
        room_name: 'Comodos',
      };

      let boards = await helpers.getArrayStorage('boards');

      if (!boards.length) {
        await helpers.storageSetItem('id_board_main', obj2.id.toString());
      }

      await helpers.pushArrayStorage('boards', { ...values, ...obj2 });


      var rooms = [
        {
          'name': 'Sala',
          'id_board': obj2.id
        },
        {
          'name': 'Cozinha',
          'id_board': obj2.id
        },
        {
          'name': 'Banheiro',
          'id_board': obj2.id
        },
        {
          'name': 'Quarto',
          'id_board': obj2.id
        }
      ];

      var prepare = Promise.resolve(rooms);

      prepare.then(async (rooms) => {
        for (const [idx, room] of rooms.entries()) {
          await helpers.registerRoom(room);
        }
      });
      this.dropdown.alertWithType('success', 'Sucesso', "Salvo com sucesso");
      
      this.setState((state, props) => {
        return {
          loading: false
        };
      });

     

      setTimeout(async () => {
        this.dropdown.close(); // close it
        this.dropdown = null;
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

  PickerItemCategory() {
    if (this.state && this.state.categorys) {
      return Object.keys(this.state.categorys).map((item, i) => {
        return (
          <Picker.Item key={i} label={this.state.categorys[i].name} value={this.state.categorys[i].value} />
        );
      });
    } else {
      return (
        <Picker.Item label={'-'} value={""} />
      );
    }

  }
}

BoardRegister.navigationOptions = ({ navigation }) => ({
  title: 'Cadastrar Placa',
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

export default BoardRegister;