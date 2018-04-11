import React from 'react';
import { StackNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen'
import DetailsScreen from './screens/DetailsScreen'
import AddScreen from './screens/AddScreen'

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
    Add: {
        screen: AddScreen
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
