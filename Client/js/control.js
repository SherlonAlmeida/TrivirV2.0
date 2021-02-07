var relevant_list;
var suggestion_list;
var notrelevant_list;
var similardocuments_list;
var readDocuments_list;

var colorFocus = "#17a2b8";       //Relevant (Blue)
var colorSuggestion = "#ffc107";  //Suggested (Yellow)
var colorNotRelevant = "#d75a4a"; //Not Relevant (Red)
var colorBase = "#007527";        //Seed (Green)
var colorUnlabeled = "#BDBDBD";   //Unlabeled (Gray)
var colorRead = "#FFF"            //Document already Read (White)
var colorNotRead = "#000"         //Document not already Read (Black)

/*$(window).one("load", function(){
    initialize();
    
});*/

/* General */
function saveFocusList(focus){
    relevant_list = focus;
}

function saveSuggestionList(sug){
    suggestion_list = sug;    
}

function saveNotRelevantList(){
     $.get('http://127.0.0.1:3000/getnotrelevantlist',function(resp) {
        notrelevant_list = JSON.parse(resp);
        
        //Sherlon: trecho de debug (SEMPRE APARECE COMO DEFINIDO, portanto o erro nao esta aqui)
        if (notrelevant_list != undefined){
            console.log("notrelevant_list esta DEFINIDA!");
        } else {
            console.log("notrelevant_list esta INDEFINIDA!");
        }
        console.log(notrelevant_list);
    }); 
}

function saveReadDocumentsList(){
    $.get('http://127.0.0.1:3000/wasdocumentread',function(resp) {
        readDocuments_list = resp.split("\n");

        //Sherlon: trecho de debug (SEMPRE APARECE COMO DEFINIDO, portanto o erro nao esta aqui)
        if (readDocuments_list != undefined){
            console.log("readDocuments_list esta DEFINIDA!");
        } else {
            console.log("readDocuments_list esta INDEFINIDA!");
        }
        console.log(readDocuments_list);
    });
}

function isBaseDocument(name){    
    for (var i =0; i < relevant_list.length; i++){
        if (relevant_list[i].docname == name){
            if (relevant_list[i].isbase == true){
                return true;
            }else{
                return false;
            }            
        }            
    }   
    return false;    
}

function isRelevant(document){ 
    for (var i =0; i < relevant_list.length; i++){
        if (relevant_list[i].docname == document){
            return true;
        }            
    }   
    return false;   
}

function isSuggestion(document){  
    for (var i =0; i < suggestion_list.length; i++){
        if (suggestion_list[i].docname == document){
            return true;
        }           
    }   
    return false;   
}

function isNotRelevant(document){
    if(notrelevant_list != undefined){
        console.log("not relevant DEFINED");
        for (var i =0; i < notrelevant_list.length; i++){
            if (notrelevant_list[i].docname == document){
                return true;
            }     
        }   
        return false; 
    }else{
        console.log("not relevant undefined");
    }
}

//Sherlon: Given a name, if the document was read return the colorRead variable, otherwise return colorNotRead
function ScatterplotStroke(name){
    //console.log(readDocuments_list);

    if (readDocuments_list != undefined) {
        console.log("read documents DEFINED");
        var size = readDocuments_list.length-1;
        for (var i = 0; i < size; i++){
            if (readDocuments_list[i] == name){
                return colorRead;
            }            
        }
        return colorNotRead;
    } else {
        console.log("read documents undefined");
    }
}

function initialize(){
    $.post('http://127.0.0.1:3000/installpackages', function(resp){         
      console.log("done");  
      init("all");
    })
}

/* Signature */
function setRelevantDocumentsWithNgram(ngram){
    if (ngram.length > 2){
        $("#focustoggle")[0].disabled = true;
        $("#suggestiontoggle")[0].disabled = true;
        /* Sherlon: Comentar esta linha remove o "bug" da aba sumir.
        $("#suggestioncontainer").css("visibility", "hidden")
        $("#focuscontainer").css("visibility", "hidden")
        */
        $.get('http://127.0.0.1:3000/setasrelevantdocwithngram?ngram='+ngram,function(resp) {                 
            //saveNotRelevantList();
            //saveReadDocumentsList();
            LoadNotRelevantList( function(){
                LoadReadDocuments( function(){
                    LoadFocusList(function(){
                        LoadSuggestionList(function(){
                            UpdateScatterplotColors("null")
                        })
                    })
                })
            });            
        }); 
    }
    
}

