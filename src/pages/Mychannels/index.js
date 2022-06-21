import { View, Button, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import React, { Component } from 'react';
import {
    colorButtomRed,
} from "./styles";
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart, faLightbulb, faEye, faChevronRight, faPlus, faSync } from "@fortawesome/free-solid-svg-icons";
import ActionSheet from 'react-native-actionsheet'
import helpers from "../../components/helpers";
import DropdownAlert from 'react-native-dropdownalert';
import { MenuProvider } from 'react-native-popup-menu';
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

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
        width: 150,
        backgroundColor: '#02538b',
        marginTop: 20,
        borderRadius: 15
    },

    boxStyleButtom: {
        height: 150,
        width: 150,
        borderRadius: 150,
        backgroundColor: '#02538b',
        marginTop: 20,
    },

    boxStyleButtomOff: {
        height: 150,
        width: 150,
        borderRadius: 150,
        backgroundColor: 'red',
        marginTop: 20,
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: 120
    }

});
let myTimer = false;
let _this = null;
last_schedule = [];

var MyChannels = class MyChannels extends Component {

    constructor(props) {
        super(props);
        // console.log(props.navigation.params);
        this.state = {
            navigation: props.navigation,
            // route_list: 'boards/teste-statico',
            route_list: 'L',
            actionSelected: "",
            options: [],
            skeleton: true,
            board_current: this.props.navigation.getParam('board'),
            id_category: this.props.navigation.getParam('id_category'),
        };
    }

    renderChannels() {

        let item = { 'text': 'xxx' };
        let i = 0;

        return (

            <View
                key={i}
                style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    marginBottom: 10,
                }}>
                {this.state.skeleton ? (
                    this.SkeletonView()
                ) : (
                        this.renderSwitch()
                    )
                }

            </View>
        );
    }

    SkeletonView() {
        if (this.state.skeleton) {
            teste = [];
            for (let index = 0; index < 10; index++) {
                teste[index] = (
                    <SkeletonPlaceholder key={index}>
                        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                            <SkeletonPlaceholder.Item
                                height={90}
                                width={150}
                                marginTop={20}
                                borderRadius={15}
                            />

                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                )
            }
            return teste;

        }
    }
    renderSwitch() {

        if (this.state && this.state.channels) {

            return this.state.channels.map((item, i) => {

                return (
                    <View key={i}>

                        <View style={styles.boxStyle} key={i} >

                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <View style={{ marginLeft: 10 }}>
                                    <View>
                                        <FontAwesomeIcon style={{ marginTop: 10, marginLeft: 10 }} icon={faLightbulb} color="#5ce6d1" size={20} />
                                        <Text style={{ color: '#fafafa', marginLeft: 35, marginTop: -20 }}>
                                            {item.name ? item.name : "Canal" + i + 1} :  {parseInt(item.value) ? 'ON' : 'OFF'}
                                        </Text>
                                    </View>

                                </View>

                                <View style={{ width: 50, flex: 1, justifyContent: 'flex-end' }} >

                                    {/* <FontAwesomeIcon icon={faHeart} color="#d14e4f" size={20} style={{ marginBottom: -22, marginLeft: 22 }} /> */}
                                    <Switch
                                        trackColor={{ true: '#38ef7d', false: '#0a3950' }} // fundo
                                        thumbColor={{ true: '#38ef7d', false: '#a0a0a0' }} //ataque 
                                        style={{
                                            marginRight: -90
                                        }}
                                        value={parseInt(item.value) ? true : false}
                                        onValueChange={(value) => {
                                            this.toggleSwitch(item.channel, value)
                                        }}
                                    />
                                </View>

                            </View>

                        </View>
                    </View>

                );

            });
        }
    }

    loadRequest() {
        this.setState({ skeleton: true });
        this.statusButtom();
    }

    componentDidMount() {
        this.loadRequest();
        // this.setState({'board_current' : this.props.navigation.getParam('board')});
        // this.props.navigation.setParams({ onPressSyncButton: this.actionSheetShow() });
        _this = this;

        //  myTimer =  setInterval(async () => {
        //   this.statusButtom();
        // }, 2000);
    }

    onPressButtom(channel, value) {
        console.log(channel, value);
    }

    async  switchAction(ActionSheetindex) {


        var boards = await helpers.getArrayStorage('boards');
        console.log(boards);
        boards.map(async (item, i) => {
            // console.log(ActionSheetindex);
            if (ActionSheetindex == i) {
                console.log('oi');
                this.setState({ board_current: item, skeleton: true });
            }
        });


        this.statusButtom();

    }

    render() {
        // console.log('qqds');
        return (
            <View>
                <DropdownAlert updateStatusBar={false} ref={ref => this.dropdown = ref} />


                <ScrollView style={styles.scrollView}>
                    {
                        this.renderChannels()
                    }
                </ScrollView>

                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Selecione a Placa'}
                    options={this.state.options}
                    destructiveButtonIndex={this.state.cancelIndex}
                    cancelButtonIndex={this.state.cancelIndex}
                    onPress={(index) => {
                        this.switchAction(index);
                    }}

                />

            </View>
        )
    }

    // componentWillUnmount() {
    //     clearInterval(myTimer);
    // }

    async fillInValues(response) {
        let initialArr = [];
        // if (response.success) {
        let list = Object.keys(response);
        console.log(last_schedule);
        console.log(last_schedule.length);
        if (!Object.keys(last_schedule).length) {
            console.log('ENTROU');
            last_schedule = response
        }

        for (const lt in list) {
            if (this.isNumber(list[lt])) {
                var key = parseInt(lt);
                var numberSum = parseInt(key) + 1;
                var options = {
                    'channel': list[key],
                    'value': response[numberSum],
                    'name': response['Nm_' + (numberSum)],
                };
                let buttonMounted = this.showButtom(options);

                var valid = parseInt(last_schedule['AG' + (numberSum)]);

                if (!valid) {

                    if (this.state.id_category) {
                        let rooms_devices = await helpers.getArrayStorage('rooms_devices');
                        for (const zord in rooms_devices) {
                            if (rooms_devices[zord].id_room == this.state.id_category) {
                                if (rooms_devices[zord].channel == numberSum) {
                                    initialArr.push(buttonMounted);
                                }
                            }
                        }
                    } else { //listar todos os canais
                        initialArr.push(buttonMounted);
                    }

                }
            }
        };



        this.setState({
            channels: initialArr,
            skeleton: false
        });
        // }

        return await initialArr;
    }

    async statusButtom() {
        let response = await this.GetStatus();
        console.log(response);
        if (!response.success) {
            console.log(response.message);
            this.dropdown.alertWithType('error', 'Erro', response.message);
            return;
        }
        let fillInValues = await this.fillInValues(response);
        return fillInValues;
    }

    async toggleSwitch(key, value) {
        console.log(key);
        var params = key.replace(/[^\d]+/g, '')
        console.log(params);

        if (params > 9) {
            params = "n" + params.toString().substr(1, 1)
        }

        if (params > 19) {
            params = "m" + params.toString().substr(0, 1)
        }

        if (params > 29) {
            params = "o" + params.toString().substr(0, 1)
        }

        if (params > 39) {
            params = "p" + params.toString().substr(0, 1)
        }


        var response = await this.ModfStatusChannel(params.toString());

        await this.fillInValues(response);
    }
    async ModfStatusChannel(params) {
        const url = "http://" + this.state.board_current.ip + ":" + this.state.board_current.door_new + "/" + this.state.route_list + "/?" + params;
        console.log(url);
        var response = await helpers.get(url);
        return response;
    }

    async GetStatus() {
        var ip = this.state.board_current.ip;
        var door = this.state.board_current.door_new;
        if (door) {
            door = ":" + door;
        } else {
            door = "80";
        }


        var url = "http://" + ip + door + "/" + this.state.route_list + "/";
        console.log(url);
        var response = await helpers.get(url);
        console.log(response);
        return response;
    }


    async validStatus(status, error) {
        let response = {
            success: false,
            status: status,
            message: "tratamento de erro",
            error: error
        }
        return response;
    }

    isNumber(str) {
        return !isNaN(parseFloat(str))
    }

    showButtom(options) {
        let data = {};
        switch (parseInt(options.value)) {
            case 0:

                data = {
                    text: "Ativar",
                    background_color: styles.button_active,
                    channel: options.channel,
                    value: options.value,
                    name: options.name,
                    display: options.display
                }
                break;

            case 1:

                data = {
                    text: "Desativar",
                    background_color: styles.deactivate,
                    channel: options.channel,
                    value: options.value,
                    name: options.name,
                    display: options.display,
                }

                break;
        }
        return data;
    }


    async  actionSheetShow() {
        // this.setState({ actionSelected: id });
        var fontSize = 20;
        var myOptions = [];
        var boards = await helpers.getArrayStorage('boards');
        console.log(boards);
        boards.map(async (item, i) => {
            myOptions.push(item.name);
        });

        myOptions.push('Cancelar');

        this.setState({ cancelIndex: myOptions.length - 1 })
        this.setState({ options: myOptions });

        this.ActionSheet.show();
    }

    async otherBoard() {

        var boards = await helpers.getArrayStorage('boards');

        boards.map(async (item, i) => {

            if (item.id != this.state.board_current.id) {
                this.setState({ board_current: item, skeleton: true });
                this.statusButtom();
            }
        });

    }
}

