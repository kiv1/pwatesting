const dbName = "DataStorage";
const url = "https://sheetsu.com/apis/v1.0su/415400067ae6";
// createDB();



function startDoing() {
    $('#loading').show();
}

document.querySelector('#Login').addEventListener('click', function() {
    startDoing();
    try {
        var $form = $("form");
        var data = getFormData($form);
        $('form :input').val('');

        //console.log(string);
        postRequest(JSON.stringify(data));
    } catch (error) {
        console.log(error);
        showMessage('Service worker has not started!');
        //startworkers();       
        $('#loading').hide();
    }
});

function stopLoading(scount, ecount, total) {
    if ((scount + ecount) == total) {
        if (ecount > 0) {
            showMessage(ecount + '/' + total + ' had problems. Please sync again.')
        }
        $('#loading').hide();
    }
}

function showMessage(msg) {
    $('#message').text(msg)
}

document.querySelector('#sync').addEventListener('click', function() {
    try {
        startDoing();
        var successCount = 0;
        var errorCount = 0;

        getAllData();
    } catch (error) {
        showMessage('Seomething went wrong!');
        $('#loading').hide();
    }
});


function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function postRequest(data) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "Postman-Token": "6564c79f-42ce-2a60-a95f-53ffde04ba8f"
        },
        "processData": false,
        "data": data
    }

    // var id = uuidv4();
    // var x = { JSON: data, ID: id, sentToServer: false };
    data.sentToServer = false;
    $.ajax(settings).done(function(response) {
        showMessage("Post success!");
        data = JSON.parse(data);
        data.sentToServer = true;
        addUpdateData(data);
        $('#loading').hide();
    }).fail(function(jqXHR, textStatus, errorThrown) {
        showMessage("Something went wrong!");
        data = JSON.parse(data);
        data.sentToServer = false;
        console.log(typeof(data));
        addUpdateData(data);
        $('#loading').hide();
    });
}
var promises = [];

function postRequestSync(obj) {
    var data = obj;
    var string = JSON.stringify(obj);
    console.log(string);
    var settings = {
        "async": false,
        "crossDomain": true,
        "url": url,
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        },
        "processData": false,
        "data": string
    }

    var request = $.ajax(settings).done(function(response) {
        showMessage("Post success!")
        $('#loading').hide();
    }).fail(function(jqXHR, textStatus, errorThrown) {
        showMessage("Something went wrong!");
        $('#loading').hide();
    });

    promises.push(request);
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var storageStuff;

// function createDB() {
//     var request = indexedDB.open(dbName, 2);
//     request.onerror = function(event) {
//         // Handle errors.
//         console.log(event);
//     };
//     request.onupgradeneeded = function(event) {
//         var db = event.target.result;
//         var objectStore = db.createObjectStore("DataStore", { keyPath: "ID" });
//         objectStore.createIndex("JSON", "JSON", { unique: false });
//         objectStore.createIndex("sentToServer", "sentToServer", { unique: false });
//         objectStore.transaction.oncomplete = function(event) {
//             var customerObjectStore = db.transaction("DataStore", "readwrite").objectStore("DataStore");
//             storageStuff = db;
//         };
//     }
// }

function addUpdateData(obj) {
    localStorage.setItem(uuidv4(), JSON.stringify(obj));

    // var request = indexedDB.open(dbName, 2);


    // request.onerror = function(event) {
    //     // Handle errors.
    //     console.log(event);
    // };
    // request.onsuccess = function(event) {

    //     var db = event.target.result;
    //     var customerObject = db.transaction("DataStore", "readwrite");
    //     var store = customerObject.objectStore("DataStore")
    //     store.put(obj);
    // }
}

function clearData(results) {
    function startDoing() {
        $('#loading').show();
    }
    console.log("cleardata");
    console.log(results);
    results.forEach(function(element) {
        postRequestSync(element);
    });
    localStorage.clear();
    $('#loading').hide();
    // Promise.all(promises).then(function() {
    //     $('#loading').hide();
    // })
    // $.when.apply(null, promises).done(function() {

    // })

    // var request = indexedDB.open(dbName, 2);


    // request.onerror = function(event) {
    //     // Handle errors.
    //     console.log(event);
    //     return false;
    // };
    // request.onsuccess = function(event) {
    //     promises = [];
    //     var db = event.target.result;
    //     var customerObject = db.transaction("DataStore", "readwrite");
    //     var store = customerObject.objectStore("DataStore")
    //     var datas = store.clear();

    //     datas.onsuccess = function() {
    //         results.forEach(function(element) {
    //             postRequestSync(element);
    //         });
    //         $.when.apply(null, promises).done(function() {
    //             $('#loading').hide();
    //         })
    //     }
    // }
}

function deleteEvent(key) {

    // var request = indexedDB.open(dbName, 2);


    // request.onerror = function(event) {
    //     // Handle errors.
    //     console.log(event);
    //     return false;
    // };
    // request.onsuccess = function(event) {

    //     var db = event.target.result;
    //     var customerObject = db.transaction("DataStore", "readwrite");
    //     var store = customerObject.objectStore("DataStore")
    //     var datas = store.delete(key);

    //     datas.onsuccess = function() {
    //         return true;
    //     }
    // }
}

function getAllData() {
    console.log("getalldata");
    var arrOfDataStr = []
    var arrOfDataJson = []
    for (var i = 0; i < localStorage.length; i++) {
        arrOfDataStr.push(localStorage.getItem(localStorage.key(i)));
    }
    for (var i = 0; i < arrOfDataStr.length; i++) {
        arrOfDataJson.push(JSON.parse(arrOfDataStr[i]));
    }
    clearData(arrOfDataJson);
    // var request = indexedDB.open(dbName, 2);

    // request.onerror = function(event) {
    //     // Handle errors.
    //     console.log(event);
    //     return false;
    // };
    // request.onsuccess = function() {

    //     var db = event.target.result;
    //     db.transaction("DataStore", 'readonly');
    //     var customerObjectStore = db.transaction("DataStore", 'readonly');
    //     var store = customerObjectStore.objectStore('DataStore');
    //     var datas = store.getAll();

    //     datas.onsuccess = function() {
    //         clearData(datas.result);

    //     }
    // }

}