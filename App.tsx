import React, {Fragment, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';

import StaticServer from 'react-native-static-server';


const App = () => {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const init = async () => {
      const newUrl = await startServer();
      setUrl(newUrl);
    }
    init();
  }, []);
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        {url}
      </SafeAreaView>
    </Fragment>
  );
};

const startServer = async (): Promise<string> => {
  const server = new StaticServer(8080, "./usp-nf-dist", {localOnly: true});
  return await server.start()
}

const styles = StyleSheet.create({ });

export default App;