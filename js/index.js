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

$('#TestForm').submit(function () {
  sendTestForm();
  return false;
});

function sendTestForm(){
  var $form = $("form");
  var data = getFormData($form);
  console.log(data);
  var messageChannel = new MessageChannel();
  messageChannel.port1.onmessage = function(event) {
    if (event.data.error) {
      reject(event.data.error);
    } else {
      resolve(event.data);
    }
  };
  navigator.serviceWorker.controller.postMessage(data);
}

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}