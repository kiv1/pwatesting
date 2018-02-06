//https://stackoverflow.com/questions/30256390/navigator-serviceworker-controller-is-always-null
var cacheName = 'pwatesting';
var filesToCache = [ '/index.html',
  '/js/index.js',
  '/css/style.css'];

//var CACHE_VERSION = 1;
//var CURRENT_CACHES = {
//  'post-message': 'post-message-cache-v' + CACHE_VERSION
//};
const dbName = "DataStorage";


self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

//Stuff
self.clients.matchAll().then(function(clients) {
  clients.forEach(function(client) {
    console.log(client);
    client.postMessage('The service worker just started up.');
  });
});

self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  //var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
  //  return CURRENT_CACHES[key];
  //});
  if (!indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
  }else{
    createDB();
  }
  /*event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return clients.claim();
    }).then(function() {
      // After the activation and claiming is complete, send a message to each of the controlled
      // pages letting it know that it's active.
      // This will trigger navigator.serviceWorker.onmessage in each client.
      return self.clients.matchAll().then(function(clients) {
        return Promise.all(clients.map(function(client) {
          return client.postMessage('The service worker has activated and ' +
            'taken control.');
        }));
      });
    })*/
  //);
});

var storageStuff;
function createDB(){
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

    // Use transaction oncomplete to make sure the objectStore creation is 
    // finished before adding data into it.
    objectStore.transaction.oncomplete = function(event) {
      // Store values in the newly created objectStore.
      var customerObjectStore = db.transaction("DataStore", "readwrite").objectStore("DataStore");
      storageStuff = db;
    };
  }
}

function addData(obj){

  var request = indexedDB.open(dbName, 2);


  request.onerror = function(event) {
    // Handle errors.
    console.log(event);
  };
  request.onsuccess = function(event) {

    var db = event.target.result;
    var customerObject = db.transaction("DataStore", "readwrite");
    var store = customerObject.objectStore("DataStore")
    customerObjectStore.add(obj);
  }
}

function getAll(){


  var request = indexedDB.open(dbName, 2);

  request.onerror = function(event) {
    // Handle errors.
    console.log(event);
  };
  request.onsuccess  = function(event) {

    var db = event.target.result;
    db.transaction("DataStore", 'readonly');
    var customerObjectStore = db.transaction("DataStore", 'readonly');  
    var store = customerObjectStore.objectStore('DataStore');
    return store.getAll();
  }
}

self.addEventListener('message', function(event) {
  console.log('Handling message event:', event);
  //var p = caches.open(CURRENT_CACHES['post-message']).then(function(cache) {
    switch (event.data.command) {
      // This command returns a list of the URLs corresponding to the Request objects
      // that serve as keys for the current cache.
      case 'keys':
        /*return cache.keys().then(function(requests) {
          var urls = requests.map(function(request) {
            return request.url;
          });

          return urls;
        //}).then(function(urls) {
          // event.ports[0] corresponds to the MessagePort that was transferred as part of the controlled page's
          // call to controller.postMessage(). Therefore, event.ports[0].postMessage() will trigger the onmessage
          // handler from the controlled page.
          // It's up to you how to structure the messages that you send back; this is just one example.
          event.ports[0].postMessage({
            error: null,
            urls: urls
          });*/
        //});
        return getAll();
      // This command adds a new request/response pair to the cache.
      case 'add':
        // If event.data.url isn't a valid URL, new Request() will throw a TypeError which will be handled
        // by the outer .catch().
        // Hardcode {mode: 'no-cors} since the default for new Requests constructed from strings is to require
        // CORS, and we don't have any way of knowing whether an arbitrary URL that a user entered supports CORS.
        var request = new Request('https://jsonplaceholder.typicode.com/posts/1', {method: 'POST', body: event.data.url});

        return fetch(request).then(function(response) {
          return response;
        }).then(function() {
          event.ports[0].postMessage({
            error: null
          });
        }).catch(function(error) {
          // If the promise rejects, handle it by returning a standardized error message to the controlled page.
          console.log('Message handling failed:', error);
          //return cache.add(request);
          var id = uuidv4();
          var x = {JSON:event.data.url, ID: id};
          addData(x);
          return event.ports[0].postMessage({
            error: error.toString()
          });
        });
         

      // This command removes a request/response pair from the cache (assuming it exists).
      case 'delete':
        return cache.delete(event.data.url).then(function(success) {
          event.ports[0].postMessage({
            error: success ? null : 'Item was not found in the cache.'
          });
        });

      default:
        // This will be handled by the outer .catch().
        throw Error('Unknown command: ' + event.data.command);
    }
/*  }).catch(function(error) {
    // If the promise rejects, handle it by returning a standardized error message to the controlled page.
    console.log('Message handling failed:', error);

    event.ports[0].postMessage({
      error: error.toString()
    });
  });*/

  // Beginning in Chrome 51, event is an ExtendableMessageEvent, which supports
  // the waitUntil() method for extending the lifetime of the event handler
  // until the promise is resolved.
  if ('waitUntil' in event) {
    event.waitUntil(p);
  }

  // Without support for waitUntil(), there's a chance that if the promise chain
  // takes "too long" to execute, the service worker might be automatically
  // stopped before it's complete.
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}