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
  SafeAreaView
} from "react-native";

import StaticServer from "react-native-static-server";
import RNFetchBlob from "rn-fetch-blob";
import { WebView } from "react-native-webview";

type Props = {
  port: number;
};

type State = {
  origin: string;
};
export default class App extends Component<Props, State> {
  port: number = 3030;
  root: string = "www/";
  file: string = "index.html";
  server: StaticServer | null = null;

  constructor(opts: Props) {
    super(opts);

    this.state = {
      origin: ""
    };
  }

  async componentDidMount() {
    let newPath = RNFetchBlob.fs.dirs.MainBundleDir + "/www/";
    let htmlDest = newPath + "index.html";
    let jsDest = newPath + "basic.js";

    try {
      this.server = new StaticServer(this.port, newPath, {
        localOnly: true
      });

      this.server.start().then(origin => {
        this.setState({ origin });
      });
    } catch (e) {
      console.warn("heell");
    }
  }

  componentWillUnmount() {
    if (this.server) {
      this.server.kill();
    }
  }

  render() {
    if (!this.state.origin) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <SafeAreaView>
        <Text>{this.state.origin}</Text>
        <View style={{ backgroundColor: "red", height: "100%", width: "100%" }}>
          <WebView
            source={{ uri: `${this.state.origin}/${this.file}` }}
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
