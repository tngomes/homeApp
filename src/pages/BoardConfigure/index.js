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
import BoardEdit from '../BoardEdit';
import CustomModal from '../../components/CustomModal';

import { faEdit, faCalendarAlt, faClock, faDotCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { clickButton } from '../../actions';
import BoardTime from '../BoardTime';
import BoardPulsator from '../BoardPulsator';

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
});

const mapStateToProps = store => ({
    modalOpen: store.clickState.modalOpen
});
const columns = 3;


const mapDispatchToProps = dispatch =>
    bindActionCreators({ clickButton }, dispatch);


class BoardConfigure extends Component {


    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            visible: false,
            visible_modal: false,
            data: [
                { id: "edit", name: "Editar Dados", icon: faEdit },
                { id: "timer", name: "Temporizar", icon: faClock },
                { id: "timer_pulsator", name: "Tempo Pulso", icon: faDotCircle },
            ],
            inputChange: '',
            itens: []
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
    // closeModal() {
    //     console.log('IIIIIIIIIII');
    //     this.setState({ visible_modal: false })
    // }

    renderContent(id) {

        switch (id) {
            case 'edit':
                return (
                    <BoardEdit navigation={this.props.navigation}></BoardEdit>
                )
                break;

            case 'timer':
                return (
                    <BoardTime navigation={this.props.navigation}></BoardTime>
                )

            case 'timer_pulsator':
                return (
                    <BoardPulsator navigation={this.props.navigation}></BoardPulsator>
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
                                    this.setState({ visible: true, 'id': item.id, visible_modal: true });


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
                <CustomModal
                    concent={this.renderContent(this.state.id)}
                    visible_modal={this.state.visible_modal}
                    navigation={this.props.navigation}
                    styles={
                        {
                            modalContent: this.renderStyle(this.state.id)
                        }
                    }

                // styles={
                //     {
                //         modalContent: {
                //             backgroundColor: '#ffffff',
                //             height: 200,
                //             borderColor: '#ffffff',
                //             borderTopRightRadius: 20,
                //             borderTopLeftRadius: 20,
                //             width: '100%',
                //             alignItems: 'center',
                //         }
                //     }
                // }

                >

                </CustomModal>

            </View>

        );
    }

    renderStyle(id) {
        switch (id) {
            case 'timer':
                return (
                    {
                        backgroundColor: '#ffffff',
                        height: 200,
                        borderColor: '#ffffff',
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20,
                        width: '100%',
                        alignItems: 'center',
                    }
                )
                break;
            default:
                return (
                    {
                        backgroundColor: '#ffffff',
                        height: 500,
                        borderColor: '#ffffff',
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20,
                        width: '100%',
                    }
                )
        }

    }



    componentWillReceiveProps(nextProps) {
        this.setState({ visible_modal: nextProps.navigation.state.params.visible_modal })
    }
}

BoardConfigure.navigationOptions = {
    title: 'Configura????es de Placa',
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



export default connect(mapStateToProps, mapDispatchToProps)(BoardConfigure);
