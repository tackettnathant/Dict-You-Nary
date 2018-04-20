import React from 'react';
import {Platform} from 'react-native'
import { StackNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen'
import DetailsScreen from './screens/DetailsScreen'
import Entry from './components/entry'
const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: Entry,
    }
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f8ecc2',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      },
    }
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