function setNotRelevantDocumentsWithNgram(ngram){ 
    if (ngram.length > 2){
        $("#focustoggle")[0].disabled = true;
        $("#suggestiontoggle")[0].disabled = true;
        /* Sherlon: Comentar esta linha remove o "bug" da aba sumir.
        $("#suggestioncontainer").css("visibility", "hidden")
        $("#focuscontainer").css("visibility", "hidden")
        */
        $.get('http://127.0.0.1:3000/setasnotrelevantdocwithngram?ngram='+ngram,function(resp) {
            //saveNotRelevantList();
            //saveReadDocumentsList();
            LoadNotRelevantList( function(){
                LoadReadDocuments( function(){
                    LoadFocusList( function(){
                        LoadSuggestionList( function(){
                            UpdateScatterplotColors("null")
                        })
                    })
                })
            });            
        }); 
    }
}

/* Suggestion List */
function RetrainClassifier(){
  
    $("#suggestiontoggle")[0].disabled = true;
    /* Sherlon: Comentar esta linha remove o "bug" da aba sumir.
    $("#suggestioncontainer").css("visibility", "hidden")
    */
    
    $.post('http://127.0.0.1:3000/retrainclassifier', function(resp){
        //saveNotRelevantList();
        //saveReadDocumentsList();
        LoadNotRelevantList( function(){
            LoadReadDocuments( function(){
                LoadSuggestionList( function(){
                    var option = $('input[name=inlineRadioOptions]:checked', '.scatterplotVisualizations').val();
                    if (option == "Point Cloud") {
                        LoadScatterplot();
                    } else if (option == "Force Layout") {
                        LoadForceLayout();
                    }
                })
            })
        });    
        
    })  
    
}

/* Scatterplot */
function getSimilarDocuments(){  
   if (similardocuments_list == undefined){
       $.get('http://127.0.0.1:3000/getsimilardocuments',function(resp) {     
          similardocuments_list = resp;
          FilterScatterplot(similardocuments_list)
       }); 
   }else{
      FilterScatterplot(similardocuments_list);
   }   
}

function ScatterplotColor(name){
    if (isBaseDocument(name)){
        return colorBase;
    }    
    if (isRelevant(name)){        
        return colorFocus;
    }
    if (isSuggestion(name)){
        return colorSuggestion;
    }
    if (isNotRelevant(name)){
        return colorNotRelevant;
    }
    return colorUnlabeled; //Unlabeled (Grey)
   
}

//Sherlon: Update the current document with the color colorRead or colorNotRead
function getReadStroke(status){
    if (status == "wasread"){
        return colorRead;
    }
    return colorNotRead;
}

function setSimilarDocumentsAsNotRelevant(document){

    if (document.length > 2){
        $("#focustoggle")[0].disabled = true;       
        $("#suggestiontoggle")[0].disabled = true;
        /* Sherlon: Comentar esta linha remove o "bug" da aba sumir.
        $("#suggestioncontainer").css("visibility", "hidden")
        $("#focuscontainer").css("visibility", "hidden")
        */
        $.get('http://127.0.0.1:3000/setsimilarasnotrelevant?document='+document,function(resp) {                 
       
            //saveNotRelevantList();
            //saveReadDocumentsList();
            LoadNotRelevantList( function(){
                LoadReadDocuments( function(){
                    LoadFocusList(function(){
                        LoadSuggestionList(function(){
                            UpdateScatterplotColors("null")
                        })
                    })
                })
                 
            });            
        }); 
    }
}

function setSimilarDocumentsAsRelevant(document){ 
    if (document.length > 2){
        $("#focustoggle")[0].disabled = true;        
        $("#suggestiontoggle")[0].disabled = true;
        /* Sherlon: Comentar esta linha remove o "bug" da aba sumir.
        $("#suggestioncontainer").css("visibility", "hidden")
        $("#focuscontainer").css("visibility", "hidden")
        */
        $.get('http://127.0.0.1:3000/setsimilarasrelevant?document='+document,function(resp) {                 
          
            //saveNotRelevantList();
            //saveReadDocumentsList();
            LoadNotRelevantList( function(){
                LoadReadDocuments( function(){
                    LoadFocusList(function(){
                        LoadSuggestionList(function(){
                            UpdateScatterplotColors("null")
                        })
                    })
                })
            });            
        }); 
    }
}

/* Terms */
function RemoveTerm(d){
    $("#addtermbutton").attr("src", "images/loading.gif");  
    $.get('http://127.0.0.1:3000/deleteterm?term='+d.term,function(resp) {            
            LoadTerms(function(){});          
    });
}

function AddTerm(term){
    $("#addtermbutton").attr("src", "images/loading.gif");
    $.get('http://127.0.0.1:3000/addterm?term='+term,function(resp) {          
            LoadTerms(function(){});            
    });
}

/* Common to more than 1 view */
function SelectOnScatterplot(document){   
    StrokeCircle(document.docname)
}

