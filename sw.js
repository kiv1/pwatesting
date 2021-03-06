//https://stackoverflow.com/questions/30256390/navigator-serviceworker-controller-is-always-null
var cacheName = 'pwatesting';
var filesToCache = ['/index.html',
    '/js/index.js',
    '/css/style.css',
    '/image/giphy.gif',
    '/image/icon.png'
];

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

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open(cacheName).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                return response || fetch(event.request).then(function(response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
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
    } else {
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

function addData(obj) {

    var request = indexedDB.open(dbName, 2);


    request.onerror = function(event) {
        // Handle errors.
        console.log(event);
    };
    request.onsuccess = function(event) {

        var db = event.target.result;
        var customerObject = db.transaction("DataStore", "readwrite");
        var store = customerObject.objectStore("DataStore")
        store.add(obj);
    }
}

function clearData(events) {

    var request = indexedDB.open(dbName, 2);


    request.onerror = function(event) {
        // Handle errors.
        console.log(event);
    };
    request.onsuccess = function(event) {

        var db = event.target.result;
        var customerObject = db.transaction("DataStore", "readwrite");
        var store = customerObject.objectStore("DataStore")
        var datas = store.clear();

        datas.onsuccess = function() {
            return events.ports[0].postMessage({
                error: null,
            });
        }
    }
}

function deleteEvent(events, key) {

    var request = indexedDB.open(dbName, 2);


    request.onerror = function(event) {
        // Handle errors.
        console.log(event);
    };
    request.onsuccess = function(event) {

        var db = event.target.result;
        var customerObject = db.transaction("DataStore", "readwrite");
        var store = customerObject.objectStore("DataStore")
        var datas = store.delete(key);

        datas.onsuccess = function() {
            return events.ports[0].postMessage({
                error: null,
            });
        }
    }
}

function getAllData(events) {

    var request = indexedDB.open(dbName, 2);

    request.onerror = function(event) {
        // Handle errors.
        console.log(event);
    };
    request.onsuccess = function(event) {

        var db = event.target.result;
        db.transaction("DataStore", 'readonly');
        var customerObjectStore = db.transaction("DataStore", 'readonly');
        var store = customerObjectStore.objectStore('DataStore');
        var datas = store.getAll();

        datas.onsuccess = function() {
            return events.ports[0].postMessage({
                error: null,
                urls: datas.result
            });
        }
    }
}

self.addEventListener('message', function(event) {
    console.log('Handling message event:', event);
    //var p = caches.open(CURRENT_CACHES['post-message']).then(function(cache) {
    switch (event.data.command) {
        // This command returns a list of the URLs corresponding to the Request objects
        // that serve as keys for the current cache.
        case 'keys':
            return getAllData(event)


            // This command adds a new request/response pair to the cache.
        case 'add':
            // If event.data.url isn't a valid URL, new Request() will throw a TypeError which will be handled
            // by the outer .catch().
            // Hardcode {mode: 'no-cors} since the default for new Requests constructed from strings is to require
            // CORS, and we don't have any way of knowing whether an arbitrary URL that a user entered supports CORS.
            var id = uuidv4();
            var x = { JSON: event.data.url, ID: id, sentToServer:false };

            var data = new FormData();
            data.append( "Username", event.data.url.Username );
            data.append( "Password", event.data.url.Password );

            return fetch("https://sheetsu.com/apis/v1.0su/b530c24e1721",
            {
                method: "POST",
                body: data
            })
            .then(function(res){
              x.sentToServer = true;
                addData(x);
                event.ports[0].postMessage({
                    error: null
                });
            })
            .catch(function(error){                
                x.sentToServer = false;
                addData(x);
                event.ports[0].postMessage({
                    error: 'Something went wrong!'
                }) 
            });


            // This command removes a request/response pair from the cache (assuming it exists).
        case 'clear':
            return clearData(event);

        case 'delete':
            return deleteEvent(event, event.data.key);

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
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}