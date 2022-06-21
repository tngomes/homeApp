import React, { Component } from 'react';
import { styles } from "../../styles";
import {
	Dimensions,
	StyleSheet,
	View,
	Text,
	Modal,
	Alert,
	TouchableOpacity,
	FlatList,
	Button,
	KeyboardAvoidingView,
	Keyboard,
	BackHandler,
	TextInput,
	StatusBar,
} from 'react-native';
// import Modal from 'react-native-modal';
import DropdownAlert from 'react-native-dropdownalert';
let { height, width } = Dimensions.get('window');
const annotation = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#02538b',
	},
	mContainer: {
		position: 'absolute',
		height: 105,
		width: width,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'transparent',
	},

});

class CustomModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			concent: props.concent,
			concent: props.concent,
			visible_modal: null,
			navigation: props.navigation,
			styles: props.styles,
			dropdownAlert: {
				visible: false,
				alertType: '',
				message: '',
			},
		};
	}

	render() {
		return (
			<Modal
				onRequestClose={() => {
					this.closeModal();
				}}
				transparent={true}
				animationType="slide"
				visible={this.state.visible_modal}
				style={{
					borderTopLeftRadius: 10, 11: 10, flex: 1,
				}}
			>

				{this.viewOverlay()}

				<View style={{
					flex: 1,
					flexDirection: 'column',
					justifyContent: 'flex-end',
				}}>

					{/* <DropdownAlert updateStatusBar={false}
						visible={this.state.dropdownAlert.visible}
						alertType={this.state.alertType}
						message={this.state.dropdownAlert.message}
					/> */}
					<View>
						<DropdownAlert
							ref={ref => this.dropdown = ref}
							updateStatusBar={false}
						/>
					</View>
					<View style={this.dinamicModalContent()}>
						<KeyboardAvoidingView >

							{this.props.concent}
						</KeyboardAvoidingView>

					</View>

				</View>
			</Modal >
		);
	}


	stylesCustom() {
		custom = this.state.styles;
		if (this.props.styles) {
			for (const key in this.props.styles) { //atributo Pai name class
				if (custom[key]) {
					for (const x in custom[key]) { //atributo Filho, ex: width, ringth
						if (this.props.styles[key] && this.props.styles[key][x]) {
							custom[key] = this.props.styles[key];
						}
					}
				}

			}
		}
		return custom;
	}

	dinamicModalContent() {
		var style = this.stylesCustom();
		if (style) { //se elemento existir
			custom = style.modalContent;

			if (this.props.keyboardManipulate) {
				custom = this.state.keyboardDidShow ? styles.modalContentFlex : style.modalContent;
			}

			return custom;
		}
	}


	viewOverlay() {
		if (!this.state.keyboardDidShow || !this.props.keyboardManipulate) {
			return (
				<TouchableOpacity style={styles.overlay} onPress={() => {
					this.closeModal();
				}} />
			);
		}
	}

	closeModal() {
		this.props.navigation.navigate(this.props.navigation.state.routeName, {
			visible_modal: false,
			dropdownAlert: {
				visible: false
			},
		});
	}

	componentDidUpdate(prevProps, prevState, nextState) {
		if (this.props.visible_modal && !this.state.visible_modal) {
			this.setState((state, props) => {
				return {
					visible_modal: true
				};
			});
		}
	}

	async componentWillReceiveProps(nextProps) {
		// console.log(this);
		if (nextProps.navigation.state.params && !nextProps.navigation.state.params.visible_modal) {
			var item = nextProps.navigation.state.params;

			if (
				item.dropdownAlert &&
				this.dropdown &&
				nextProps.navigation.state.params.dropdownAlert.visible
			) {
				this.dropdown.alertWithType(item.dropdownAlert.alertType, '', item.dropdownAlert.message);
				setTimeout(async () => {
					this.setState((state, props) => {
						return { visible_modal: null };
					});
				}, item.dropdownAlert.timout);
				return;
			}

			this.setState((state, props) => {
				return { visible_modal: null };
			});

			return;
		}
	}

	async componentDidMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			this._keyboardDidShow();
		});
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			this._keyboardDidHide();
		});

		this.setState({
			styles: styles
		})
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

export default CustomModal;
