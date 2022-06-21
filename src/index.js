import React, { useEffect } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import './config/ReactotronConfig';

import Routes from './routes';
import { Provider } from 'react-redux';
import { Store } from './store';

if (__DEV__) {
	require('react-devtools');
}

const App = () => {
	useEffect(() => {
		SplashScreen.hide();
	}, []);

	return (
		<Provider store={Store}>
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar barStyle="light-content" backgroundColor="#02538b" />
				<Routes />
			</SafeAreaView>
		</Provider>
	);
};



export default App;
