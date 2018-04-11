import React from 'react';
import { View,FlatList } from 'react-native';
import {ListItem} from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import PubSub from 'pubsub-js';
import {EVENTS_CHANGED} from '../constants/events'
import DB from '../db';
class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries:[],

        }
        this.keyCount = 0;
        this.getKey = this.getKey.bind(this);
    }

    componentWillMount(){
        this.token = PubSub.subscribe(EVENTS_CHANGED,this.retrieveEntries.bind(this));
    }
    componentDidMount() {
        PubSub.publish(EVENTS_CHANGED,this.token);
    }
    componentWillUnmount(){
      PubSub.unsubscribe(this.token);
    }

    retrieveEntries(msg) {
        console.log("APP: retrieving entries")
        console.log("Message: " + msg)
        DB.retrieveAll()
        .then((res)=>this.setState({entries:res||[]}));
    }

    getKey(){
        return this.keyCount++;
    }
    addPage = ()=>{
        this.props.navigation.navigate("Add");
    }

    openEntry(entry) {
        this.props.navigation.navigate("Details",{details:entry,onBackNavigation:()=>retrieveEntries()});
    }
    static navigationOptions = ({navigation,navigationOptions}) => {
        return {
            title: 'DICT-YOU-NARY',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                justifyContent:"center",
                flex:1,
                textAlign:'center'}};
      };


  renderEntry(entry) {
      return (
          <ListItem title={entry.word} onPress={()=>this.openEntry(entry)}/>

      )
  }
  render() {
    return (
      <View style={{ flex: 1}}>
        <FlatList data={this.state.entries} renderItem={({item})=>this.renderEntry(item)} />
        <ActionButton
          buttonColor="#3d4446"
          onPress={this.addPage}
        />
      </View>
    );
  }
}
