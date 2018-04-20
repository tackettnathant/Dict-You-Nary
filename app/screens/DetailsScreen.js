import React from 'react';
import Entry from '../components/entry'
import PubSub from 'pubsub-js';
import {EVENTS_CHANGED} from '../constants/events'
export default class DetailsScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
          const { params } = navigation.state;

          return {
            title: params ? params.details.word : 'Dict-You-Nary Entry',
          }
    };
    constructor(props) {
        super(props);

    }
    onDelete() {
        // const { params } = navigation.state;
        // if (params.onBackNavigation && typeof params.onBackNavigation==="function") {
        //     //onBackNavigation
        //     console.log("NAV BACK FROM DETAILS")
        //     params.onBackNavigation();
        // }
        PubSub.publish(EVENTS_CHANGED,EVENTS_CHANGED);
        this.props.navigation.popToTop();
    }
    render() {
//<Entry details={this.props.navigation.state.params.details} onDelete={this.onDelete.bind(this)} />
        return (
            <Entry details={this.props.navigation.state.params.details} />
        )
    }
}
