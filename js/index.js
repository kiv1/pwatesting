var isFormValid = true;
var obj = {};
var schoolErrorText = $('.school-group .validation');
var levelErrorText = $('.Level-group .validation');
var streamErrorText = $('.Stream-group .validation');

run();


/*$('#submit').on('touchstart click', function() {
    validateForm();
});*/


function validateForm(){
    try {
        isFormValid = true;
        $('.personalEnquiry').each(function(){
            var inputElement = $(this).find('input');
            var enteredText = inputElement.val();
            var errorText = $(this).find('.validation');
            var elementName = inputElement[0].name;
            if ($.trim(enteredText).length == 0){
                $(errorText).empty();
                $(errorText).append('This field cannot be empty!');
                $(errorText).show();
                isFormValid = false;
            }
            else{
                if(elementName == 'Email'){
                    if (validateEmail(enteredText)) {
                        obj[elementName] = enteredText;
                        $(errorText).empty();
                        $(errorText).hide(); 
                    } else {
                        $(errorText).empty();
                        $(errorText).append('Please fill up this field correctly!');
                        $(errorText).show();
                        isFormValid = false;
                    }
                }else{
                    obj[elementName] = enteredText;
                    $(errorText).empty();
                    $(errorText).hide();    
                }
            }
        });

        /*if(!$('#magicsuggest').magicSuggest().isValid()){
            $(schoolErrorText).empty();
            $(schoolErrorText).append('Please fill up this field correctly!');
            $(schoolErrorText).show();
            isFormValid = false;
        }else{
            var SchoolName = $('#magicsuggest').magicSuggest().getValue();
            obj['School'] = SchoolName[0];
            $(schoolErrorText).empty();
            $(schoolErrorText).hide(); 
        }
        if(!$('#Level').magicSuggest().isValid()){
            $(levelErrorText).empty();
            $(levelErrorText).append('Please fill up this field correctly!');
            $(levelErrorText).show();
            isFormValid = false;
        }else{
            var LevelVal = $('#Level').magicSuggest().getValue();
            obj['Level'] = LevelVal[0];
            $(levelErrorText).empty();
            $(levelErrorText).hide(); 
        }

        if(!$('#Stream').magicSuggest().isValid()){
            $(streamErrorText).empty();
            $(streamErrorText).append('Please fill up this field correctly!');
            $(streamErrorText).show();
            isFormValid = false;
        }else{
            var StreamVal = $('#Stream').magicSuggest().getValue();
            obj['Stream'] = StreamVal[0];
            $(streamErrorText).empty();
            $(streamErrorText).hide(); 
        }

        $('input[type="checkbox"]').each(function() {
            var divName = '#'+ $(this).data("name")+'_SuggestArea';
            var suggestName = '#'+ $(this).data("name");
            var errorText = $(divName +' .validation');

             if(this.checked) {
                var selected = $(suggestName).magicSuggest().getValue();
                
                if(selected.length==0){
                    errorText.append('Please fill up this field correctly!');
                    errorText.show();
                    isFormValid = false;
                }else{
                    obj[$(this).data("name")] = selected;
                    errorText.empty();
                    errorText.hide(); 
                }
             }else{
                obj[$(this).data("name")] = null;
                errorText.empty();
                errorText.hide(); 
            }
        });*/

        var enquiry = $('Enquiry');
        if($.trim(enquiry.val()).length == 0){
            obj['Enquiry'] = null;
        }else{
            obj['Enquiry'] = enquiry.val();
        }

        if(isFormValid){
            addData(obj);
            clearAll();
            toastr.success('Form has been submitted!');
        }else{
            toastr.error('There are some errors in the form!');
        }
    } catch (err) {
        toastr.error(err);
    }
}

/*$('#generate').on('touchstart click', function() {
    downloadCSVClick();
});*/


function downloadCSVClick(){
    var arrayOfData = getAllData();
    downloadCSV('Enquiry', arrayOfData);
}

function clearAll(){
    $('.personalEnquiry').each(function(){
            var inputElement = $(this).find('input');
            inputElement.val('');
    });

    $('#Enquiry').val('');

    $('.validation').hide();

    /*levelSug.clear();
    levelSug.collapse();
    streamSug.clear();
    streamSug.collapse();
    ms.clear();
    ms.collapse();
    
    $('input[type="checkbox"]').each(function() {
        this.checked = false;
        var divName = '#'+ $(this).data("name")+'_SuggestArea';
        var suggestName = '#'+ $(this).data("name");
        $(suggestName).magicSuggest().clear();
        $(divName).hide();
    });*/
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


function addData(obj) {
    localStorage.setItem(uuidv4(), JSON.stringify(obj));
}

function clearData() {
    localStorage.clear();
}


function getAllData() {
    var arrOfDataStr = []
    var arrOfDataJson = []
    for (var i = 0; i < localStorage.length; i++) {
        arrOfDataStr.push(localStorage.getItem(localStorage.key(i)));
    }
    for (var i = 0; i < arrOfDataStr.length; i++) {
        arrOfDataJson.push(JSON.parse(arrOfDataStr[i]));
    }
    clearData(arrOfDataJson);
    return arrOfDataJson;
}

function convertArrayOfObjectsToCSV(args) {  
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;
                result += '"'+item[key]+'"';
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    function validateEmail(elementValue){      
       var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
       return emailPattern.test(elementValue); 
     } 

    function downloadCSV(name, stockData) {  
        try{
            var data, filename, link;
            var csv = convertArrayOfObjectsToCSV({
                data: stockData
            });

            if (csv == null) return;

            filename = 'export.csv';

            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }
            data = encodeURI(csv);

            //var blob = new Blob([csv]);
            //window.navigator.msSaveBlob(blob, "filename.csv");

            /*if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
                window.navigator.msSaveBlob(blob, "filename.csv");
            else
            {
                var a = window.document.createElement("a");
                a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
                a.download = "filename.csv";
                document.body.appendChild(a);
                a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
                document.body.removeChild(a);
            }*/

            link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('download', filename+'.csv');
            link.click();
        }catch(err){
            toastr.error(err);
        }
    }

