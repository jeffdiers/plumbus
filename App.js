import React, { Component } from 'react';
import {
  View,
  AsyncStorage,
  Navigator
} from 'react-native';
import LoginForm from './login/LoginForm.js'
import HomeScreen from './home/HomeScreen'
import styles from './styles/StyleMain'

export default class App extends Component {

    constructor(props) {
        super(props) 
        this.state = {
            loading: true,
            messages: []
        }
        this.renderScene = this.renderScene.bind(this)
    }

    componentDidMount() {
        this._loadAsnycStorage().done()
    }

    _loadAsnycStorage = async () => {

        try {
            let user = await AsyncStorage.getItem('userProfile')
            if (user !== null) {
                this._appendMessage('User Profile found: ' + user)
                this.setState({
                    loading: false,
                    userProfile: user,
                    verified: true
                })
            } else {
                this._appendMessage('No user profile in storage.')
                this.setState({
                    loading: false
                })
            }
        } catch (err) {
                 this._appendMessage('AsyncStorage error: ' + err.message)
        }
    }

    _appendMessage = (message) => {
        this.setState({messages: this.state.messages.concat(message)});
    }

    //if there is a user saved in async send to login
    _renderComponent = () => {

        if (this.state.loading) 

            return <View />

        else if (this.state.verified) 

            return <HomeScreen user={this.state.user} messages={this.state.messages} />
            
        else 
        
            return <LoginForm messages={this.state.messages} />
            
            
    }

  render() {
      return (
        <Navigator
            style={styles.navigator}
            initialRoute={{title: "LoginScreen"}}
            renderScene={ this.renderScene }
        />
    );
  }

  renderScene(route, navigator) {

        if (this.state.loading) 

            return <View />

        else if (this.state.verified || route.title === "HomeScreen") 

            return <HomeScreen navigator={navigator} {...route.passProps} user={this.state.user} messages={this.state.messages} />
            
        else 
        
            return <LoginForm navigator={navigator} {...route.passProps} messages={this.state.messages} />
  }

}

