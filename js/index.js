//Service worker stuff

navigator.serviceWorker.addEventListener('message', function(event) {
    ChromeSamples.setStatus(event.data);
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


if ('serviceWorker' in navigator) {
  // Set up a listener for messages posted from the service worker.
  // The service worker is set to post a message to all its clients once it's run its activation
  // handler and taken control of the page, so you should see this message event fire once.
  // You can force it to fire again by visiting this page in an Incognito window.
  navigator.serviceWorker.addEventListener('message', function(event) {
    ChromeSamples.setStatus(event.data);
  });

  navigator.serviceWorker.register('service-worker.js')
    // Wait until the service worker is active.
    .then(function() {
      return navigator.serviceWorker.ready;
    })
    // ...and then show the interface for the commands once it's ready.
    .then(showCommands)
    .catch(function(error) {
      // Something went wrong during registration. The service-worker.js file
      // might be unavailable or contain a syntax error.
      ChromeSamples.setStatus(error);
    });
} else {
  ChromeSamples.setStatus('This browser does not support service workers.');
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
      ChromeSamples.setStatus('Added to cache.');
    }).catch(ChromeSamples.setStatus); // If the promise rejects, show the error.
});


document.querySelector('#sync').addEventListener('click', function() {
    sendTestForm({command: 'keys'})
      .then(function(data) {
      
        // Add each cached URL to the list, one by one.
        data.data.forEach(function(url) {
          console.log(url);
        });
      }).catch(ChromeSamples.setStatus); // If the promise rejects, show the error.
});


function sendTestForm(message){
  console.log(message.data);
  var messageChannel = new MessageChannel();
  messageChannel.port1.onmessage = function(event) {
    if (event.data.error) {
      reject(event.data.error);
    } else {
      resolve(event.data);
    }
  };
  navigator.serviceWorker.controller.postMessage(message,[messageChannel.port2]);
}

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}


