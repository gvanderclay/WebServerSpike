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
import { graphql, buildSchema } from "graphql";

type Props = {
  port: number;
};

type State = {
  origin: string;
};

const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const schema = buildSchema(`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }
`);

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  books: () => {
    console.log("henlo");
    return books;
  }
};

export default class App extends Component<Props, State> {
  server: StaticServer | null = null;
  webView: WebView | null = null;

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
            ref={r => (this.webView = r)}
            source={{ uri: `${this.state.origin}` }}
            style={styles.webview}
            onMessage={event => {
              graphql(schema, event.nativeEvent.data, resolvers).then(
                response => {
                  const clientResponseCode = `
                    console.log("EXECUTING");
                    window.postMessage(${JSON.stringify(response)}, "*");
                    true;
                  `;
                  console.log(clientResponseCode);
                  if (this.webView) {
                    this.webView.injectJavaScript(clientResponseCode);
                  }
                }
              );
              Alert.alert(event.nativeEvent.data);
            }}
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
