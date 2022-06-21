'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    StyleSheet,
    View,
    Text,
    Modal,
    Alert,
    TouchableOpacity,
    FlatList,
    Button,
    TextInput
} from 'react-native';
import RoomsEdit from '../RoomsEdit';
import RoomsEditImg from '../RoomsEditImg';
import CustomModal from '../../components/CustomModal';

import { faEdit, faCalendarAlt, faClock, faDesktop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { clickButton } from '../../actions';
import Timer from '../Timer';
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    item: {
        alignItems: "center",
        backgroundColor: "#02538b",
        flexGrow: 1,
        margin: 4,
        padding: 20,
        flexBasis: 0,
        borderRadius: 10,
    },

    itemOff: {
        alignItems: "center",
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
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#000000',
        opacity: 0.3
    },

    TextLabel: {
        flex: 0.3,
        fontWeight: 'bold',
        color: '#000000',
        fontSize: 15,
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: 120
    }
});

const mapStateToProps = store => ({
    modalOpen: store.clickState.modalOpen
});
const columns = 3;


const mapDispatchToProps = dispatch =>
    bindActionCreators({ clickButton }, dispatch);


class RoomsSettings extends Component {


    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            visible: false,
            data: [
                { id: "edit", name: "Editar Dados", icon: faEdit },
                { id: "rooms_edit_img", name: "Alterar Imagem", icon: faCalendarAlt },
            ],
            inputChange: '',
            itens: [],
            visible_modal: null
        };
        console.log(props.navigation.getParam('board'));
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
    closeModal() {
        console.log('IIIIIIIIIII');
        this.setState({ visible: false })
    }

    renderContent(id) {

        switch (id) {
            case 'edit':
                return (
                    <RoomsEdit navigation={this.props.navigation}></RoomsEdit>
                )
                break;
            case 'monitoring':
                // código 2
                break;

            case 'rooms_edit_img':
                return (
                    <RoomsEditImg navigation={this.props.navigation}></RoomsEditImg>
                )

                break;

            case 'timer':
                return (
                    <Timer navigation={this.props.navigation}></Timer>
                )
                break;
        }
    }

    componentDidMount() {
        this.setState({ 'itens': this.createRows(this.state.data, columns) });
    }


    render() {
        return (

            <View
                style={{
                    justifyContent: 'center',
                    flex: 1,
                }}>

                <TextInput
                    onChangeText={(eeee) => {
                        this.setState({ 'inputValue': eeee });
                    }}
                    value={this.state.inputValue}
                />

                <FlatList
                    data={this.state.itens}
                    numColumns={columns}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={{ flex: 1 }} key={item.id}
                                onPress={() => {
                                    this.setState({ visible_modal: true, 'id': item.id });
                                }} >
                                <View style={!item.empty ? styles.item : styles.itemOff}>

                                    {!item.empty ?

                                        <FontAwesomeIcon icon={item.icon} color="#ffffff" size={40} />
                                        :
                                        <View />
                                    }
                                    <Text style={styles.text}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>

                        );
                    }}
                />
                <CustomModal concent={this.renderContent(this.state.id)} visible_modal={this.state.visible_modal} navigation={this.props.navigation}>

                </CustomModal>

            </View>

        );
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ visible_modal: nextProps.navigation.state.params.visible_modal })
    }
}

RoomsSettings.navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('board').room_name,

    headerRight: (
        <View style={styles.iconContainer}>
            <TouchableOpacity activeOpacity={0.7}
                onPress={() => {
                    navigation.navigate('RegisterRooms', { 'board': navigation.getParam('board') });
                }}>
                <FontAwesomeIcon icon={faPlus} color="#ffff" size={30} />
            </TouchableOpacity>
        </View>
    ),
})



export default connect(mapStateToProps, mapDispatchToProps)(RoomsSettings);
