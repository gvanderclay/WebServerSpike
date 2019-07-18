import { ApolloLink } from "apollo-link";
import { ApolloClient } from "apollo-client";
import { gql } from "apollo-boost";

const link = new ApolloLink(operation => {
  return new Observable(observer => {
    const request = {
      ...operation
    };

    window.ReactNativeWebView.postMessage(request);
  });
});

// window.ReactNativeWebView.postMessage("{books { title }}");

window.addEventListener("message", message => {
  document.getElementById("queryContents").innerHTML = JSON.stringify(
    message.data,
    null,
    2
  );
});

const client = new ApolloClient({
  link
});

client.query({
  query: gql`
    {
      books {
        title
      }
    }
  `
});
