//startworkers();
const dbName = "DataStorage";

createDB();
function startworkers(){
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
      .then(function(){showMessage('Service worker started!')})
      .catch(function(error) {
        // Something went wrong during registration. The service-worker.js file
        // might be unavailable or contain a syntax error.
        showMessage(error);
      });
  } else {
    showMessage('This browser does not support service workers.');
  }
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
  try{
    var $form = $("form");
    var data = getFormData($form);
    //var string  = data;
    $('form :input').val('');

    //console.log(string);
    postRequest(data);
    /*sendMessage({
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
      showMessage('Service worker has not started!');
      //startworkers();       
      $('#loading').hide();
    }); // If the promise rejects, show the error.*/
  }catch(error){
    showMessage('Service worker has not started!');
    //startworkers();       
    $('#loading').hide();
  }
});

function stopLoading(scount,ecount,total){
  if((scount+ecount) == total){
    if(ecount >0){
      showMessage(ecount+'/'+total+' had problems. Please sync again.')
    }
    $('#loading').hide();
  }
}

function showMessage(msg){
  $('#message').text(msg)
}

document.querySelector('#sync').addEventListener('click', function() {
  try{
      startDoing();
      var successCount = 0;
      var errorCount = 0;

      var allData = getAllData();
      allData.forEach(function(element) {
        postRequestSync(element);
      });

    /*if(navigator.onLine){
      sendMessage({command: 'keys'})
        .then(function(data) {
          sendMessage({
            command: 'clear'
          }).then(function(events) {
            // If the promise resolves, just display a success message.
            if(events.error == null){
              showMessage('Delete success');
              if(data.urls.length > 0){
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
                      successCount++;
                      stopLoading(successCount, errorCount, data.urls.length);
                    }else{
                      showMessage('Post fail and stored in DB');
                      errorCount++;
                      stopLoading(successCount, errorCount, data.urls.length);
                    }
                  }).catch(function(){
                      showMessage('Post fail and stored in DB')
                      errorCount++;
                      stopLoading(successCount, errorCount, data.urls.length);
                    });
                });
              }else{
                $('#loading').hide();
              }
            }else{
              showMessage('Delete fail and stored in DB');
            }
          }).catch(showMessage('Delete fail and stored in DB'));

        }).catch(showMessage("Service worker suck so just keep refreshing and closing"));
      }else{
        showMessage('No internet connection to sync');
        $('#loading').hide();
      } // If the promise rejects, show the error.*/
    }catch(error){
      showMessage('Seomething went wrong!');       
      $('#loading').hide();
    }
});


function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function postRequest(data){
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://sheetsu.com/apis/v1.0su/b530c24e1721",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "Postman-Token": "6564c79f-42ce-2a60-a95f-53ffde04ba8f"
    },
    "processData": false,
    "data":data
  }

  var id = uuidv4();
  var x = { JSON: data, ID: id, sentToServer:false };

  $.ajax(settings).done(function (response) {
    showMessage("Post success!");
    x.sentToServer = true;
    addUpdateData(x);
    $('#loading').hide();
  }).fail(function( jqXHR, textStatus, errorThrown ) {
    showMessage("Something went wrong!");
    x.sentToServer = false;
    addUpdateData(x);
    $('#loading').hide();
  });
}

function postRequestSync(obj){
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://sheetsu.com/apis/v1.0su/b530c24e1721",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
    },
    "processData": false,
    "data":x.JSON
  }

  $.ajax(settings).done(function (response) {
    showMessage("Post success!");
    x.sentToServer = true;
    addUpdateData(x);
    $('#loading').hide();
  }).fail(function( jqXHR, textStatus, errorThrown ) {
    showMessage("Something went wrong!");
    console.log(errorThrown);
    x.sentToServer = false;
    addUpdateData(x);
    $('#loading').hide();
  });
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var storageStuff;

function createDB() {
    var request = indexedDB.open(dbName, 2);
    request.onerror = function(event) {
        // Handle errors.
        console.log(event);
    };
    request.onupgradeneeded = function(event) {
        var db = event.target.result;

        // Create an objectStore to hold information about our customers. We're
        // going to use "ssn" as our key path because it's guaranteed to be
        // unique - or at least that's what I was told during the kickoff meeting.
        var objectStore = db.createObjectStore("DataStore", { keyPath: "ID" });

        // Create an index to search customers by name. We may have duplicates
        // so we can't use a unique index.
        objectStore.createIndex("JSON", "JSON", { unique: false });
        objectStore.createIndex("sentToServer", "sentToServer", { unique: false });


        // Use transaction oncomplete to make sure the objectStore creation is 
        // finished before adding data into it.
        objectStore.transaction.oncomplete = function(event) {
            // Store values in the newly created objectStore.
            var customerObjectStore = db.transaction("DataStore", "readwrite").objectStore("DataStore");
            storageStuff = db;
        };
    }
}

function addUpdateData(obj) {

    var request = indexedDB.open(dbName, 2);


    request.onerror = function(event) {
        // Handle errors.
        console.log(event);
    };
    request.onsuccess = function(event) {

        var db = event.target.result;
        var customerObject = db.transaction("DataStore", "readwrite");
        var store = customerObject.objectStore("DataStore")
        store.put(obj);
    }
}

function clearData() {

    var request = indexedDB.open(dbName, 2);


    request.onerror = function(event) {
        // Handle errors.
        console.log(event);
        return false;
    };
    request.onsuccess = function(event) {

        var db = event.target.result;
        var customerObject = db.transaction("DataStore", "readwrite");
        var store = customerObject.objectStore("DataStore")
        var datas = store.clear();

        datas.onsuccess = function() {
            return true;
        }
    }
}

function deleteEvent(key) {

    var request = indexedDB.open(dbName, 2);


    request.onerror = function(event) {
        // Handle errors.
        console.log(event);
        return false;
    };
    request.onsuccess = function(event) {

        var db = event.target.result;
        var customerObject = db.transaction("DataStore", "readwrite");
        var store = customerObject.objectStore("DataStore")
        var datas = store.delete(key);

        datas.onsuccess = function() {
          return true;
        }
    }
}

function getAllData() {

    var request = indexedDB.open(dbName, 2);

    request.onerror = function(event) {
        // Handle errors.
        console.log(event);
        return false;
    };
    request.onsuccess = function() {

        var db = event.target.result;
        db.transaction("DataStore", 'readonly');
        var customerObjectStore = db.transaction("DataStore", 'readonly');
        var store = customerObjectStore.objectStore('DataStore');
        var datas = store.getAll();

        datas.onsuccess = function() {
            return datas;
        }
    }
}