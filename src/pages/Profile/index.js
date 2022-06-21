import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableHighlightBase,
} from 'react-native';
import { Link } from 'react-router-native';
import { TouchableOpacity, Linking } from 'react-native';
import AuthLayout from '../../components/AuthLayout';
import AppLayout from '../../components/AppLayout';
import MenuItemNav from '../../components/MenuItemNav';
import helpers from "../../components/helpers";
import CustomModal from '../../components/CustomModal';
import ConfirmationAction from '../../components/ConfirmationAction';
import TouchID from 'react-native-touch-id';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { faUser, faFingerprint, faInfo } from "@fortawesome/free-solid-svg-icons";
import ImagePicker from 'react-native-image-crop-picker';
import { Console } from 'console';
import AccountEdit from '../AccountEdit';

const menus = [];

const Profile = class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            navigation: props.navigation,
            user: {},
            itensMenus: [],
            photo: {
                'path': '',
                'valid': false,
            },
        }
    }

    render() {
        console.log(this.state.photo);
        console.log(this.state.photo.valid);
        return (
            <AuthLayout title="" showBackButton>
                <View>

                    {this.state.photo && this.state.photo.valid ? (
                        <View style={styles.profileImageContainer}>
                            <TouchableOpacity onPress={async () => {
                                await this.handleChoosePhoto();
                            }} >
                                <Image
                                    source={{ uri: `data:image/png;base64,${this.state.photo.data}` }}
                                    style={styles.profileImage}
                                />
                                <View style={styles.smallIconContainer}>
                                    <Icon name="edit" size={12} color="#02538b" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                            <View style={styles.profileImageContainer}>

                                <TouchableOpacity onPress={async () => {
                                    await this.handleChoosePhoto();
                                }} >
                                    <Image source={require('../../assets/dummy.png')}
                                        style={styles.profileImage}
                                    />
                                    <View style={styles.smallIconContainer}>
                                        <Icon name="edit" size={12} color="#02538b" />
                                    </View>
                                </TouchableOpacity>
                            </View>

                        )}


                    <View style={{ marginTop: 65 }}>
                        <Text style={styles.name}>{this.state.user.name}</Text>

                        {/* <Text style={styles.description}></Text> */}

                        {/* <AppLayout> */}

                        <ScrollView style={styles.menuContainer}>
                            {
                                this.state.itensMenus ?
                                    this.state.itensMenus.map((menu, key) => (
                                        <MenuItemNav
                                            key={key}
                                            title={menu.title}
                                            icon={menu.icon}
                                            function={menu.function}
                                        />
                                    ))
                                    : null
                            }
                        </ScrollView>
                        {/* </AppLayout > */}
                    </View>
                </View>

                <CustomModal
                    navigation={this.props.navigation}
                    visible_modal={this.state.visible_modal}
                    concent={this.renderContent(this.state.id)}
                    styles={
                        {
                            modalContent: this.renderStyle(this.state.id)
                        }
                    }

                    keyboardManipulate={false}
                >

                </CustomModal>

            </AuthLayout >
        )

    }

    async componentDidMount() {
        var user = JSON.parse(await helpers.storageGetItem('user'));
        var photo = {
            'data': user.img,
            'valid': false,
        }
        if (user.img) {
            photo.valid = true;
        }
        this.setState({
            user: user,
            photo: photo,
            itensMenus: await this.itensMenus()
        });
    }

    renderStyle(id) {
        switch (id) {
            case 'authentication':
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
            case 'account':
                return {
                    backgroundColor: '#ffffff',
                    height: 200,
                    borderColor: '#ffffff',
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                    width: '100%',
                }
                break;
            default:
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
        }

    }

    async handleChoosePhoto() {
        const options = {
            noData: true,
            skipBackup: false,
        };
        setTimeout(async () => {
            ImagePicker.openCamera({
                width: 463,
                height: 463,
                cropping: true,
                includeBase64: true
            }).then(async (imageObj) => {
                const img = {
                    path: imageObj.path,
                    data: imageObj.data,
                    valid: true
                }
                var user = JSON.parse(await helpers.storageGetItem('user'));
                user['img'] = img.data;
                var user = await helpers.storageSetItem('user', JSON.stringify(user))

                var user = JSON.parse(await helpers.storageGetItem('user'));

                this.setState({ photo: img });

            }).catch((error) => {
                console.log('onTakePhotoPress error')
            })
        }, 100)
    }

    async itensMenus() {
        var itensMenus = [];

        itensMenus.push(
            {
                title: 'Perfil',
                icon: faUser,
                function: () => {
                    this.setState({ 'id': 'account', visible_modal: true })
                },
            }
        );

        var _isSupported = async () => {
            try {
                return await TouchID.isSupported()
            } catch (e) {
                return false;
            }
        }

        var whereSupported = await _isSupported();

        if (whereSupported) {
            itensMenus.push(
                {
                    title: 'Autenticação Digital',
                    icon: faFingerprint,
                    function: () => {
                        this.setState({ 'id': 'authentication', visible_modal: true })
                    },
                }
            )
        }
        itensMenus.push(
            {
                title: 'Ajuda',
                icon: faInfo,
                function: () => {
                    var message = 'Ola%2C%20tenho%20uma%20duvida%2C%20pode%20me%20ajudar%3F%20';
                    Linking.canOpenURL("whatsapp://send?text=oi").then(supported => {
                        if (supported) {
                            return Linking.openURL(
                                "whatsapp://send?phone=557183779617&text=" + message
                            );
                        } else {
                            return Linking.openURL(
                                "https://api.whatsapp.com/send?phone=557183779617&text" + message
                            );
                        }
                    })

                }
            }
        );

        // itensMenus.push(
        //     {
        //         title: 'Segurança',
        //         icon: '',
        //         function: '/account',
        //     }
        // );

        // itensMenus.push(
        //     {
        //         title: 'Deletar Minha Conta',
        //         icon: '',
        //         function: '/account',
        //     }
        // );


        return itensMenus;
    }

    renderContent(id) {

        switch (id) {
            case 'authentication':
                return (
                    <ConfirmationAction navigation={this.props.navigation}></ConfirmationAction>
                )
                break;
            case 'account':
                return (
                    <AccountEdit navigation={this.props.navigation}></AccountEdit>
                )
                break;
            default:
                return (
                    <View></View>
                )
        }
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.navigation.state.params.user) {
            this.setState({
                visible_modal: nextProps.navigation.state.params.visible_modal,
                user: nextProps.navigation.state.params.user
            })
        } else {
            this.setState({
                visible_modal: nextProps.navigation.state.params.visible_modal,
            })
        }

    }

}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#8CC33F',
        padding: 20,
        alignItems: 'center',
        flexDirection: 'row',
    },
    title: {
        color: '#fff',
        fontFamily: 'Poppins-Semibold',
        fontSize: 20,
        marginLeft: 15,
    },

    profileImageContainer: {
        position: 'absolute',
        top: -65,
        alignSelf: 'center',
    },
    profileImage: {
        height: 130,
        width: 130,
        borderRadius: 65,
        borderColor: '#fff',
        borderWidth: 6,
    },
    smallIconContainer: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#02538b',
        width: 24,
        height: 24,
        borderRadius: 12,
        right: 5,
        bottom: 15,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontFamily: 'Poppins-Semibold',
        fontSize: 20,
        letterSpacing: 0,
        color: '#262626',
        alignSelf: 'center',
    },
    description: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        letterSpacing: 0,
        color: '#808080',
        alignSelf: 'center',
    },
    menuContainer: {
        marginTop: 25,
    },
});


export default Profile;