MyChannels.navigationOptions = ({ navigation }) => ({
    title: 'Canais',

    headerRight: (
        <View style={styles.iconContainer}>

            <TouchableOpacity activeOpacity={0.7}

                onPress={async () => {

                    let boards = await helpers.getArrayStorage('boards');

                    switch (boards.length) {
                        case 1:
                            _this.loadRequest();
                            break;

                        case 2:
                            await _this.otherBoard();
                            break;
                        default:
                            await _this.actionSheetShow();
                    }
                }}>
                <FontAwesomeIcon icon={faSync} color="#ffff" size={30} />
            </TouchableOpacity>


            {/* <MenuProvider>
                <Menu
                    style={{
                        flexDirection: 'row-reverse',
                    }}
                    onSelect={(value) => this.OptionMenu(value)}>
                    <MenuTrigger triggerTouchable={{ activeOpacity: 1, }}>
                        <FontAwesomeIcon style={{ marginRight: 20 }} icon={faEllipsisV} color="#ffff" size={20} />
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{ width: 150 }}>
                        <MenuOption value={1}>
                            <Text style={{ fontWeight: 'bold', color: '#000000', fontSize: 15 }}>Pulsar Manual</Text>
                        </MenuOption>

                        <MenuOption value={2}>
                            <Text style={{ fontWeight: 'bold', color: '#000000', fontSize: 15 }}>Acionamento Configurado</Text>
                        </MenuOption>

                    </MenuOptions>
                </Menu>
            </MenuProvider> */}


        </View>
    ),
})


export default MyChannels; 