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
  server: StaticServer | null = null;

  constructor(opts: Props) {
    super(opts);

    this.state = {
      origin: ""
    };
  }

  async componentDidMount() {
    let newPath = RNFetchBlob.fs.dirs.MainBundleDir + "/www/";

    try {
      this.server = new StaticServer(3030, newPath, {});

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
            source={{ uri: `${this.state.origin}` }}
            style={styles.webview}
            onMessage={event => Alert.alert(event.nativeEvent.data)}
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
