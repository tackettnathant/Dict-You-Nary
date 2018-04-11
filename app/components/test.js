import ViewShot from "react-native-view-shot";
import React, { Component } from 'react';
import {
  Text
} from 'react-native';
class TestShot extends Component {
  componentDidMount () {
    this.refs.viewShot.capture().then(uri => {
      console.log("do something with ", uri);
    });
  }
  render() {
    return (
      <ViewShot ref="viewShot" options={{ format: "jpg", quality: 0.9 }}>
        <Text>...Something to rasterize...</Text>
      </ViewShot>
    );
  }
}

export default TestShot
