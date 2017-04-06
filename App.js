import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import Form from 'react-native-form';
import Frisbee from 'frisbee';
window.navigator.userAgent = "react-native";

import SocketIOClient from 'socket.io-client';

// deployed db -> https://cryptic-sea-14253.herokuapp.com
// local db -> http://localhost:3000

const api = new Frisbee({
    baseURI: 'https://cryptic-sea-14253.herokuapp.com',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = { 
            loading: false,
            enterCode: false,
            country: {
                cca2: 'US',
                callingCode: '1'
            }
        }

        this.socket = SocketIOClient('http://localhost:3000');
        this.socket.on('connection', function (socket) {
            console.log('We have a connection')
        });
    }


    _getCode = async () => {

        this.setState({ loading: true })

        try {
            const res = await api.post('/users', {
                body: {
                    ...this.refs.form.getValues(),
                    ...this.state.country
                }
            });

            console.log('----res.body----')
            console.log(res)

            if (res.err) throw res.err;

            this.setState({
                loading: false,
                enterCode: true,
                userID: res.body._id
            });
            this.refs.form.refs.textInput.setNativeProps({ text: '' });
            
            Alert.alert('code on the way')

        } catch (err) {
            this.setState({loading: false})
            Alert.alert('Oops!', err.message);
            }

    }

    _verifyCode = async () => {

        this.setState({ loading: true })

        let _id = this.state.userID

        try {

            const res = await api.post('/users/'+_id+'/verify', {
                body: {
                    ...this.refs.form.getValues()
                }
            })

            if (res.err) throw res.err;

            this.refs.form.refs.textInput.blur();

            this.setState({ loading: false })
            Alert.alert('Great success! you are verified :)')
            
        } catch (err) {
            this.setState({ loading: false })
            Alert.alert('Oops! didnt work', err.message)
        }
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
            <View>

                <TextInput
                    ref={'textInput'}
                    name={ 'name' }
                    type={'TextInput'}
                    style={styles.textInput}
                    onChangeText={(name) => this.setState({name})}
                    placeholder={'Name'}
                />

                <TextInput
                    ref={'textInput'}
                    name={ 'email' }
                    type={'TextInput'}
                    style={styles.textInput}
                    onChangeText={ (email) => this.setState({ email }) }
                    placeholder={'Email'}
                />

            </View>
        )
    }

    render() {

    let loadingText = this.state.loading ? 'Loading...' : ''
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
          Welcome to Nomad
        </Text>

        <Form ref={'form'} style={styles.form}>

            {this._renderEmail()}

            <TextInput
                ref={'textInput'}
                name={this.state.enterCode ? 'code' : 'phoneNumber' }
                type={'TextInput'}
                style={[styles.textInput, textStyle]}
                onChangeText={(phone) => this.setState({phone})}
                placeholder={this.state.enterCode ? '_ _ _ _ _ _' : 'Phone Number'}
                autoCorrect={false}
            />


          <TouchableOpacity style={styles.button} onPress={this._getSubmitAction}>
            <Text style={styles.buttonText}>{ buttonText }</Text>
          </TouchableOpacity>

        {this._renderFooter()}
        </Form>
        <Text>{loadingText}</Text>
        <Text>verification state: {this.state.userID}</Text>

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
      borderColor: brandColor,
      padding: 10,
      marginBottom: 20,
  },
  button: {
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

