import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Form from 'react-native-form';

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            enterCode: false,
            phone: '',
            email: ''
        }
    }

    _getCode = () => {

        console.log(this.refs.form.getValues())

        this.setState({ enterCode: true })
    }
  
    _getSubmitAction = () => {
        this.state.enterCode ? this._verifyCode() : this._getCode();
    }
  
    _renderFooter = () => {

    if (this.state.enterCode)
        return (
            <View>
                <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
                Enter the wrong number or need a new code?
                </Text>
            </View>
        );

        return (
            <View>
                <Text style={styles.disclaimerText}>By tapping "Send confirmation code" above, we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.</Text>
            </View>
        );

    }

    _renderEmail = () => {

      if (this.state.enterCode)
        return (
            <View />
        );

        return (
            <TextInput
                ref={'textInput'}
                name={ 'email' }
                type={'TextInput'}
                style={styles.textInput}
                onChangeText={(email) => this.setState({email})}
                placeholder={'Email'}
                name={'email'}
            />
        )
    }

    render() {

    let buttonText = this.state.enterCode ? 'Verify confirmation code' : 'Send confirmation code';
    let textStyle = this.state.enterCode ? {
        height: 50,
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Courier',
        borderWidth: 0
    } : {};

    return (
      <View style={styles.container}>

        <Text style={styles.welcome}>
          Welcome to Plumbus
        </Text>

        <Form ref={'form'} style={styles.form}>

            <TextInput
                ref={'textInput'}
                name={this.state.enterCode ? 'code' : 'phoneNumber' }
                type={'TextInput'}
                style={[styles.textInput, textStyle]}
                onChangeText={(phone) => this.setState({phone})}
                placeholder={this.state.enterCode ? '_ _ _ _ _ _' : 'Phone Number'}
                name={'phone'}
                autoCorrect={false}
            />

            {this._renderEmail()}

          <TouchableOpacity style={styles.button} onPress={this._getSubmitAction}>
            <Text style={styles.buttonText}>{ buttonText }</Text>
          </TouchableOpacity>

        {this._renderFooter()}

        </Form>

    </View>
    );
  }
}

const brandColor = '#744BAC';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 60,
    margin: 20,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  form: {
    margin: 10
  },
  textInput: {
      height: 40, 
      borderColor: 'gray', 
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      marginBottom: 20,
  },
  button: {
      marginTop: 20,
      height: 50,
      backgroundColor: brandColor,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold'
  },
  wrongNumberText: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center'
  },
  disclaimerText: {
    marginTop: 30,
    fontSize: 12,
    color: 'grey'
  },
});

