
import { ScrollView, TouchableOpacity, Keyboard, Animated, View, Button, Text, StyleSheet, Switch, TextInput, Picker } from 'react-native';
import React, { Component, Fragment, } from 'react';
import helpers from "../../components/helpers";
import { Formik } from 'formik';
import * as yup from 'yup';
import DropdownAlert from 'react-native-dropdownalert';
import { Dropdown } from 'react-native-material-dropdown';
import { styles } from "../../styles";
import { clickButton, clickKeyboard } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


const mapStateToProps = store => ({
    modalOpen: store.clickState.modalOpen,
    keyboardOpen: store.keyBoardState.keyboardOpen
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ clickButton, clickKeyboard }, dispatch);

const ChannelInput = class ChannelInput extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            navigation: props.navigation,
            route_list: 'L',
            board: props.navigation ? props.navigation.getParam('board') : null,
            listConfigure: [
                { id: 1, name: "Simples" },
                { id: 2, name: "Pulsador" },
                { id: 3, name: "Sem entrada" },
            ],
        };
    }


    async getCategory() {

    }

    async onChange(value, state) {

    }

    render() {
        return (

            <View style={styles.container}>
                <DropdownAlert updateStatusBar={false} ref={ref => this.dropdown = ref} />
                <Formik
                    initialValues={{ board: this.state.board ? this.state.board.id : '', plug: '', channel: '' }}
                    onSubmit={async (values, { setSubmitting, setValues }) => {
                        await this.save(values);
                        // console.log(values);
                        setTimeout(() => {
                            var payload = { ...values, channel: values.channel } // Construct the new payload
                            setValues(payload) // Updates Formik's internal state
                        }, 1000);
                    }}

                    validationSchema={yup.object().shape({

                        board: yup
                            .string()
                            .required('Selecione a Placa!'),

                        channel: yup
                            .string()
                            .required('Selecione o canal!'),

                        plug: yup
                            .string()
                            .required('Selecione a Entrada!'),

                    })}

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
                                        console.log(itemValue, key);
                                        await this.getChannelsBoard(itemValue);
                                        formik.setFieldValue('board', itemValue);
                                    }}
                                    value={formik.values.board}
                                >
                                    <Picker.Item label="Selecione" value="" />
                                    {this.PickerItemBoards()}
                                </Picker>
                                {formik.touched.board && formik.errors.board &&
                                    <Text style={styles.TextError}>{formik.errors.board}</Text>
                                }

                            </View>

                            <View>

                                <Text style={styles.TextLabel}>Canal</Text>
                                <Picker
                                    style={!formik.errors.channel ? styles.TextDropdown : styles.TextDropdownInvalid}
                                    // passing value directly from formik
                                    selectedValue={formik.values.channel}
                                    // changing value in formik
                                    onValueChange={async (itemValue, key) => {
                                        formik.setFieldValue('channel', itemValue);
                                    }}

                                    value={formik.values.channel}

                                >
                                    <Picker.Item label="Selecione" value="" />
                                    {this.PickerItemChannel()}
                                </Picker>
                                {formik.touched.channel && formik.errors.channel &&
                                    <Text style={styles.TextError}>{formik.errors.channel}</Text>
                                }
                            </View>

                            <View>

                                <Text style={styles.TextLabel}>Interruptor de Entrada</Text>
                                <Picker
                                    style={!formik.errors.plug ? styles.TextDropdown : styles.TextDropdownInvalid}
                                    // passing value directly from formik
                                    selectedValue={formik.values.plug}
                                    // changing value in formik
                                    onValueChange={async (itemValue, key) => {
                                        formik.setFieldValue('plug', itemValue);
                                    }}

                                    value={formik.values.plug}

                                >
                                    <Picker.Item label="Selecione" value="" />
                                    {this.PickerItemRoom()}
                                </Picker>
                                {formik.touched.plug && formik.errors.plug &&
                                    <Text style={styles.TextError}>{formik.errors.plug}</Text>
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

            var channels = [];
            Object.keys(response).map(async (item, key) => {
                if (item.match(/Nm/)) {

                    var teste = {
                        "name": item,
                        "value": response[item],
                    };

                    channels.push(teste);
                }
            });

            this.setState({ channels: channels });

        }

    }

    PickerItemRoom() {
        if (this.state && this.state.listConfigure) {
            itens = [];

            for (let index = 0; index < this.state.listConfigure.length; index++) {
                itens.push(
                    <Picker.Item key={index} label={this.state.listConfigure[index].name} value={this.state.listConfigure[index].id} />
                )
            }

            return itens;

        } else {
            return (
                <Picker.Item label={'-'} value={""} />
            );
        }
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

    async save(values) {
        var board = [];
        this.state.boards.map((item, key) => {
            if (item.id == values.board) {
                board = item;
            }
        });

        var ip = board.ip;
        var door_new = board.door_new;
        var rules = '';

        switch (values.plug) {
            case 1:
                rules = 'Int';
                break;

            case 2:
                rules = 'Pul';
                break;

            case 3:
                rules = 'Thr';
                break;
        }

        var url = 'http://' + ip + ':' + door_new + '/L/?' + rules + values.channel.replace(/[^\d]+/g, '');
        console.log(url);
        var response = await helpers.get(url);

        if (!response.success) {
            console.log(response.message);
        }

        // this.setState({ channels: arrayChanels });

        this.dropdown.alertWithType('success', 'Sucesso', "Salvo com sucesso");

    }

    async componentDidMount() {
        // console.log(await helpers.getArrayStorage('rooms'));
        this.setState({
            boards: await helpers.getArrayStorage('boards'),
        });

        if (this.state.board) {
            await this.getChannelsBoard(this.state.board.id);
        }

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            this._keyboardDidShow();
        });

        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            this._keyboardDidHide();
        });
    }


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

ChannelInput.navigationOptions = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ChannelInput);
