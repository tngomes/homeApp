
import {
    ScrollView, FlatList,
    TouchableOpacity, Keyboard, View, Button, Text, StyleSheet, Switch, TextInput, Picker
} from 'react-native';
import React, { Component, Fragment, } from 'react';
import helpers from "../../components/helpers";
import { Formik } from 'formik';
import * as yup from 'yup';
import DropdownAlert from 'react-native-dropdownalert';
import { Dropdown } from 'react-native-material-dropdown';
import { clickButton, clickKeyboard } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { faHome, faEdit, faBuilding, faCalendarAlt, faClock, faDesktop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
//  
const columns = 3;
const mapStateToProps = store => ({
    modalOpen: store.clickState.modalOpen,
    keyboardOpen: store.keyBoardState.keyboardOpen
});
const annotation = StyleSheet.create({

    item: {
        backgroundColor: "#02538b",
        flexGrow: 1,
        margin: 4,
        padding: 20,
        flexBasis: 0,
        borderRadius: 10,
    },

    itemOff: {
        flexGrow: 1,
        margin: 4,
        padding: 20,
        flexBasis: 0,
    },

    text: {
        color: "#ffff",
        textAlign: 'center',
        alignSelf: 'stretch'
    },


});
const mapDispatchToProps = dispatch =>
    bindActionCreators({ clickButton, clickKeyboard }, dispatch);

const Houses = class Houses extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            navigation: props.navigation,
            route_list: 'L',
            channel_name: '',
            board: props.navigation ? props.navigation.getParam('board') : null,
        };
    }

    render() {
        console.log(this.state.itens);
        console.log(annotation);
        return (
            <FlatList
                data={this.state.itens}
                numColumns={columns}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity key={item.id}
                            onPress={async () => {
                                await this.closeModal(item.id);
                            }} >
                            <View style={!item.empty ? annotation.item : annotation.itemOff}>

                                {!item.empty ?

                                    <FontAwesomeIcon icon={item.icon} color="#ffff" size={40} />
                                    :
                                    <View />
                                }
                                <Text style={annotation.text}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>

                    );
                }}
            />
        )
    }


    async componentDidMount() {
        let boards = await helpers.getArrayStorage('boards');
        console.log(boards);

        for (const key in boards) {
            switch (boards[key]['category']) {
                case 1:
                    boards[key]['icon'] = faHome;
                    break;
                case 2:
                    boards[key]['icon'] = faBuilding;
                    break;
                default:
                    boards[key]['icon'] = faBuilding;
            }
        }

        this.setState({
            boards: await helpers.getArrayStorage('boards'),
            rooms: await helpers.getArrayStorage('rooms'),
            itens: this.createRows(boards, columns)
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


    createRows(data, columns) {
        const rows = Math.floor(data.length / columns); // [A]
        let lastRowElements = data.length - rows * columns; // [B]
        for (var i = 0; lastRowElements <= columns; i++) { // [C]
            data.push({ // [D]
                id: `empty-${lastRowElements}`,
                name: '',
                empty: true
            });
            lastRowElements += 1; // [E]
        }
        return data; // [F]
    }

    async closeModal(id) {
        this.setState({ 'id': id });
        await helpers.storageSetItem('id_board_main', id.toString());
        let board = await helpers.infoBoardId(id.toString());

        this.props.navigation.navigate(this.props.navigation.state.routeName, { visible_modal: false, board });
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
}

Houses.navigationOptions = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Houses);
