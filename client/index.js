import { ApolloLink } from "apollo-link";
import { ApolloClient } from "apollo-client";
import { gql } from "apollo-boost";
import { fetch } from "isomorphic-fetch";
import { InMemoryCache } from "apollo-cache-inmemory";
import Observable from "zen-observable";
const link = new ApolloLink(operation => {
  return new Observable(observer => {
    window.ReactNativeWebView.postMessage(JSON.stringify(operation));
    window.addEventListener("message", message => {
      console.log(message.data);
      observer.next(message.data);
      observer.complete();
      window.removeEventListener("message", this);
    });
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
