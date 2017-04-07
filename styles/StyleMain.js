
import {
  StyleSheet,
  Dimensions
} from 'react-native';

const brandColor = '#744BAC';
const fullWidth = Dimensions.get('window').width; //full width
const fullHeight = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  loadingContainer: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.75,
    backgroundColor: brandColor,
    height: fullHeight,
    width: fullWidth
  },
  logo: {
      alignItems: 'center',
      marginTop: 50
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    margin: 20,
    color: brandColor
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
    marginTop: 20,
    margin: 10,
    fontSize: 14,
    textAlign: 'center'
  },
  disclaimerText: {
    marginTop: 30,
    fontSize: 12,
    color: 'grey'
  },

  // Home Screen styles
  greetingScreen: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    margin: 50,
  },
  
  // Map page styles
  map: {
    height: fullHeight,
    width: fullWidth
  }
  
});

module.exports = styles