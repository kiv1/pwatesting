var isFormValid = true;
var obj = {};
var schoolErrorText = $('.school-group .validation');
var levelErrorText = $('.Level-group .validation');
var streamErrorText = $('.Stream-group .validation');


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

        if(!$('#magicsuggest').magicSuggest().isValid()){
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
        });

        var enquiry = $('#Enquiry');
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
    clearData(arrayOfData);
    downloadCSV('Enquiry', arrayOfData);
}

function clearAll(){
    $('.personalEnquiry').each(function(){
            var inputElement = $(this).find('input');
            inputElement.val('');
    });

    $('#Enquiry').val('');

    $('.validation').hide();

    $('#Level').magicSuggest().clear();
    $('#Level').magicSuggest().collapse();
    $('#Stream').magicSuggest().clear();
    $('#Stream').magicSuggest().collapse();
    $('#magicsuggest').magicSuggest().clear();
    $('#magicsuggest').magicSuggest().collapse();
    
    $('input[type="checkbox"]').each(function() {
        this.checked = false;
        var divName = '#'+ $(this).data("name")+'_SuggestArea';
        var suggestName = '#'+ $(this).data("name");
        $(suggestName).magicSuggest().clear();
        $(divName).hide();
    });
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
    return arrOfDataJson;
}

function convertArrayOfObjectsToCSV(args) {  
        var result = [];
        var keys, data;

        var headers = [];

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        keys = Object.keys(data[0]);
        //result = '';
        //result += keys.join(columnDelimiter);
        //result += lineDelimiter;

        keys.forEach(function(keyName) {
            var head = {};
            head['value'] = keyName;
            head['type'] = 'string';
            headers.push(head);
        });

        result.push(headers);

        data.forEach(function(item) {
            var row = [];
            keys.forEach(function(key) {
                var column = [];
                column['value'] = item[key];
                column['type'] = 'string';
                row.push(column);
            });
            result.push(row);

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
            if(csv){
                var config = {
                  filename: 'TESTING',
                  sheet: {
                    data: csv
                  }
                };
                zipcelx(config);
            }else{
                toastr.warning('There is no data!!');
            }
        }catch(err){
            console.log(err);
            toastr.error(err);
        }
    }

    function login(){
        var dd = new Date();
        var d = dd.getDate();
        var n = dd.getHours();
        var x = d+n;
        var u = $('#Password').val();
        var t = x+'SingaporePoly';
        if(t == u){
            $('body').empty();
            $('body').append('<button style="cursor: pointer;" onclick="downloadCSVClick();" id="generate" type="button" class="bouton-contact">Generate</button>');
        }else{
            toastr.error('Fail!');
        }
    }

