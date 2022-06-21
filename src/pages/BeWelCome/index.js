import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Keyboard, StyleSheet, View, Text, Image, TouchableHighlight, TextInput } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Formik } from 'formik';
import * as yup from 'yup';
import helpers from "../../components/helpers";

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  slide: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#02538b'
  },
  title: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 30,
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 30,
  },

  img: { // melhor solução até o momento
    resizeMode: 'stretch',
    height: 300,
    width: null,
    flex: 1,
  },

  TextInput: {
    borderRadius: 5,
    height: 70,
    width: "100%",
    borderColor: '#ffff',
    color: '#ffff',
    borderBottomWidth: 1,
    fontSize: 30
  },

  TextInvalid: {
    borderRadius: 5,
    height: 40,
    width: "100%",
    color: '#ffff',
    borderColor: 'red',
    borderBottomWidth: 1,
    fontSize: 15
  },

  TextError: {
    fontSize: 15,
    color: 'red',
    margin: 7,
  },
});

const slides = [
  {
    key: 1,
    text: '',
    title: 'Bem Vindo',
    image: require('../../assets/bewelcome/logo2.png'),
    backgroundColor: '#02538b',
  },
  {
    key: 2,
    title: 'Digite seu Nome',
    text: '',
    image: '',
    backgroundColor: '#02538b',
  },
  {
    key: 3,
    title: 'Cadastro Realizado',
    text: '',
    image: require('../../assets/bewelcome/logo2.png'),
    backgroundColor: '#02538b',
  }
];



const BeWelCome = class BeWelCome extends React.Component {
  _keyExtractor = (item, index) => index.toString();
  formik = null;
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
      nextButtom: true,
    };
  }

  _renderItem = ({ item }) => {
    console.log('att');
    return (
      <Formik
        initialValues={{ name_user: '' }}
        validationSchema={yup.object().shape({
          name_user: yup
            .string()
            .required('Nome obrigatório')
        })}
      >

        {formik => (

          <View style={styles.slide}>
            <View style={{ height: 200, width: 300 }} >
              <Text style={styles.title}>{item.title}</Text>
            </View>

            {item.image ? (
              <View style={{ height: 200, width: 250 }} >
                <Image style={styles.img} source={item.image} />
              </View>
            ) : (
                <View style={{ height: 200, width: 200 }} >
                  <View>
                    <TextInput
                      ref={(input) => {
                        this.inputField = input;
                        this.formik = formik;
                      }}
                      onChangeText={formik.handleChange('name_user')}
                      onBlur={formik.handleBlur('name_user')}
                      value={formik.values.name_user}
                      maxLength={100}
                      style={(formik.touched.name_user && formik.errors.name_user) ? styles.TextInvalid : styles.TextInput}
                    >
                    </TextInput>

                    {formik.touched.name_user && formik.errors.name_user &&
                      <Text style={styles.TextError}>{formik.errors.name_user}</Text>
                    }
                  </View>

                </View>
              )
            }

            {item.text ? (
              <View style={{ height: 200, width: 200 }} >
                <Text style={styles.text}>{item.text}</Text>
              </View>) : null}
          </View>

        )}
      </Formik>

    );
  }
  _renderNextButton = () => {
    return (
      <TouchableHighlight style={styles.buttonCircle} onPress={(e) => this._okPressed()} >
        <Icon
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </TouchableHighlight>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  _onDone = async (res) => {
    const user = {
      name: this.formik.values.name_user
    };
    await helpers.storageSetItem('user', JSON.stringify(user));


    this.state.navigation.navigate('BoardRegister');
  }

  _okPressed = () => {
    console.log('_okPressed');
    switch (this.AppIntroSlider.state.activeIndex) {
      case 0:
        console.log('oiii');
        this.AppIntroSlider.goToSlide(this.AppIntroSlider.state.activeIndex + 1);
        this.setState({ 'a': '1' })
        if (this.inputField) {
          this.inputField.focus();
        }
      case 1:
        if (this.formik.values.name_user && this.formik.isValid) {
          Keyboard.dismiss();
          this.AppIntroSlider.goToSlide(this.AppIntroSlider.state.activeIndex + 1);
        }
        break;
      default:
        this.AppIntroSlider.goToSlide(this.AppIntroSlider.state.activeIndex + 1);
    }
  }

  render() {
    console.log('teste');
    return (
      <AppIntroSlider
        data={slides}
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        showNextButton={this.state.nextButtom}
        onDone={this._onDone}
        ref={ref => this.AppIntroSlider = ref}
        scrollEnabled={false}
      />
    );
  }
}

BeWelCome.navigationOptions = ({ navigation }) => ({
  header: null
})

export default BeWelCome;