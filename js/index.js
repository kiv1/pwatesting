//Service worker stuff

navigator.serviceWorker.addEventListener('message', function(event) {
    console.log(event.data);
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

//End of service worker stuff


document.querySelector('#Login').addEventListener('click', function() {
    var $form = $("form");
    var data = getFormData($form);

    sendTestForm({
      command: 'add',
      data: data
    }).then(function() {
      // If the promise resolves, just display a success message.
      console.log("Added to cache");
    }).catch(console.log("err"));  // If the promise rejects, show the error.
});


document.querySelector('#sync').addEventListener('click', function() {
    sendTestForm({command: 'keys'})
      .then(function(data) {
      
        // Add each cached URL to the list, one by one.
        data.data.forEach(function(url) {
          console.log(url);
        });
      }).catch(console.log("err")); // If the promise rejects, show the error.
});


function sendTestForm(message){
  console.log(message.data);
  return new Promise(function(resolve, reject) {
    var messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function(event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };

    // This sends the message data as well as transferring messageChannel.port2 to the service worker.
    // The service worker can then use the transferred port to reply via postMessage(), which
    // will in turn trigger the onmessage handler on messageChannel.port1.
    // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
    navigator.serviceWorker.controller.postMessage(message,
      [messageChannel.port2]);
  });
}

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}


