/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

if(Text.defaultProps) {
    Text.defaultProps.allowFontScalling = false
} else {
    Text.defaultProps = {}
    Text.defaultProps.allowFontScalling = false
}

if(TextInput.defaultProps) {
    TextInput.defaultProps.allowFontScalling = false
} else {
    TextInput.defaultProps = {}
    TextInput.defaultProps.allowFontScalling = false
}

AppRegistry.registerComponent(appName, () => App);
