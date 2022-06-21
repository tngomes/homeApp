import React from 'react';

import { View } from 'react-native';

const ViewBlank = class ViewBlank extends React.Component {
    render() {
        return (
            <View />
        );
    }
}

ViewBlank.navigationOptions = ({ navigation }) => ({
    header: null
})

export default ViewBlank;