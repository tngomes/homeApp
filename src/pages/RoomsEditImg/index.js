// import React from 'react';
//import { View, Button, Text } from 'react-native';
import React, { Component, Fragment } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Image, Text, Animated, Picker, View, Button, TextInput, StyleSheet, Switch, TouchableOpacity } from 'react-native';
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


const RoomsEditImg = class RoomsEditImg extends React.Component {

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
            board: props.navigation.getParam('board')

        };
    }
    validator() {
        var validator = yup.object().shape({
            room: yup
                .string()
                .required('Informar Cómodo!'),

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
                    initialValues={{ room: '', img: '' }}
                    onSubmit={(values) => {
                        this.save(values)
                    }}
                    validationSchema={this.validator()}
                >
                    {formik => (
                        <Fragment>
                            <View>

                                <Text style={styles.TextLabel}>Comódo</Text>
                                <Picker
                                    style={!formik.errors.room ? styles.TextDropdown : styles.TextDropdownInvalid}
                                    selectedValue={formik.values.room}
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

    async componentDidMount() {
        this.setState({
            rooms: await helpers.getArrayStorage('rooms')
        });
    }
    onTextChange() {

    }

    toggleSwitch(value) {
        this.setState({ 'isEnabled': value });
    }

    onGetImageResponse(res) {

    }


    PickerItemRoom() {
        if (this.state && this.state.rooms) {
            var info = [];
            for (const key in this.state.rooms) {
                const element = this.state.rooms[key];
                if (element.id_board == this.state.board.id) {
                    info.push(<Picker.Item key={key} label={element.name} value={element.id} />
                    );
                }
            }
            return (
                info
            );
        } else {
            return (
                <Picker.Item label={'-'} value={""} />
            );
        }
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
            img: values.img.data,
            room: values.room,
        }
        try {

            if (!values) {
                return;
            }


            console.log(values.room);
            let result = this.state.rooms;

            for (const key in result) {
                if (result[key].id == values.room) {
                    result[key].img = values.img;
                }
            };

            result = await helpers.storageArrayStorage('rooms', result);

            if (result) {
                this.dropdown.alertWithType('success', 'Sucesso', "Salvo com sucesso");
            }

            setTimeout(async () => {
                // this.state.navigation.navigate('MyBoards');
                this.dropdown.close(); // close it

                this.props.navigation.navigate(this.props.navigation.state.routeName, { visible_modal: false });

                return;
            }, 2000);

        } catch (error) {
            console.log(error);
            this.dropdown.alertWithType('error', 'Error', "Falha ao salvar");
        }

    };

}

RoomsEditImg.navigationOptions = ({ navigation }) => ({
    title: 'Editar Imagem',
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

export default RoomsEditImg;