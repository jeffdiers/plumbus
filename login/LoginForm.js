import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  AsyncStorage
} from 'react-native';
import Form from 'react-native-form';
import Frisbee from 'frisbee';
import Icon from 'react-native-vector-icons/Ionicons'
import SocketIOClient from 'socket.io-client';
import styles from '../styles/StyleMain'

// deployed db -> https://cryptic-sea-14253.herokuapp.com
// local db -> http://localhost:3000

const api = new Frisbee({
    baseURI: 'https://cryptic-sea-14253.herokuapp.com',
    // baseURI: 'http://localhost:3000',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

export default class LoginForm extends Component {

    constructor(props) {
        super(props)
        this.state = { 
            loading: false,
            verified: false,
            enterCode: false,
            messages: [],
            country: {
                cca2: 'US',
                callingCode: '1'
            }
        }
        // this.socket = SocketIOClient('http://localhost:3000');
        // this.socket.on('connection', function (socket) {
        //     console.log('We have a connection')
        // });
    }

    componentDidMount() {
        this._loadAsnycStorage().done()
    }

    _loadAsnycStorage = async () => {

        try {
            let user = await AsyncStorage.getItem('userProfile')
            if (user !== null) {
                this.setState({userId: user})
                this._appendMessage('User Profile found: ' + user)
            } else {
                this._appendMessage('No user profile in storage.')
            }
        } catch (err) {
                 this._appendMessage('AsyncStorage error: ' + err.message)
        }
    }

    _clearAsyncStorage = async () => {

        try {
            await AsyncStorage.removeItem('userProfile')
        } catch (err) {
            this._appendMessage('Removing AsyncStorage error: ' + err.message)
        }
    }

    _getCode = async () => {

        this.setState({ loading: true })

        try {
            const res = await api.post('/users', {
                body: {
                    ...this.refs.form.getValues(),
                    ...this.state.country
                }
            })

            console.log('----res.body----')
            console.log(res)

            if (res.err) throw res.err;

            this.setState({
                loading: false,
                enterCode: true,
                userID: res.body._id
            })
            this.refs.form.refs.textInput.setNativeProps({ text: '' })
            
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

            console.log('-------res-------')
            console.log(JSON.stringify(res.body))

            if (res.err) throw res.err;

            // Save the user profile to disk after logging in
            try {
                await AsyncStorage.setItem('userProfile', JSON.stringify(res.body))
            } catch (err) {
                this._appendMessage('err saving the userId')
            }

            this.refs.form.refs.textInput.blur();

            this.setState({ 
                loading: false,
                verified: true 
            })
            Alert.alert('Great success! you are verified :)')
            this.props.navigator.push({
                title: "HomeScreen"
            })
            
        } catch (err) {
            this.setState({ loading: false })
            Alert.alert('Oops! didnt work', err.message)
        }
    }

    _tryAgain = () => {
        this.refs.form.refs.textInput.setNativeProps({ text: '' })
        this.refs.form.refs.textInput.focus();
        this.setState({ enterCode: false });
    }
  
    _getSubmitAction = () => {
        this.state.enterCode ? this._verifyCode() : this._getCode();
    }

    _appendMessage = (message) => {
        this.setState({messages: this.state.messages.concat(message)});
    }
  
    _renderFooter = () => {

    if (this.state.enterCode)
        return (
            <View>
                <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
                Enter the wrong number or need a new code?
                </Text>
            </View>
        )

    else if(this.state.loading)

        return <View />
        
    else 

        return (
            <View>
                <Text style={styles.disclaimerText}>By tapping "Send confirmation code" above, we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.</Text>
            </View>
        )

    }

    _renderEmail = () => {

    if (this.state.enterCode)

        return <View />

    else 

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

    let buttonText = this.state.enterCode ? 'Verify confirmation code' : this.state.loading ? 'Loading...' : 'Send confirmation code';
    let textStyle = this.state.enterCode ? {
        height: 50,
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Courier',
        borderWidth: 0
    } : {}

    let loadingText = null

    if (this.state.loading) {
        loadingText = <Text>Loading...</Text>
    } else {
        loadingText = <Text />
    }

    return (
        <View style={this.state.loading ? styles.loadingContainer : styles.container}> 
            <View style={styles.logo}>
            <Icon name="ios-cut-outline" size={100} color={this.state.loading ? 'white' : '#744BAC'} />
            </View>
            <Text style={styles.welcome}>
            Welcome to Nomad
            </Text>

            <Form ref={'form'} style={styles.form}>

                {this._renderEmail()}

                <TextInput
                    ref={'textInput'}
                    name={this.state.enterCode ? 'code' : 'phoneNumber' }
                    type={'TextInput'}
                    keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
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
        </View>  
    )
  }
}



