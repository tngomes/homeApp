import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import { Link } from 'react-router-native';
import { TouchableOpacity } from 'react-native';
import { faHeart, faLightbulb, faUser, faPlus } from "@fortawesome/free-solid-svg-icons";

import AppLayout from '../../components/AppLayout';
import MenuItemNav from '../../components/MenuItemNav';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const menus = [
    {
        title: 'Account',
        icon: faUser,
        url: '/account',
    },
    {
        title: 'Privacy',
        icon: faUser,
        url: '/account',
    },
    {
        title: 'Security',
        icon: faUser,
        url: '/account',
    },
    {
        title: 'Two - Step Verification',
        icon: faUser,
        url: '/account',
    },
    {
        title: 'Change number',
        icon: faUser,
        url: '/account',
    },
    {
        title: 'Request account info',
        icon: faUser,
        url: '/account',
    },
    {
        title: 'Delete my account',
        icon: faUser,
        url: '/account',
    },
];

const Profile = class Profile extends React.Component {
    render() {
        return (
            <AppLayout>

                <View style={styles.profileImageContainer}>
                    <Image
                        source={require('../assets/images/user.jpg')}
                        style={styles.profileImage}
                    />
                    <TouchableOpacity>
                        <View style={styles.smallIconContainer}>
                            <Image
                                source={require('../assets/images/edit_small/edit_small.png')}
                                style={styles.smallIcon}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* <View style={styles.header}> */}
                {/* <Link to="/" style={styles.backButton} underlayColor="transparent"> */}
                {/* <Image source={require('../assets/images/backArrow/backArrow.png')} /> */}
                {/* </Link> */}
                {/* <Text style={styles.title}>Settings</Text> */}
                {/* </View> */}

                <Text style={styles.name}>Billy McCoy</Text>
                <Text style={styles.description}>Ui & Ux Designer</Text>

                <View>
                    {menus.map((menu, key) => (
                        <MenuItemNav
                            key={key}
                            title={menu.title}
                            icon={menu.icon}
                            url={menu.url}
                        />
                    ))}
                </View>
            </AppLayout >
        )

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
        borderColor: '#8CC33F',
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


Profile.navigationOptions = ({ navigation }) => ({
    title: 'Meu Perfil',

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

export default Profile;