/* Sherlon: This function shows the content in Document View*/
function OpenDocument(name){
    $.get('http://127.0.0.1:3000/getdocument?docname='+name,function(resp) {                           
        var text = document.getElementById("docview")
        text.value = resp;
        text.style.color = "black";
    });   
}

/* Sherlon: This function get the word frequency of a document*/
function GetWordFrequency(name){
    $.get('http://127.0.0.1:3000/getwordfrequency?docname='+name,function(resp) {                           
        LoadWordcloud(resp);
    });   
}

function SetDocumentAsRelevant(document, source){    
    $("#suggestiontoggle")[0].disabled = true;
    $("#focustoggle")[0].disabled = true;
    /* Sherlon: Comentar esta linha remove o "bug" da aba sumir.
    $("#suggestioncontainer").css("visibility", "hidden")
    $("#focuscontainer").css("visibility", "hidden")
    */

    if (document.docname){
        var color = ScatterplotColor(document.docname);

        if (color == colorNotRelevant){
            source = 'notrelevant'
        }
        if (color == colorSuggestion){
            source = 'suggestion'
        }
        $.get('http://127.0.0.1:3000/setasrelevant?docname='+document.docname +'&source=' + source ,function(resp) {    
            
            console.log(resp)
            LoadFocusList(function(){               
                if (source != 'scatter'){                    
                    LoadNotRelevantList( function(){
                        LoadReadDocuments( function(){
                            LoadSuggestionList(function(){
                                UpdateScatterplotColors(document.docname);
                            })
                        })
                    })                  
                } else {
                    LoadSuggestionList(function(){
                        UpdateScatterplotColors(document.docname); //Sherlon: Adicionei esta linha para atualizar o Session Data ao classificar os cinzas tambem
                    })
                }
            });
        });
    }else{       
        var color = ScatterplotColor(document.name);
        if (color == colorNotRelevant){
            source = 'notrelevant'
        }
        if (color == colorSuggestion){
            source = 'suggestion'
        }
         $.get('http://127.0.0.1:3000/setasrelevant?docname='+document.name+'&source=' + source ,function(resp) {    
             
            console.log(resp)
            LoadFocusList(function(){
                if (source != 'scatter'){                
                    LoadNotRelevantList( function(){
                        LoadReadDocuments( function(){           
                            LoadSuggestionList(function(){
                                UpdateScatterplotColors(document.docname);
                            })
                        })
                    })                   
                }else{
                    LoadSuggestionList(function(){
                        UpdateScatterplotColors(document.docname); //Sherlon: Adicionei esta linha para atualizar o Session Data ao classificar os cinzas tambem
                    })
                }             
            });

        }); 
    }    
}

function SetDocumentAsNotRelevant(document, origin){   
    var document_name;
    if (origin == 'scatter'){
        document_name = document.name;
        var color = ScatterplotColor(document.name);
        if (color == colorFocus){
            origin = 'focus';
        }else if (color == colorSuggestion){
            origin = 'suggestion'
        }   
    }else{
         document_name = document.docname;   
    }
    var uri = encodeURI('http://127.0.0.1:3000/setasnotrelevant?docname='+ document_name + '&origin='+origin);
    if (origin == 'suggestion'){
        $("#suggestiontoggle")[0].disabled = true;
        /* Sherlon: Comentar esta linha remove o "bug" da aba sumir.
        $("#suggestioncontainer").css("visibility", "hidden")
        */
    }else if (origin == 'focus'){
        $("#focustoggle")[0].disabled = true;
        $("#suggestiontoggle")[0].disabled = true;
        /* Sherlon: Comentar esta linha remove o "bug" da aba sumir.
        $("#suggestioncontainer").css("visibility", "hidden")
        $("#focuscontainer").css("visibility", "hidden")
        */
    }else{
        $("#focustoggle")[0].disabled = true;       
    }  
    $.get(uri,function(resp) {
        console.log(resp);
        if (origin == 'suggestion'){
            //saveNotRelevantList();
            //saveReadDocumentsList();
            LoadNotRelevantList( function(){
                LoadReadDocuments( function(){
                    LoadSuggestionList(function(){
                        UpdateScatterplotColors(document.docname) 
                    })
                })
            });                  
        } else if (origin == 'focus'){        
            LoadNotRelevantList( function(){
                LoadReadDocuments( function(){
                    LoadFocusList(function(){    
                        LoadSuggestionList(function(){
                            UpdateScatterplotColors(document.docname) 
                        })
                    })
               });
            });         
        } else{
            //saveNotRelevantList();
            //saveReadDocumentsList();
            LoadNotRelevantList( function(){
                LoadReadDocuments( function(){
                    LoadFocusList(function(){
                        UpdateScatterplotColors(document.docname);
                    })
                })
            })
        }        
    });    
}