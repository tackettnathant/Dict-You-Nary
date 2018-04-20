import React from 'react';
import { View, Button,TextInput,Text,Modal} from 'react-native';
import WordsAPI from '../components/wordsapi';
import Entry from '../components/entry';
import {entryJSON} from '../testdata'


export default class AddScreen extends React.Component {
    static navigationOptions = {
        title:"Add a Definition"
    }

    constructor(props) {
        super(props);
        this.state={
            word:null
        }
    }

    async lookupWord() {

        //TODO: Uncomment
        //if (!this.state.word) return;
        try {
            //TODO: uncomment
            // let url = "https://wordsapiv1.p.mashape.com/words/"+encodeURIComponent(this.state.word);
            // let key = "88ZU9R30jWmsh8hEb9JHPDRFPOvCp1JFqLIjsndmcVYkUgAuuL";
            // //
            // let response = await fetch(url, {headers:{"X-Mashape-Key":key}});
            // let responseJson = await response.json();

            let responseJson =

            let entry = WordsAPI.convertToEntry(responseJson);
            this.props.navigation.navigate("Details",{details:entry});
            //console.log(entry);
            //this.setState({retrieved:entry});
            //
            // this.setState({definition:responseJson});
            //this.setState({retrieved:true});
            //console.log(this.state.retrieved)
            if (this.props.onLookUp && typeof this.props.onLookUp==="function") {
                this.props.onLookUp(entry);
            }
        } catch (error) {
            this.setState({retrieved:{word:this.state.word}})
            console.log(error)
        }
        //console.log(this.state.word);
}

    constructor(props) {
        super(props);
        this.state = {
            word:null,
//            retrieved:null,
            definition:{}
        }
    }
    render() {
        return (
            <Modal
              animationType="slide"
              transparent={false}
              onRequestClose={() => {
                  if (this.props.onClose && typeof this.props.onClose==="function"){
                      this.props.onClose();
                  }
              }}>
              <View style={{marginTop: 22,paddingLeft:20,paddingRight:20}}>
                <View style={{backgroundColor:"#fff";width:400}}>
                <TextInput
                    placeholder="What are you looking up?"
                    onChangeText={(word) => this.setState({word})}
                    value={this.state.word}
                    style={{backgroundColor:"#fff"}}
                    />
                    <Text>{this.state.word}</Text>
                    </View>
                <Button
                    title="Look it up"
                    onPress={this.lookupWord.bind(this)} />

              </View>
            </Modal>
