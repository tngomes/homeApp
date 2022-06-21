// import React from 'react';
//import { View, Button, Text } from 'react-native';
import React, { Component, Fragment } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Image, Text, Animated, View, Button, TextInput, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import DropdownAlert from 'react-native-dropdownalert';
import helpers from "../../components/helpers";
// const Form = t.form.Form;
import { Formik } from 'formik';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faLightbulb, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { styles } from "../../styles";
 

const RegisterRooms = class RegisterRooms extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            navigation: props.navigation,
            isEnabled: false,
            route_list: 'L',
            photo: {
                'path': '',
                'valid': false,
            },

        };
    }
    validator() {
        var validator = yup.object().shape({
            name: yup
                .string()
                .required('Informe o Nome da placa!')
                .min(0, 'O Nome deve conter mais de 5 letras!')
                .max(100, 'O Nome deve conter menos de 100 letras!')
                .notOneOf(['admin', 'administrador'], 'Palavra impróprio!'),

            img: yup
                .string()
                .required('Selecione uma imagem!')

        });
        return validator;
    }
    render() {

        return (
            <View style={this.state.keyboardDidShow ? styles.containerFlex : styles.container}>

                <DropdownAlert updateStatusBar={false} ref={ref => this.dropdown = ref} />

                <Formik
                    initialValues={{ name: '', img: '' }}
                    onSubmit={(values) => {
                        this.save(values)
                    }}
                    validationSchema={this.validator()}
                >
                    {formik => (
                        <Fragment>

                            <View>

                                <Text style={styles.TextLabel}>Nome</Text>
                                <TextInput
                                    onChangeText={formik.handleChange('name')}
                                    onBlur={formik.handleBlur('name')}
                                    value={formik.values.name}
                                    maxLength={100}
                                    style={!formik.errors.name ? styles.TextInput : styles.TextInvalid}
                                >
                                </TextInput>

                                {formik.touched.name && formik.errors.name &&
                                    <Text style={styles.TextError}>{formik.errors.name}</Text>
                                }
                            </View>

                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                                {this.state.photo && this.state.photo.valid ? (
                                    <TouchableOpacity onPress={() => {
                                        this.handleChoosePhoto(formik);
                                        // formik.setFieldValue('time_start', time_start);

                                    }} >
                                        <Image
                                            source={{ uri: `data:image/png;base64,${this.state.photo.data}` }}
                                            style={{
                                                width: 175,
                                                height: 190,
                                            }}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                        <TouchableOpacity onPress={() => {
                                            this.handleChoosePhoto(formik);
                                        }} >
                                            <Image source={require('../../assets/dummy.png')}
                                                style={{
                                                    width: 175,
                                                    height: 190,
                                                }}
                                            />
                                        </TouchableOpacity>
                                    )}
                                {formik.touched.img && formik.errors.img &&
                                    <Text style={styles.TextError}>{formik.errors.img}</Text>
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

                        </Fragment>
                    )}
                </Formik>

            </View >

        )
    }
    onTextChange() {

    }

    toggleSwitch(value) {
        this.setState({ 'isEnabled': value });
    }

    onGetImageResponse(res) {

    }

    handleChoosePhoto(formik) {
        const options = {
            noData: true,
            skipBackup: false,
        };
        setTimeout(() => {
            ImagePicker.openCamera({
                width: 463,
                height: 463,
                cropping: true,
                includeBase64: true
            }).then((imageObj) => {
                const img = {
                    path: imageObj.path,
                    data: imageObj.data,
                    valid: true
                }
                formik.setFieldValue('img', img);
                this.setState({ photo: img });
            }).catch((error) => {
                console.log('onTakePhotoPress error')
            })
        }, 100)
    }

    async save(values) {
        var values = {
            name: values.name,
            img: values.img.data,
        }
        try {

            if (!values) {
                return;
            }

            const obj2 = {
                id_board: this.props.navigation ? this.props.navigation.getParam('board').id : null,
            };

            var values = { ...values, ...obj2 };

            var result = await helpers.registerRoom(values);

            if (result) {
                this.dropdown.alertWithType('success', 'Sucesso', "Salvo com sucesso");
            }

            setTimeout(async () => {
                // this.state.navigation.navigate('MyBoards');
                this.dropdown.close(); // close it

                this.state.navigation.navigate('RoomsSettings');

                return;
            }, 2000);

        } catch (error) {
            console.log(error);
            this.dropdown.alertWithType('error', 'Error', "Falha ao salvar");
        }

    };

}

RegisterRooms.navigationOptions = ({ navigation }) => ({
    title: 'Cadastrar Cómodos',
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

export default RegisterRooms;