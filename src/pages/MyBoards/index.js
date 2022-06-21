import { View, Button, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import React, { Component } from 'react';
import {
    colorButtomRed,
} from "./styles";
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart, faLightbulb, faChevronRight, faPlus, faHome, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { RegisterBoard } from "../BoardRegister"
import { createAppContainer, createStackNavigator } from 'react-navigation';
import helpers from "../../components/helpers";
import ActionSheet from 'react-native-actionsheet'

const styles = StyleSheet.create({
    button_active: {
        alignItems: 'center',
        backgroundColor: '#28a745',
        padding: 10,
        borderWidth: 1,
        borderRadius: 30,
    },

    deactivate: {
        alignItems: 'center',
        backgroundColor: '#f44336',
        padding: 10,
        borderWidth: 1,
        borderRadius: 30,
    },

    boxStyle: {
        height: 90,
        width: 340,
        backgroundColor: '#02538b',
        marginTop: 20,
        borderRadius: 15
    },

    container: {
        flex: 1
    },
    icon: {
        paddingLeft: 10
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: 120
    }
});
let myTimer = false;

const MyBoards = class MyBoards extends React.Component {


    constructor(props) {
        super(props);


        this.state = {

            categories: props.categories,
            navigation: props.navigation,
            boards: {},
            switchValue: false,
            actionSelected: "",
            options: []
        };
    }

    renderboards() {

        return (

            <View

                style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    marginBottom: 10,
                }}>

                {this.renderSwitch()}

                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Ações'}
                    options={this.state.options}
                    cancelButtonIndex={4}
                    destructiveButtonIndex={3}
                    onPress={(index) => {
                        this.switchAction(index);
                    }}

                />

            </View>
        );
    }

    async actionShow(id, key) {

        var boards = await helpers.getArrayStorage('boards');

        boards.map((item, i) => {
            if (item.id == id) {
                this.state.navigation.navigate('Mychannels', { 'board': item });
            }
        });
    }

    async  actionSheetShow(id, key) {
        this.setState({ actionSelected: id });
        var fontSize = 20;
        var board = await helpers.infoBoardId(id);

        var myOptions = [
            'Configurações de Canal',
            'Configurações de Placa',
            'Configurações de ' + board.room_name,
            'Deletar',
            'Cancelar',
        ];


        // var main = parseInt(await helpers.storageGetItem('id_board_main'));

        // if (main == id) {
        //     myOptions = [
        //         'Configurações de Canal',
        //         'Configurações de Placa',
        //         'Configurações de Categoria',
        //         <Text style={{ opacity: 0.2 }} > Deletar</Text>,
        //         'Cancelar',
        //     ];
        // }


        this.setState({ options: myOptions });

        this.ActionSheet.show();
    }

    async  deleteBoard(key) {

        var boards = await helpers.getArrayStorage('boards');

        var boards = await helpers.removeItemArrayStorage('boards', key);

        if (boards.length) {
            await helpers.storageSetItem('id_board_main', boards[0].id.toString());
        }

        this.setIcons(boards);
    }


    async  infoBoarKey(id) {
        var boards = await helpers.getArrayStorage('boards');
        var info = null;
        for (let index = 0; index < boards.length; index++) {
            if (boards[index].id == id) {
                info = index;
            }
        }
        // boards.map((item, i) => {
        //     if (item.id == id) {
        //         info = i;
        //     }
        // });
        return info;
    }

    async  confirmDeleteBoard(board) {
        var key = await this.infoBoarKey(board.id);

        Alert.alert(
            'Deletar',
            'Tem certeza que deseja deletar a placa ' + board.name + ' ?',
            [
                { text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Confirmar', onPress: () => this.deleteBoard(key) },
            ],
            { cancelable: false }
        )
    }
    makeMain(id) {
        helpers.storageSetItem('id_board_main', id.toString());
    }


    format() {
        const options = [
            'Cancel',
            'Apple',
            <Text style={{ color: 'yellow' }}>Banana</Text>,
            'Watermelon',
            <Text style={{ color: 'red' }}>Durian</Text>
        ]
    }
    confirmMakeMain(board) {
        Alert.alert(
            'Tornar Principal',
            'Tem certeza que deseja tornar principal a placa ' + board.name + ' ?',
            [
                { text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Confirmar', onPress: () => this.makeMain(board.id) },
            ],
            { cancelable: false }
        )
    }
    async  switchAction(ActionSheetindex) {

        // var main = parseInt(await helpers.storageGetItem('id_board_main'));
        var board = await helpers.infoBoardId(this.state.actionSelected);

        switch (ActionSheetindex) {
            // case 0:
            //     if (main == this.state.actionSelected) {
            //         this.ActionSheet.show();
            //         return;
            //     }
            //     this.confirmMakeMain(board);
            //     break;
            case 0:

                this.state.navigation.navigate('ChannelConfigure', { 'board': board });

                break;
            case 1:

                this.state.navigation.navigate('BoardConfigure', { 'board': board });

                break;

            case 2:

                this.state.navigation.navigate('RoomsSettings', { 'board': board });

                break;

            case 3:
                // if (main == this.state.actionSelected) {
                //     this.ActionSheet.show();
                //     return;
                // }
                await this.confirmDeleteBoard(board);
                break;
        }
    }
    renderSwitch() {
        if (this.state.boards.length) {
            return this.state.boards.map((item, i) => {
                return (
                    <TouchableOpacity
                        onLongPress={() => { this.actionSheetShow(item.id, i) }}
                        onPress={() => { this.actionShow(item.id, i) }}
                        key={i}>
                        <View style={styles.boxStyle} key={i} >

                            <View style={{ marginLeft: 20 }}>
                                {item.icon ? (
                                    <FontAwesomeIcon style={{ marginLeft: 35, marginTop: 20 }} icon={item.icon} color="#ffff" size={35} />
                                ) : null}


                                <Text style={{ color: '#fafafa', marginLeft: 30, marginTop: 10 }}>
                                    {item.name ? item.name : ''}
                                </Text>

                                <FontAwesomeIcon style={{ marginTop: -45, marginLeft: 250 }} icon={faChevronRight} color="#ffff" size={20} />
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            });
        }
    }

    onPressButtom(channel, value) {
        console.log(channel, value);
    }


    async GetStatus() {
        return await helpers.getArrayStorage('boards');
    }

    setIcons(boards) {
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

        this.setState({ boards: boards })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params.boards) {
            let boards = nextProps.navigation.state.params.boards;
            this.setIcons(boards);
        }
    }



    async  validStatus(status, error) {
        let response = {
            success: false,
            status: status,
            message: "tratamento de erro"
        }
        return response;
    }

    isNumber(str) {
        return !isNaN(parseFloat(str))
    }

    showButtom(board, key) {
        let data = {};
        data = {
            text: "Ativar",
            background_color: styles.button_active,
            board: board,
            key: key
        }
        return data;
    }

    render() {
        return (<View>
            <ScrollView style={styles.scrollView}>
                {
                    this.renderboards()
                }
            </ScrollView>
        </View>);
    }

    async componentDidMount() {
        //    await helpers.clearAllStorage();
        var boards = await helpers.getArrayStorage('boards');

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

        if (boards) {
            this.setState({ boards: boards });
        }

    }
}
MyBoards.navigationOptions = ({ navigation }) => ({
    title: 'Placas',

    headerRight: (
        <View style={styles.iconContainer}>
            <TouchableOpacity activeOpacity={0.7}
                onPress={() => {
                    navigation.navigate('BoardRegister');
                }}>
                <FontAwesomeIcon icon={faPlus} color="#ffff" size={30} />
            </TouchableOpacity>
        </View>
    ),
})

export default MyBoards;