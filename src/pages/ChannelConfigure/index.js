'use strict';

import React, { Component } from 'react';

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
import ChannelEdit from '../ChannelEdit';
import Scheduling from '../Scheduling';
import CustomModal from '../../components/CustomModal';
import { faEdit, faPlug, faCalendarAlt, faClock, faDesktop, faDotCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Timer from '../Timer';
import Pulsator from '../ChannelPulsator';
import ChannelInput from '../ChannelInput';

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

const columns = 3;



class ChannelConfigure extends Component {


	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			visible_modal: null,
			data: [
				{ id: "edit", name: "Editar Dados", icon: faEdit },
				{ id: "monitoring", name: "Monitorar", icon: faDesktop },
				{ id: "scheduling", name: "Agendar", icon: faCalendarAlt },
				{ id: "timer", name: "Temporizar", icon: faClock },
				{ id: "pulsate", name: "Pulsador", icon: faDotCircle },
				{ id: "plug", name: "Entrada", icon: faPlug },
			],
			inputChange: '',
			itens: []
		};
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

	renderContent(id) {

		switch (id) {
			case 'edit':
				return (
					<ChannelEdit navigation={this.props.navigation}></ChannelEdit>
				)
				break;
			case 'monitoring':
				// código 2
				break;

			case 'scheduling':
				return (
					<Scheduling navigation={this.props.navigation}></Scheduling>
				)

				break;

			case 'timer':
				return (
					<Timer navigation={this.props.navigation}></Timer>
				)

			case 'pulsate':
				return (
					<Pulsator navigation={this.props.navigation}></Pulsator>
				)

			case 'plug':
				return (
					<ChannelInput navigation={this.props.navigation}></ChannelInput>
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
				<CustomModal
					navigation={this.props.navigation}
					visible_modal={this.state.visible_modal}
					concent={this.renderContent(this.state.id)}
					styles={
						{
							modalContent: {
								backgroundColor: '#ffffff',
                                height: 550,
                                borderColor: '#ffffff',
                                borderTopRightRadius: 20,
                                borderTopLeftRadius: 20,
                                width: '100%',
							}
						}

					}
				>

				</CustomModal>

			</View>

		);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ visible_modal: nextProps.navigation.state.params.visible_modal })
	}
}

ChannelConfigure.navigationOptions = {
	title: 'Configurações de Canal',
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



export default ChannelConfigure;
