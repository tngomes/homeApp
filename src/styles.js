//import styled from 'styled-components/native';
import {
	StyleSheet,
} from 'react-native';

export const styles = StyleSheet.create({
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
	overlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: '#000000',
		opacity: 3,
		flex: 1
	},

	modalContent: {
		backgroundColor: '#ffffff',
		height: 550,
		borderColor: '#ffffff',
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		width: '100%',
	},

	modalContentFlex: {
		backgroundColor: '#ffffff',
		flex: 1,
		borderColor: '#ffffff',
		width: '100%',
		alignItems: 'center',
	},

	container: {
		marginTop: 30,
		margin: 10,
	},

	containerView: {
		flex: 0.7,
		backgroundColor: '#ffffff',
		borderWidth: 15,
		borderColor: 'transparent'
	},


	TextLabel: {
		fontWeight: 'bold',
		color: '#000000',
		fontSize: 15,
	},

	TextLabelError: {
		fontWeight: 'bold',
		color: '#000000',
		fontSize: 15,
	},

	TextInput: {
		borderRadius: 5,
		height: 40,
		width: "100%",
		borderColor: '#d3d3d3',
		borderWidth: 1,
	},

	TextInvalid: {
		borderRadius: 5,
		height: 40,
		width: "100%",
		borderColor: 'red',
		borderWidth: 1,
	},

	TextDropdown: {
		borderColor: '#d3d3d3',
		// backgroundColor : '#fa7f72', //remover salmao
	},

	Switch: {
	},

	TextDropdownInvalid: {
		// backgroundColor : '#008000',  //remover verde
		borderColor: 'red',
		height: 40,
		width: "100%"
	},

	TextInputDatePicker: {
		borderRadius: 5,
		borderColor: '#d3d3d3',
		height: 40,
		width: "100%"
	},

	TextError: {
		fontSize: 15,
		color: 'red',
	},

	button: {
		alignItems: 'center',
		backgroundColor: '#02538b',
		padding: 10,
		marginBottom: 20,
		borderRadius: 5,
	},

	buttonInactivate: {
		alignItems: 'center',
		backgroundColor: 'red',
		padding: 10,
		marginBottom: 20,
		borderRadius: 5,
	},

	img: {
		flex: 1,
		borderRadius: 10,
		height: '100%',
		width: '100%',
		resizeMode: 'stretch'
	},

	TextInputDisabled: {
		borderRadius: 5,
		height: 40,
		width: "100%",
		borderColor: '#d3d3d3',
		borderWidth: 1,
		marginBottom: 20,
		backgroundColor: '#d3d3d3'
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

});