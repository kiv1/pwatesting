//Service worker stuff

if ('serviceWorker' in navigator) {
  // Set up a listener for messages posted from the service worker.
  // The service worker is set to post a message to all its clients once it's run its activation
  // handler and taken control of the page, so you should see this message event fire once.
  // You can force it to fire again by visiting this page in an Incognito window.
  navigator.serviceWorker.addEventListener('message', function(event) {
    console.log(event.data);
  });

  navigator.serviceWorker.register('/sw.js')
    // Wait until the service worker is active.
    .then(function() {
      return navigator.serviceWorker.ready;

    })
    // ...and then show the interface for the commands once it's ready.
    .then()
    .catch(function(error) {
      // Something went wrong during registration. The service-worker.js file
      // might be unavailable or contain a syntax error.
      showMessage(error);
    });
} else {
  showMessage('This browser does not support service workers.');
}

function sendMessage(message) {
  // This wraps the message posting/response in a promise, which will resolve if the response doesn't
  // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
  // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
  // a convenient wrapper.
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
//End of service worker stuff

function startDoing(){
  $('#loading').show();
}

document.querySelector('#Login').addEventListener('click', function() {
  startDoing();

  var $form = $("form");
  var data = getFormData($form);
  var string  = JSON.stringify(data);
  $('form :input').val('');

  console.log(string);
  sendMessage({
    command: 'add',
    url: string
  }).then(function(events) {
    // If the promise resolves, just display a success message.
    if(events.error == null){
      showMessage('Post success');
      $('#loading').hide();

    }else{
      showMessage('Post fail and stored in DB');
      $('#loading').hide();

    }
  }).catch(function(){
    showMessage('Post fail and stored in DB');       
    $('#loading').hide();
  }); // If the promise rejects, show the error.
});

function stopLoading(count, total){
  $('#loading').hide();
}

function showMessage(msg){
  $('#message').text(msg)
}

document.querySelector('#sync').addEventListener('click', function() {
    startDoing();
    var count = 0;
    sendMessage({command: 'keys'})
      .then(function(data) {
        sendMessage({
          command: 'clear'
        }).then(function(events) {
          // If the promise resolves, just display a success message.
          if(events.error == null){
            showMessage('Delete success');
            data.urls.forEach(function(url) {
              console.log(url.JSON);
              var key = url.ID;
              sendMessage({
                  command: 'add',
                  url: url.JSON
                }).then(function(events) {
                  // If the promise resolves, just display a success message.
                  if(events.error == null){
                    showMessage('Post success');
                    count++;
                    stopLoading(count, data.urls.length);
                  }else{
                    showMessage('Post fail and stored in DB');
                    count++;
                    stopLoading(count, data.urls.length);
                  }
                }).catch(function(){
                    showMessage('Post fail and stored in DB')
                    count++;
                    stopLoading(count, data.urls.length);
                  });
            });
          }else{
            showMessage('Delete fail and stored in DB');
          }
        }).catch(showMessage('Delete fail and stored in DB'));

      }).catch(showMessage("Service worker suck so just keep refreshing and closing")); // If the promise rejects, show the error.
});


function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}


