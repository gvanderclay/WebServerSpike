window.ReactNativeWebView.postMessage("{books { title }}");

window.addEventListener("message", message => {
  document.getElementById("queryContents").innerHTML = JSON.stringify(message.data, null, 2);
});
