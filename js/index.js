if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/js/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

$('#TestForm').addEventListener('click', function() {
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
  navigator.serviceWorker.controller.postMessage(message.data);
}

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}