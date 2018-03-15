var isFormValid = true;
var obj = {};
var schoolErrorText = $('.school-group .validation');
var levelErrorText = $('.Level-group .validation');
var streamErrorText = $('.Stream-group .validation');

$('#submit').on('click', function() {
    try {

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
                obj[elementName] = enteredText;
                $(errorText).empty();
                $(errorText).hide();         
            }
        });

        console.dir(obj);

        if(!$('#magicsuggest').magicSuggest().isValid()){
            $(schoolErrorText).empty();
            $(schoolErrorText).append('This field cannot be empty!');
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
            $(levelErrorText).append('This field cannot be empty!');
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
            $(streamErrorText).append('This field cannot be empty!');
            $(streamErrorText).show();
            isFormValid = false;
        }else{
            var StreamVal = $('#Stream').magicSuggest().getValue();
            obj['Stream'] = StreamVal[0];
            $(streamErrorText).empty();
            $(streamErrorText).hide(); 
        }

        console.dir(obj);

        $('input[type="checkbox"]').each(function() {
            var divName = '#'+ $(this).data("name")+'_SuggestArea';
            var suggestName = '#'+ $(this).data("name");
            var errorText = $(divName +' .validation');

             if(this.checked) {
                var selected = $(suggestName).magicSuggest().getValue();
                console.dir(selected);
                
                if(selected.length==0){
                    errorText.append('This field cannot be empty!');
                    errorText.show();
                    isFormValid = false;
                }else{
                    errorText.empty();
                    errorText.hide(); 
                }
             }else{
                errorText.empty();
                errorText.hide(); 
            }
        });

        if(isFormValid){
            //do something
        }

    } catch (error) {
        console.dir(error);
    }
});


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