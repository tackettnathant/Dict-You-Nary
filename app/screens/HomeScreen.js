import React from 'react';
import { View,FlatList,Platform,Modal,TextInput,Text,Button,ActivityIndicator,StyleSheet } from 'react-native';
import {ListItem} from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import PubSub from 'pubsub-js';
import {EVENTS_CHANGED} from '../constants/events'
import DB from '../db';
import WordsAPI from '../components/wordsapi';
import Message from '../components/message'
import {entryJSON} from '../testdata'
import Swipeout from 'react-native-swipeout';
export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries:[],
            addModalVisible:false,
            retrieving:false

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
        this.setState({addModalVisible:true})
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

  async deleteEntry(key) {

      if (key){
          await DB.delete(key);
      }
      PubSub.publish(EVENTS_CHANGED,EVENTS_CHANGED);
  }
  renderEntry(entry) {
      let swipeoutBtns = [
        {
          text: 'Delete',
          onPress: ()=>this.deleteEntry(entry.key),
          type: "delete"
      }

      ]
      return (
          <Swipeout style={styles.swipeout}  key={this.getKey()} right={swipeoutBtns}  >
            <ListItem title={entry.word} onPress={()=>this.openEntry(entry)}/>
          </Swipeout>

      )
  }

  closeModal() {
      this.setState({retrieving:false,addModalVisible:false,word:null});
  }
  async lookupWord() {
      this.setState({retrieving:true});
      //TODO: Uncomment
      //if (!this.state.word) return;
      try {
          //TODO: uncomment
          // let url = "https://wordsapiv1.p.mashape.com/words/"+encodeURIComponent(this.state.word);
          // let key = "88ZU9R30jWmsh8hEb9JHPDRFPOvCp1JFqLIjsndmcVYkUgAuuL";
          // //
          // let response = await fetch(url, {headers:{"X-Mashape-Key":key}});
          // let responseJson = await response.json();
          let p = new Promise((resolve)=>{
              setTimeout(
                  ()=>{resolve(entryJSON)},
                  1500
              )
          });
          let responseJson = await p;

          let entry = WordsAPI.convertToEntry(responseJson);
          this.closeModal();
          this.props.navigation.navigate("Details",{details:entry});
          //console.log(entry);
          //this.setState({retrieved:entry});
          //
          // this.setState({definition:responseJson});
          //this.setState({retrieved:true});
          //console.log(this.state.retrieved)
      } catch (error) {
          //this.setState({retrieved:{word:this.state.word}})
          //TODO
          this.closeModal();
          this.refs.alertMessage.ShowMessageFunction("Unable to lookup word");
          console.log(error)
      }
      //console.log(this.state.word);
}

  render() {
    return (
      <View style={{ flex: 1}}>
      <Message ref="alertMessage" position="bottom"/>
        <FlatList data={this.state.entries} renderItem={({item})=>this.renderEntry(item)} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.addModalVisible}
          onRequestClose={() => {
              this.setState({addModalVisible:false,retrieving:false});
          }}>
          <View style={{marginTop: 22,paddingLeft:20,paddingRight:20,flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.ModalInsideView}>
                <View style={{flex:1,justifyContent:"center"}}>
                <View style={{paddingBottom:20}}>
                <TextInput
                    placeholder="What are you looking up?"
                    onChangeText={(word) => this.setState({word})}
                    value={this.state.word}
                    style={{backgroundColor:"#fff",borderRadius: 10,fontSize:20,width:300}}
                    underlineColorAndroid='transparent'
                    />
                </View>
                {this.state.retrieving?(
                    <ActivityIndicator size="large" color="#56E39F"/>
                ):(
                    <View style={{flexDirection:"row",justifyContent:"space-evenly"}}>
                    <Button
                        title="Cancel"
                        onPress={this.closeModal.bind(this)}
                        style={{height:40}}
                        color="#A9BCD0"
                        />
                    <Button
                        title="Look it up"
                        onPress={this.lookupWord.bind(this)}
                        style={{height:40,backgroundColor:"#56E39F"}}
                        color="#56E39F"
                        />
                    </View>
                )}
                </View>
            </View>
          </View>
        </Modal>

        <ActionButton
          buttonColor="#3d4446"
          onPress={this.addPage}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
    ModalInsideView:{
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor : "#395C6B",
      height: 200 ,
      width: '90%',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#fff'

  },
  swipeout: {
    backgroundColor:"#fdf9f3"
  }
});
