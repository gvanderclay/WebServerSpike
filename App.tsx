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
    // Get HTML file from require
    let html = require("./usp-nf-dist/basic.html");
    let { uri } = Image.resolveAssetSource(html);

    let path = RNFetchBlob.fs.dirs.DocumentDir + "/" + this.root;
    let dest = path + this.file;

    // Add the directory
    try {
      await RNFetchBlob.fs.unlink(path);
      await RNFetchBlob.fs.mkdir(path);
    } catch (e) {
      console.warn("this one?");
    }

    try {
      if (uri.indexOf("file://") > -1) {
        await RNFetchBlob.fs.unlink(dest);
        await RNFetchBlob.fs.cp(uri, dest);
      } else {
        // Download for development
        const res = await RNFetchBlob.config({
          fileCache: true
        }).fetch("GET", uri);
        await RNFetchBlob.fs.unlink(dest);
        await RNFetchBlob.fs.mv(res.path(), dest);
        console.log(dest);
        console.log(await RNFetchBlob.fs.readFile(dest, "utf8"));
      }
    } catch (e) {
      console.warn(e);
    }

    try {
      this.server = new StaticServer(this.port, this.root, {
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
        <Text>
          {this.state.origin}/{this.file}
        </Text>
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
