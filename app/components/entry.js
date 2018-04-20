import React from 'react';
import { Text, Image, StyleSheet,View,TextInput,ScrollView,Platform,Dimensions,TouchableHighlight,Modal,Button } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons'
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import Swipeout from 'react-native-swipeout';
import DB from '../db'
import Message from './message'
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import ActionButton from 'react-native-action-button';
import PubSub from 'pubsub-js';
import {EVENTS_CHANGED} from '../constants/events'
import { NavigationActions } from 'react-navigation';
class Entry extends React.Component {
    static navigationOptions = ({ navigation }) => {
          const { params } = navigation.state;

          return {
            title: params ? params.details.word : 'Dict-You-Nary Entry',
          }
    };
    constructor(props) {
        super(props);

        let entry = {...this.props.navigation.state.params.details};
        if (!entry.definitions) {
            entry.definitions=[{partOfSpeech:"part of speech",definition:"definition",example:null}];
        }
        if (!entry.image){
            entry.image={uri:null,height:null,width:null};
        }

/*
{...this.props.navigation.state.params.details,
    definitions:this.props.navigation.state.params.details.definitions||[{partOfSpeech:"part of speech",definition:"definition",example:null}],
    image:this.props.navigation.state.params.details.image||{uri:null,height:null,width:null}
}
*/

        this.state = {
            entry:entry,
            //entryId:this.props.entryId || null,
            dimensions:null,
            modalVisible:false,
            editIndex:null //TODO: This should be passed to a component with a callback to update
        }
        this.keyCount = 0;
        this.getKey = this.getKey.bind(this);
    }

    async saveEntry() {
        try {
            let ne =await DB.insertOrUpdate(this.state.entry);
            this.setState({entry:ne});
            this.refs.alertMessage.ShowMessageFunction("Saved");
            PubSub.publish(EVENTS_CHANGED,EVENTS_CHANGED);
        } catch (error) {
            this.refs.alertMessage.ShowMessageFunction(error.message);
        }
    }

    async deleteEntry() {

        if (this.state.entry.key){
            await DB.delete(this.state.entry.key);
        }
        // if (this.props.onDelete && typeof this.props.onDelete=="function") {
        //     this.props.onDelete(this.state.entry);
        // }
        PubSub.publish(EVENTS_CHANGED,EVENTS_CHANGED);
//         const resetAction = NavigationActions.reset({
//   index: 0,
//   actions: [NavigationActions.navigate({ routeName: 'Home' })],
// });
// this.props.navigation.dispatch(resetAction);
        //this.props.navigation.navigate("Home");
        //this.props.navigation.pop();
        this.setState({deleted:true})
    }

