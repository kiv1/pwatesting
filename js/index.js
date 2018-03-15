var isFormValid = true;
var obj;
var schoolErrorText = $('.school-group .validation');
var levelErrorText = $('.Level-group .validation');
var streamErrorText = $('.Stream-group .validation');

$('#submit').on('click', function() {
    try {
        $('.form-group').each(function(){
            var enteredText = $(this).find('input').val();
            var errorText = $(this).find('.validation');
            if ($.trim(enteredText).length == 0){
                $(errorText).empty();
                $(errorText).append('This field cannot be empty!');
                $(errorText).show();
                isFormValid = false;
            }
            else{
                $(errorText).empty();
                $(errorText).hide();         
            }
        });

        if(!$('#magicsuggest').magicSuggest().isValid()){
            $(schoolErrorText).empty();
            $(schoolErrorText).append('This field cannot be empty!');
            $(schoolErrorText).show();
            isFormValid = false;
        }else{
            $(schoolErrorText).empty();
            $(schoolErrorText).hide(); 
        }

        if(!$('#Level').magicSuggest().isValid()){
            $(levelErrorText).empty();
            $(levelErrorText).append('This field cannot be empty!');
            $(levelErrorText).show();
            isFormValid = false;
        }else{
            $(levelErrorText).empty();
            $(levelErrorText).hide(); 
        }

        if(!$('#Stream').magicSuggest().isValid()){
            $(streamErrorText).empty();
            $(streamErrorText).append('This field cannot be empty!');
            $(streamErrorText).show();
            isFormValid = false;
        }else{
            $(streamErrorText).empty();
            $(streamErrorText).hide(); 
        }

        $('input[type="checkbox"]').each(function() {
             var divName = '#'+ $(this).data("name")+'_SuggestArea';
             var suggestName = '#'+ $(this).data("name");

             if(this.checked) {

                $(suggestName).magicSuggest().clear();
                $(divName).show();
             }else{
                $(divName).hide();
             }
        });

    } catch (error) {

    }
});

function showMessage(msg) {
    $('#sendmessage').text(msg)
}

document.querySelector('#generate').addEventListener('click', function() {
    //Generate excel
    var arrayOfData = getAllData();
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


function addUpdateData(obj) {
    localStorage.setItem(uuidv4(), JSON.stringify(obj));
}

function clearData() {
    localStorage.clear();
    $('#loading').hide();
}


function getAllData() {
    console.log('getalldata');
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