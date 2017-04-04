import React, { Component } from 'react';
import {
  AppRegistry,
  View
} from 'react-native';
import App from './App.js'

export default class plumbus extends Component {
  render() {
    return (
        <App />
    );
  }
}


AppRegistry.registerComponent('plumbus', () => plumbus);
