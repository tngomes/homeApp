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

const RoomsEdit = class RoomsEdit extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);

        this.state = {
            navigation: props.navigation,
            isEnabled: false,
            route_list: 'L',
            board: props.navigation ? props.navigation.getParam('board') : null,
        };
        console.log(this.state.board);
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
            <View style={this.state.keyboardDidShow ? styles.containerFlex : styles.container}>
                <DropdownAlert updateStatusBar={false} ref={ref => this.dropdown = ref} />
                <Formik
                    initialValues={{ room_name_current: this.state.board.room_name }}
                    onSubmit={async (values) => {
                        await this.save(values);
                    }}
                    validationSchema={yup.object().shape({
                        room_name_current: yup
                            .string()
                            .required('Informe o Nome do comodo!')
                            .min(1, 'O Ip deve conter mais de 5 números!')
                            .max(100, 'O Ip deve conter menos de 100 números!')
                            .notOneOf(['admin', 'administrador'], 'Palavra impróprio!'),
                        room_name: yup
                            .string()
                            .required('Informe o Nome do comodo!')
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
                                    onChangeText={formik.handleChange('room_name_current')}
                                    onBlur={formik.handleBlur('room_name_current')}
                                    maxLength={100}
                                    style={!formik.errors.room_name_current ? styles.TextInput : styles.TextInvalid}
                                    value={formik.values.room_name_current}
                                    editable={false}
                                >
                                </TextInput>
                                {formik.touched.room_name_current && formik.errors.room_name_current ?
                                    <Text style={styles.TextError}>{formik.errors.room_name_current}</Text>
                                    : null
                                }
                            </View>

                            <View>
                                <Text style={styles.TextLabel}>Nome</Text>
                                <TextInput
                                    onChangeText={formik.handleChange('room_name')}
                                    onBlur={formik.handleBlur('room_name')}
                                    maxLength={100}
                                    style={!formik.errors.room_name ? styles.TextInput : styles.TextInvalid}
                                    value={formik.values.room_name}
                                >
                                </TextInput>
                                {formik.touched.room_name && formik.errors.room_name ?
                                    <Text style={styles.TextError}>{formik.errors.room_name}</Text>
                                    : null
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

        try {

            if (!values) {
                return;
            }

            var boards = await helpers.getArrayStorage('boards');

            var new_boards = await boards.map((item, i) => {
                if (this.state.board.id == item.id) {
                    item.room_name = values.room_name;
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

RoomsEdit.navigationOptions = ({ navigation }) => ({
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

export default RoomsEdit;