    getKey(){
        return this.keyCount++;
    }
    componentDidMount() {
        if (this.state.entryId){
            this.setState({entry:DB.retrieve(this.state.entryId)})
        }
        let image = {uri:"file:////storage/emulated/0/DCIM/Camera/IMG_20180401_180746.jpg",height:null,width:null};
        Image.getSize(image.uri,
            (width,height)=>{
                image.height=height;
                image.width=width;
                this.setState({entry:{...this.state.entry,image:image}});
                this.setState({dimensions:this.computeDimensions(image)});
                //console.log(this.state.dimensions)
            },(err)=>console.log("ERROR: " +err));


    }

    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }

    updateDefinition(field,val) {

        this.setState({entry:{
            ...this.state.entry,
            definitions: this.state.entry.definitions.map((obj,ind)=>ind==this.state.editIndex?
            {partOfSpeech:field=="partOfSpeech"?val:obj.partOfSpeech,
            definition:field=="definition"?val:obj.definition,
            example:field=="example"?val:obj.example}
            :obj)
        }})
    }

    doneWithAction() {
        /*
        ActionButton tries to update state. Since popToTop is sync, it causes state to be updated after umounting. This prevents that.
        */
        if (this.state.deleted) {
            setTimeout(this.props.navigation.popToTop,0);
        }
    }
    updateDefFn(index) {
        return (def)=>this.updateDefinition(index,def);
    }
    extractPronunciation(definition) {
        if (definition.pronunciation && definition.pronunciation.all) {
            return definition.pronunciation.all;
        }
        return null;
    }

    syllablesOrWord(entry) {
        return entry.syllables || entry.word;
    }

    computeDimensions(image) {

        //Image.getSize(image,(height,width)=>console.log("GOT SIZE: "+res+", "+dos),(err)=>console.log("ERROR: " +err));
        let {width} = Dimensions.get('window')

        let imageWidth = Math.floor(width*.4);
        let viewWidth = width - imageWidth;

        let height = Math.floor(imageWidth * this.computeImageRatio(image))

        return {image: {width:imageWidth,height},
                view: {width:viewWidth,height}};
    }

    computeImageRatio(image) {
        //let icon =  require(" "+image+" ");
        // let source = resolveAssetSource({uri:image});
        // console.log("SOURCE: ")
        // console.log(source);

        let {width,height} = image;

        let ratio = 1;
        if (width && height) {
            ratio = height/width;
        }
        //console.log("RATIO: " +ratio);
        return ratio;

    }

    deleteDefinition(index) {
        //this.setModalVisible(true);
        //console.log("DELETING INDEX: " +index)
        this.setState(
            {
                entry: {...this.state.entry,
                definitions: this.state.entry.definitions.filter((d,i)=>i!=index)}
            }
        )
    }

    editDefinition(index) {
        this.setState({editIndex:index});
        this.setModalVisible(true);
    }

    getEditValue(field){
        return this.state.entry.definitions
            && this.state.editIndex != null
             && this.state.entry.definitions[this.state.editIndex]
             ?
             this.state.entry.definitions[this.state.editIndex][field]
             :
             null
    }




    render() {

        let padding = 10;

        //let thePath='../../images/goose.jpg';
        let thePath="file:////storage/emulated/0/DCIM/Camera/IMG_20180401_180746.jpg";
        let {width,height} = this.computeDimensions(thePath);
        //onLongPress={()=>this.deleteDefinition(index)}
        let definitions = this.state.entry.definitions.map((def,index)=>{
            let swipeoutBtns = [
                {
                  text: 'Edit',
                  onPress: ()=>this.editDefinition(index),
                  type: "primary",
                  backgroundColor:"#3498db"
              },
              {
                text: 'Delete',
                onPress: ()=>this.deleteDefinition(index),
                type: "delete",
                backgroundColor:"#66101F"
            }

            ]
            return (
                <Swipeout style={styles.swipeout}  key={this.getKey()} right={swipeoutBtns}  >
                    <View key={this.getKey()}>
                    {index>0?
                                            (<Text style={styles.partOfSpeech} key={this.getKey()}>{def.partOfSpeech}</Text>)
                                        :<Text key={this.getKey()}></Text>}
                    <View style={styles.defContainter}>
                        <Text style={styles.definition} key={this.getKey()}>{def.definition}</Text>
                        {def.example?(
                            <Text style={styles.example} key={this.getKey()}>{def.example}</Text>
                        ):<Text key={this.getKey()}></Text>}
                    </View>

                    </View>
                </Swipeout>
            )
        });

        return (
            <View style={styles.mainContainer}>
            <Message ref="alertMessage" position="bottom"/>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                  this.setModalVisible(false);
              }}>
              <View style={{marginTop: 22,paddingLeft:20,paddingRight:20,flex:1, justifyContent: 'center', alignItems: 'center'}}>
                  <View style={styles.ModalInsideView}>
                      <View style={{flex:1,justifyContent:"center"}}>
                            <View style={{paddingBottom:20}}>
                            <Text style={styles.modalText}>Part of Speech</Text>
                            <TextInput underlineColorAndroid='transparent' style={styles.modalInput} value={this.getEditValue("partOfSpeech")} multiline={false} onChangeText={(text)=>this.updateDefinition("partOfSpeech",text)}/>
                            </View>
                            <View style={{paddingBottom:20}}>
                            <Text style={styles.modalText}>Definition</Text>
                            <TextInput underlineColorAndroid='transparent' style={styles.modalInput} value={this.getEditValue("definition")} multiline={true} onChangeText={(text)=>this.updateDefinition("definition",text)}/>
                            </View>
                            <View style={{paddingBottom:20}}>
                            <Text style={styles.modalText}>Example</Text>
                            <TextInput underlineColorAndroid='transparent' style={styles.modalInput} value={this.getEditValue("example")} multiline={true} onChangeText={(text)=>this.updateDefinition("example",text)}/>
                            </View>
                            <View style={{flexDirection:"row",justifyContent:"space-evenly"}}>
                            <Button
                                title="Done"
                                onPress={()=>{this.setModalVisible(!this.state.modalVisible)}}
                                style={{height:40,backgroundColor:"#56E39F"}}
                                color="#56E39F"
                                />
                            </View>

                    </View>
                </View>
              </View>
            </Modal>










            <ScrollView style={{paddingLeft:10,paddingRight:10,paddingBottom:100}}>
                    {this.state.dimensions?
                    (
                    <View style={styles.container}>
                        <View style={{width:this.state.dimensions.view.width,height:this.state.dimensions.view.height}}>

                            <Text style={styles.word} >{this.syllablesOrWord(this.state.entry)}</Text>
                            {this.state.entry.pronunciation?

                                (
                                        <Text style={styles.pronunciation}> /{this.state.entry.pronunciation}/ </Text>
                                )
                                        :

                                ""
                            }
                            <Text style={styles.partOfSpeech}>noun</Text>
                        </View>
                        <View style={{width:this.state.dimensions.image.width,height:this.state.dimensions.image.height}}>
                            <Image style={{flex:1,height:undefined,width:undefined}} resizeMode="contain" source={{uri:thePath}} />
                        </View>
                    </View>
                    ):(
                        <View style={{flex:1,backgroundColor:"skyblue"}}></View>
                    )}

                <View style={{flex:1}}>
                    {definitions}
                </View>



                </ScrollView>

                {!this.state.swipeOpen?
                (<ActionButton buttonColor="#3d4446" onReset={this.doneWithAction.bind(this)}>
                  <ActionButton.Item buttonColor='#66101F' title="Delete" onPress={() => this.deleteEntry()}>
                    <Icon name="delete" style={styles.actionButtonIcon} />
                  </ActionButton.Item>
                  <ActionButton.Item buttonColor='#3498db' title="Save" onPress={() => {this.saveEntry()}}>
                    <Icon name="save" style={styles.actionButtonIcon} />
                  </ActionButton.Item>
                  <ActionButton.Item buttonColor='#63A088' title="Share" onPress={() => {}}>
                    <Icon name="share" style={styles.actionButtonIcon} />
                  </ActionButton.Item>
                </ActionButton>)
                :<View></View>
            }
                </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer :{
        backgroundColor:"#fdf9f3",
        flex:1

    },
    messageHolder: {
        alignSelf:"stretch",
        justifyContent: "center",
        height:100
    },
    animatedMessageView:
    {
       marginHorizontal: 30,
       paddingHorizontal: 25,
       paddingVertical: 10,
       borderRadius: 25,
       zIndex: 9999,
       position: 'absolute',
       justifyContent: 'center'
    },

    MessageBoxInsideText:
    {
       fontSize: 15,
       alignSelf: 'stretch',
       textAlign: 'center'
   },
  swipeout: {
    backgroundColor:"#fdf9f3"
  },
  container: {
    flex: 1,
    flexDirection: "row"
  },
  wordContainer: {
      flex: 1,
  },
  word: {
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      fontWeight: 'bold',
      color:"#000",
      fontSize:24,
      flex:1,
      paddingTop:4


  },
  picContainer: {
      flex:1,
      justifyContent: 'center',
    alignItems: 'center',
    height:150
  },
  pic: {
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
  },
  pronunciation: {
      fontSize:24,
      color:"#000",
      flex:1
  },
  partOfSpeech: {
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      fontSize:18,
      fontStyle:"italic",
  },
  definition: {
      fontSize:18,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      color:"#000"
  },
  defContainter: {
      paddingLeft:4
  },
  example: {
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      fontSize:18,
      fontStyle:"italic",
  },
  actionButtonIcon: {
  fontSize: 20,
  height: 22,
  color: 'white',
},
ModalInsideView:{
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor : "#395C6B",
  height: "80%" ,
  width: '90%',
  borderRadius:10,
  borderWidth: 1,
  borderColor: '#fff',
  padding:20

},
    modalText: {
        fontSize:20,
        color:"#fff"
    },
    modalInput: {
        backgroundColor:"#fff",
        borderRadius: 10,
        fontSize:18
    }


});

export default Entry;
