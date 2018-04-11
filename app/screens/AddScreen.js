import React from 'react';
import { View, Button,TextInput} from 'react-native';
import WordsAPI from './components/wordsapi';
import Entry from '../components/entry';



class AddScreen extends React.Component {
    static navigationOptions = {
        title:"Add a Definition"
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

            let responseJson = {
    "word": "feline animal",
    "results": [
        {
            "definition": "a large tracked vehicle that is propelled by two endless metal belts; frequently used for moving earth in construction and farm work",
            "partOfSpeech": "noun",
            "synonyms": [
                "caterpillar"
            ],
            "typeOf": [
                "tracked vehicle"
            ],
            "usageOf": [
                "slang"
            ]
        },
        {
            "definition": "feline mammal usually having thick soft fur and no ability to roar: domestic cats; wildcats",
            "partOfSpeech": "noun",
            "synonyms": [
                "true cat"
            ],
            "typeOf": [
                "feline",
                "felid"
            ],
            "hasTypes": [
                "domestic cat",
                "felis domesticus",
                "house cat",
                "felis catus",
                "wildcat"
            ]
        },
        {
            "definition": "a whip with nine knotted cords",
            "partOfSpeech": "noun",
            "synonyms": [
                "cat-o'-nine-tails"
            ],
            "typeOf": [
                "whip"
            ],
            "examples": [
                "British sailors feared the cat"
            ]
        },
        {
            "definition": "the leaves of the shrub Catha edulis which are chewed like tobacco or used to make tea; has the effect of a euphoric stimulant",
            "partOfSpeech": "noun",
            "synonyms": [
                "african tea",
                "arabian tea",
                "kat",
                "khat",
                "qat",
                "quat"
            ],
            "typeOf": [
                "stimulant drug",
                "stimulant",
                "excitant"
            ]
        },
        {
            "definition": "a method of examining body organs by scanning them with X rays and using a computer to construct a series of cross-sectional scans along a single axis",
            "partOfSpeech": "noun",
            "synonyms": [
                "computed axial tomography",
                "computed tomography",
                "computerized axial tomography",
                "computerized tomography",
                "ct"
            ],
            "typeOf": [
                "x-raying",
                "x-radiation"
            ]
        },
        {
            "definition": "an informal term for a youth or man",
            "partOfSpeech": "noun",
            "synonyms": [
                "bozo",
                "guy",
                "hombre",
                "sod"
            ],
            "typeOf": [
                "man",
                "adult male"
            ]
        },
        {
            "definition": "any of several large cats typically able to roar and living in the wild",
            "partOfSpeech": "noun",
            "synonyms": [
                "big cat"
            ],
            "typeOf": [
                "felid",
                "feline"
            ],
            "hasTypes": [
                "tiger",
                "snow leopard",
                "felis onca",
                "sabertooth",
                "saber-toothed tiger",
                "panthera uncia",
                "panthera tigris",
                "jaguar",
                "king of beasts",
                "leopard",
                "liger",
                "lion",
                "panthera pardus",
                "ounce",
                "panthera leo",
                "panther",
                "panthera onca",
                "cheetah",
                "chetah",
                "acinonyx jubatus",
                "tigon",
                "tiglon"
            ],
            "memberOf": [
                "family felidae",
                "felidae"
            ]
        },
        {
            "definition": "eject the contents of the stomach through the mouth",
            "partOfSpeech": "verb",
            "synonyms": [
                "barf",
                "be sick",
                "cast",
                "chuck",
                "disgorge",
                "honk",
                "puke",
                "purge",
                "regorge",
                "regurgitate",
                "retch",
                "sick",
                "spew",
                "spue",
                "throw up",
                "upchuck",
                "vomit",
                "vomit up"
            ],
            "typeOf": [
                "pass",
                "eliminate",
                "excrete",
                "egest"
            ]
        },
        {
            "definition": "a spiteful woman gossip",
            "partOfSpeech": "noun",
            "typeOf": [
                "woman",
                "newsmonger",
                "gossipmonger",
                "rumormonger",
                "rumourmonger",
                "gossiper",
                "gossip",
                "adult female"
            ],
            "derivation": [
                "catty"
            ],
            "examples": [
                "what a cat she is!"
            ]
        },
        {
            "definition": "beat with a cat-o'-nine-tails",
            "partOfSpeech": "verb",
            "typeOf": [
                "whip",
                "flog",
                "lash",
                "lather",
                "slash",
                "strap",
                "trounce",
                "welt"
            ]
        }
    ],
    "syllables": {
        "count": 1,
        "list": [
            "fe","line","an","i","mal"
        ]
    },
    "pronunciation": {
        "all": "kæt"
    },
    "frequency": 4.83
};

            let entry = WordsAPI.convertToEntry(responseJson);
            this.props.navigation.navigate("Details",{details:entry});
            //console.log(entry);
            //this.setState({retrieved:entry});
            //
            // this.setState({definition:responseJson});
            //this.setState({retrieved:true});
            //console.log(this.state.retrieved)
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
            <View>
                    <TextInput
                        placeholder="What are you looking up?"
                        onChangeText={(word) => this.setState({word})}
                        value={this.state.word}/>
                        <Text>{this.state.word}</Text>
                    <Button
                        title="Look it up"
                        onPress={this.lookupWord.bind(this)} />
            </View>



    )
    }
}
