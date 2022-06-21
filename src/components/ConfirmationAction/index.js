import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, View, TouchableOpacity } from 'react-native'
import helpers from "../../components/helpers";
import Icon from 'react-native-vector-icons/MaterialIcons';
import DropdownAlert from 'react-native-dropdownalert';
import { faUser, faFingerprint, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { styles } from "../../styles";

export default class ConfirmationAction extends Component {

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
                <View styles={{
                    width: '100%',
                    position: 'absolute',
                }}>

                </View>

                <View style={styles.container}>

                    <View styles={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Text>Sua Digital é a sua segurança</Text>
                        <View style={{
                            alignItems: 'center',
                            marginTop: 15,
                        }}>
                            <FontAwesomeIcon icon={faFingerprint} color="#02538b" size={60} />
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={
                                async () => {
                                    await this.save()
                                }
                            }
                        >
                            <Text style={{ color: '#ffff' }}>{this.state.text.txt_buttom}</Text>
                        </TouchableOpacity>
                    </View>
                </View >
            </View>

        );
    }

    async save() {
        var touch_id = await helpers.storageGetItem('touch_id');
        var touch_id = await parseInt(touch_id) ? 0 : 1;
        var save = await helpers.storageSetItem('touch_id', touch_id.toString());
        if (save) {
            this.props.navigation.navigate(this.props.navigation.state.routeName, {
                visible_modal: false,
                dropdownAlert: {
                    visible: true,
                    message: 'Salvo com sucesso',
                    alertType: 'success',
                    timout: 3000
                }
            });
            return;
        }
    }

    async touch() {

        var touch_id = await helpers.storageGetItem('touch_id');
        var touch_id = await parseInt(touch_id) ? 1 : 0;
        let text = {
            'txt_buttom': 'Ativar Digital',
        }

        if (touch_id) {
            text = {
                'txt_buttom': 'Desativar Digital',
            }
        }

        this.setState((state, props) => {
            return {
                text: text
            };
        });

    }

    async componentDidMount() {
        await this.touch();
    }
};