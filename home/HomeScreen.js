import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  TouchableOpacity,
  TabBarIOS,
  MapView
} from 'react-native'
import styles from '../styles/StyleMain'
import Icon from 'react-native-vector-icons/Ionicons'

export default class WelcomeScreen extends Component {

    constructor(props) {
        super(props) 
        this.state = {
            messages: [],
            selectedTab: 'cutTab',
        }
        
    }

    _clearAsyncStorage = async () => {

        try {
            await AsyncStorage.removeItem('userProfile')
        } catch (err) {
            this._appendMessage('Removing AsyncStorage error: ' + err.message)
        }
    }

    _renderContent = (page: string) => {

        if(page === 'Profile Tab')

            return (
                <View style={styles.tabContent}>
                    <Text style={styles.tabText}>{page}</Text>
                    <TouchableOpacity style={styles.button} onPress={this._clearAsyncStorage}>
                        <Text style={styles.buttonText}>Log out</Text>
                    </TouchableOpacity>
                </View>
            )
        
        else if(page === 'Cut Tab')

            return (
                <View style={styles.tabContent}>
                    <Text style={styles.tabText}>{page}</Text>
                </View>
            )

        else if(page === 'Map Tab')

            return (
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                />
            )

    };


  render() {
    return (
    <TabBarIOS
        tintColor="#744BAC">
        <Icon.TabBarItem
            title="Profile"
            iconName="ios-person-outline"
            selectedIconName="ios-person-outline"
            selected={this.state.selectedTab === 'profileTab'}
            onPress={() => {
                this.setState({
                    selectedTab: 'profileTab',
                });
                }}>
                {this._renderContent('Profile Tab')}
        </Icon.TabBarItem>
        <Icon.TabBarItem
            title="Cut"
            iconName="ios-cut-outline"
            selectedIconName="ios-cut-outline"
            selected={this.state.selectedTab === 'cutTab'}
            onPress={() => {
                this.setState({
                selectedTab: 'cutTab',
                });
            }}>
            {this._renderContent('Cut Tab')}
        </Icon.TabBarItem>
        <Icon.TabBarItem
            title="Map"
            iconName="ios-map-outline"
            selectedIconName="ios-map-outline"
            selected={this.state.selectedTab === 'mapTab'}
            onPress={() => {
                this.setState({
                selectedTab: 'mapTab',
                });
            }}>
            {this._renderContent('Map Tab')}
        </Icon.TabBarItem>

      </TabBarIOS>
    );
  }
}



