import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, View, TouchableOpacity } from 'react-native'
import helpers from "../../components/helpers";
import Icon from 'react-native-vector-icons/MaterialIcons';
import DropdownAlert from 'react-native-dropdownalert';
import { faUser, faFingerprint, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { styles } from "../../styles";
import { Formik } from 'formik';
import * as yup from 'yup';

export default class AccountEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            navigation: props.navigation,
            text: {
                txt_buttom: '',
            }
        };
    }

    render() {
        return (
            <View>

                <View style={styles.container}>


                    <View style={styles.container}>
                        <DropdownAlert updateStatusBar={false} ref={ref => this.dropdown = ref} />
                        <Formik
                            initialValues={{
                                name: ''
                            }}
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
                </View>
            </View>

        );
    }

    async save(values) {


        var user = JSON.parse(await helpers.storageGetItem('user'));
        user['name'] = values.name;
        var save = await helpers.storageSetItem('user', JSON.stringify(user))

        if (save) {
            console.log(this.props.navigation.state.routeName);
            this.props.navigation.navigate(this.props.navigation.state.routeName, {
                visible_modal: false,
                dropdownAlert: {
                    visible: true,
                    message: 'Salvo com sucesso',
                    alertType: 'success',
                    timout: 3000
                },
                user: JSON.parse(await helpers.storageGetItem('user'))
            });
            return;
        } else {
            this.props.navigation.navigate(this.props.navigation.state.routeName, {
                visible_modal: false,
                dropdownAlert: {
                    visible: true,
                    message: 'Falha ao Salvar',
                    alertType: 'error',
                    timout: 3000
                },
                // user: JSON.parse(await helpers.storageGetItem('user'))

            });
            return;
        }
    }



    async componentDidMount() {
    }
};