/**
 * Sample React Native Static Server
 * https://github.com/futurepress/react-native-static-server
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  NativeModules,
  SafeAreaView,
  Alert
} from "react-native";

import { WebView } from "react-native-webview";

type Props = {
  port: number;
};

type State = {
  origin: string;
};
export default class App extends Component<Props, State> {
  constructor(opts: Props) {
    super(opts);

    this.state = {
      origin: ""
    };
  }

  render() {
    return (
      <SafeAreaView>
        <Text>{this.state.origin}</Text>
        <View style={{ backgroundColor: "red", height: "100%", width: "100%" }}>
          <WebView
            source={{ uri: "https://online.uspnf.com/uspnf" }}
            style={styles.webview}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  webview: {
    flex: 1,
    marginBottom: 20
  }
});
