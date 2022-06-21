import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'react-router-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faLightbulb, faUser, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default MenuItemNav = props => {
    console.log(props.icon);
    return (
        <TouchableOpacity
            onPress={async () => {
                typeof props.function === "function" ? props.function() : () => { };
            }}
        >

            <View style={styles.menuItem}>
                {props.icon ? (
                    <FontAwesomeIcon icon={props.icon} color="#02538b" size={25} />
                    )
                    : null
                }
                <Text style={styles.name}>{props.title}</Text>
                <FontAwesomeIcon style={styles.arrowIcon} icon={faChevronRight} color="#02538b" size={25} />

            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 1,
        borderColor: '#CBCBCB',
        alignItems: 'center',
    },
    name: {
        marginLeft: 40,
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        letterSpacing: 0,
        color: '#262626',
    },
    arrowIcon: {
        position: 'absolute',
        right: 20,
    },
});