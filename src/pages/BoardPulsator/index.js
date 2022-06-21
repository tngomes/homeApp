// import React from 'react';
//import { View, Button, Text } from 'react-native';
import React, { Component, Fragment, } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { clickButton, clickKeyboard } from '../../actions';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import CheckBox from '@react-native-community/checkbox';
import { Text, Picker, Keyboard, Animated, View, Button, TextInput, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Map from "../../components/Map";
import { styles } from "../../styles";
import DropdownAlert from 'react-native-dropdownalert';
import helpers from "../../components/helpers";
import { Formik } from 'formik';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faLightbulb, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
 

const BoardPulsator = class BoardPulsator extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            navigation: props.navigation,
            isEnabled: false,
            route_list: 'L',
            board: props.navigation ? props.navigation.getParam('board') : null,
            pulsator_disabled_view: true,
            timers_pulsator: [
                {
                    name: '1 Segundos',
                    id: 1
                }, {
                    name: '2 Segundos',
                    id: 2
                }, {
                    name: '3 Segundos',
                    id: 3
                }, {
                    name: '4 Segundos',
                    id: 4
                }, {
                    name: '5 Segundos',
                    id: 5
                }
            ]
        };
    }


    render() {
        return (
            <View style={styles.container}>
            <DropdownAlert updateStatusBar={false} ref={ref => this.dropdown = ref} />
                <Formik
                    initialValues={{ board: this.state.board ? this.state.board.id : '', channel: this.state.channel, timer_pulse: this.state.timer_pulse }}
                    onSubmit={async (values) => {
                        await this.save(values);
                    }}
                    validationSchema={yup.object().shape(this.validator())}

                >
                    {formik => (
                        <React.Fragment>


                            <View>


                                <Text style={styles.TextLabel}>Placa</Text>
                                <Picker
                                    style={!formik.errors.board ? styles.TextDropdown : styles.TextDropdownInvalid}
                                    // passing value directly from formik
                                    selectedValue={formik.values.board}
                                    // changing value in formik
                                    onValueChange={async (itemValue, key) => {
                                        await this.getChannelsBoard(itemValue);
                                        formik.setFieldValue('board', itemValue);
                                    }}
                                    value={formik.values.board}
                                    disabled={this.state.pulsator_disabled_view}
                                >
                                    <Picker.Item label="Selecione" value="" />
                                    {this.PickerItemBoards()}
                                </Picker>
                                {formik.touched.board && formik.errors.board &&
                                    <Text style={styles.TextError}>{formik.errors.board}</Text>
                                }

                            </View>

                            <View>

                                <Text style={styles.TextLabel}>Tempo de Pulso</Text>
                                <Picker
                                    style={!formik.errors.timer_pulse ? styles.TextDropdown : styles.TextDropdownInvalid}
                                    // passing value directly from formik
                                    selectedValue={formik.values.timer_pulse}
                                    // changing value in formik
                                    onValueChange={async (itemValue, key) => {
                                        // await this.TimerPulse(itemValue);
                                        formik.setFieldValue('timer_pulse', itemValue);
                                    }}

                                    value={formik.values.timer_pulse}

                                >
                                    <Picker.Item label="Selecione" value="" />
                                    {this.PickerItemPulsator()}
                                </Picker>
                                {formik.touched.timer_pulse && formik.errors.timer_pulse &&
                                    <Text style={styles.TextError}>{formik.errors.timer_pulse}</Text>
                                }
                            </View>

                            <View>

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
                            </View>

                        </React.Fragment>
                    )}
                </Formik>
            </View>
        )
    }
    validator() {
        let validator = {
            board: yup
                .string()
                .required('Selecione a Placa!'),

            timer_pulse: yup
                .string()
                .required('Selecione o tempo!'),


        }
        return validator;
    }
    async setValuesInputs(formik, itemValue) {
        if (itemValue) {
            var activatePulsator = this.state.response['R' + itemValue.replace(/[^\d]+/g, '')];
            activatePulsator = parseInt(activatePulsator);
            console.log(activatePulsator);
            formik.setFieldValue('pulsator', activatePulsator ? false : true);
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

    PickerItemPulsator() {
        if (this.state && this.state.timers_pulsator) {
            return Object.keys(this.state.timers_pulsator).map((item, i) => {
                return (
                    <Picker.Item key={i} label={this.state.timers_pulsator[i].name} value={this.state.timers_pulsator[i].id} />
                );
            });
        } else {
            return (
                <Picker.Item label={'-'} value={""} />
            );
        }
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

        try {

            if (!values) {
                return;
            }

            if (values.board) {
                board = await this.getBoardState(values.board);
                var url = "http://" + board.ip + ":" + board.door_new + "/" + this.state.route_list + "/" + "?tpy" + values.timer_pulse + 'y';
                console.log(url);
                var response = await helpers.get(url);
                console.log(response);

                if (!response.success) {
                    this.dropdown.alertWithType('error', 'Error', "Falha ao salvar");
                } else {
                    this.dropdown.alertWithType('success', 'Atualizado', "Atualizado com sucesso");
                }
            }

            setTimeout(async () => {
                this.dropdown.close(); // close it
            }, 1000);

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
        this.setState({ keyboardDidShow: true });
    }

    _keyboardDidHide() {
        this.setState({ keyboardDidShow: false });

    }

    async componentDidMount() {
        this.setState({
            boards: await helpers.getArrayStorage('boards'),
        });

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

            var url = "http://" + board.ip + ":" + board.door_new + "/" + this.state.route_list + "/";
            var response = await helpers.get(url);

            await this.viewingChannelsMounts(response);
        }
    }
    async viewingChannelsMounts(response) {
        var channels = [];
        Object.keys(response).map(async (item, key) => {
            if (item.match(/Nm/)) {
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

}

BoardPulsator.navigationOptions = ({ navigation }) => ({
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

export default BoardPulsator;
