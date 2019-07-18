import { ApolloLink } from "apollo-link";
import { ApolloClient } from "apollo-client";
import { gql } from "apollo-boost";
import { fetch } from "isomorphic-fetch";
import { InMemoryCache } from "apollo-cache-inmemory";
import Observable from "zen-observable";

const messageObservers = {};

const handleMessage = message => {
  console.log("RECEIVED MESSAGE, ", message);
  const messageId = message.data.id;
  const observer = messageObservers[messageId];
  if (!observer) {
    console.warn("No observer found for message with id: ", messageId);
    return;
  }
  observer.next(message.data.response);
  observer.complete();
};

window.addEventListener("message", handleMessage);

let count = 0;

const link = new ApolloLink(operation => {
  return new Observable(observer => {
    const id = count;
    count++;
    const request = Object.assign(operation, { id });
    messageObservers[id] = observer;
    window.ReactNativeWebView.postMessage(JSON.stringify(request));
  });
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  fetchOptions: { fetch },
  cache
});

client
  .query({
    query: gql`
      {
        books {
          title
        }
      }
    `
  })
  .then(result => {
    if (result) {
      document.getElementById(
        "queryContents"
      ).innerHTML += `<p>${JSON.stringify(result.data, null, 2)}</p>`;
    } else {
      document.getElementById("queryContents").innerHTML = "undefined";
    }
  });

client
  .query({
    query: gql`
      {
        books {
          author
        }
      }
    `
  })
  .then(result => {
    if (result) {
      document.getElementById(
        "queryContents"
      ).innerHTML += `<p>${JSON.stringify(result.data, null, 2)}</p>`;
    } else {
      document.getElementById("queryContents").innerHTML = "undefined";
    }
  });
