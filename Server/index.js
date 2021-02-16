//Importação dos módulos necessários
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var R = require('r-script');
var pathlib = require('path');
var sortJsonArray = require('sort-json-array');


//Definição do Usuário e do Dataset a ser carregado
//ARQUIVOS DEMO DO SISTEMA
//var base = "../../data/demo/CBR-837Aam274-288.txt";
//var corpus = "../../data/demo";
//var username = 'test';

//ARQUIVOS SHERLON SOBRE TEXT RETRIEVAL (Poucos dados para facilitar no desenvolvimento, apenas os primeiros 100)
var base = "../../data/develop/seed_0.txt";
var corpus = "../../data/develop";
var username = 'admin';



var path_core = "../../core/"+pathlib.basename(corpus);
var path_users = "../../file/"+pathlib.basename(corpus)+"/"+username;
app.use(bodyParser.urlencoded({ extended: true })); 

var projtech = "tsne"; // or "lsp"
var embtech = "bagofwords"; // or "word_embeddings"

//MODIFICAR ESTA LINHA PARA O DIRETORIO ONDE O TRIVIR FOI INSTALADO
//var workingdir = "C:/Users/AMANDA-PC/Documents/TRIVIR/Server/scripts";
var workingdir = "C:/Users/sherl/Documents/TRIVIR_Estudo_Validacao/Server/scripts";

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', function (req, res) {
  res.send('Hello Rivi!');
});

app.post('/saveparameters', function (req, res) {
    
});

app.post('/installpackages', function (req, res) {
  console.log("Installing Packages");
  var out = R("./scripts/installpackages.R")
  .data({})
  .callSync()
  console.log(out);
  res.send(out);   
}); 

app.post('/scatterplot', function (req, res) {
  console.log("Initializing scatterplot"); 
  //fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/coordinates.json", "utf8", function(err, data){
  fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/concatenateScatterAndGraphData.json", "utf8", function(err, data){
    if(err){
      var out = R("./scripts/main.R")
      .data({"command": "scatterplotdata", "corpus": corpus, "path_core": path_core, "path_users":path_users, "projtech": projtech, "embtech": embtech, "workingdir": workingdir})
      .callSync()
                  
      if (out == "success"){
        //fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/coordinates.json", "utf8", function(err, data){
        fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/concatenateScatterAndGraphData.json", "utf8", function(err, data){
          if(err) console.log(err);
          console.log(out);
          var currentdate = new Date(); 
          var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
          console.log(datetime);
          res.send(data);
        });
      }
    }else{
      console.log("success");
      res.send(data);  
    }                     
  });      
});

/*Sherlon: A versão anterior do /forcelayout estava verificando a existencia do arquivo, e entao
realizava os calculos caso ele nao existisse. No entanto, o arquivo do grafo deve ser calculado
anteriormente. Logo, simplifiquei a funcao abaixo para apenas ler o arquivo e enviar, uma vez
que sabe-se que o grafo ja foi calculado anteriormente*/
app.post('/forcelayout', function (req, res) {
  console.log("Initializing Force Layout"); 
  //fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/force-directed-graph.json", "utf8", function(err, data){
  fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/concatenateScatterAndGraphData.json", "utf8", function(err, data){
    if(err) console.log(err);
    var currentdate = new Date(); 
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
          + (currentdate.getMonth()+1)  + "/" 
          + currentdate.getFullYear() + " @ "  
          + currentdate.getHours() + ":"  
          + currentdate.getMinutes() + ":" 
          + currentdate.getSeconds();
    console.log(datetime);
    res.send(data);
  });
});

app.post('/focuslist', function(req, res){
    console.log("Initializing focus list");
    fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/focuslist.json", "utf8", function(err, data){
          if(err){
              var out = R("./scripts/main.R")
                .data({"command": "focuslist", "corpus": corpus,  "baseDocument": base, "path_core": path_core, "path_users":path_users, "workingdir": workingdir})
                .callSync(); 
                
                if (out == "success"){                      
                      fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/focuslist.json", "utf8", function(err, data){
                      if(err) console.log(err); 
                        console.log(out);
                        res.send(data);
                      });           
                }             
          }else{
             console.log("success");
             res.send(data);
          }
    }); 
});

app.post('/suggestionlist', function(req, res){
    console.log("Initializing suggestion list");
    
    fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/suggestionlist.json", "utf8", function(err, data){
            if(err) {
                var out = R("./scripts/main.R")
                  .data({"command": "suggestion", "corpus": corpus, "path_core": path_core, "path_users":path_users, "workingdir": workingdir})
                  .callSync();
                
                if (out == "success"){
                    fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/suggestionlist.json", "utf8", function(err, data){
                        if(err) console.log(err);   
                        console.log(out);
                        res.send(data);
                    });           
                }                                
            }else{
                console.log("success");
                res.send(data);
            }          
    });      
});

app.post('/signature', function (req, res) {

  console.log("Initializing signature");
        
  var currentdate = new Date(); 
  var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
  console.log(datetime)
    
  var d = R("./scripts/main.R").data({"command": "init", "baseDocument": base, "corpus": corpus, "username": username, "path_core": path_core, "path_users":path_users, "embtech": embtech, "workingdir": workingdir})
        .callSync();
    console.log("out");
  console.log(d);   
         
           if (d == "success"){
              console.log(d);
              fs.readFile("../core/"+pathlib.basename(corpus)+"/signature.json", "utf8", function(err, data){
                  if(err) console.log(err);
                 
                  var currentdate = new Date(); 
                  var datetime = "Last Sync: " + currentdate.getDate() + "/"
                  + (currentdate.getMonth()+1)  + "/" 
                  + currentdate.getFullYear() + " @ "  
                  + currentdate.getHours() + ":"  
                  + currentdate.getMinutes() + ":" 
                  + currentdate.getSeconds();
                  console.log(datetime);                 
                  res.send(data);  
                                    
              });      
           }
      //});  
 
});

app.post('/terms', function(req, res){
    console.log("Retrieving terms" ); 
    fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/ImportantTerms.json", "utf8", function(err, data){
        if(err) console.log(err);   
        console.log("success");
        res.send(data);
    });     
});

app.get('/getsynonyms', function(req, res){
    console.log("Getting synonyms")
    R("./scripts/main.R")
      .data({"command": "getsynonyms", "term": req.query.term.toString().trim(), "path_core": path_core, "path_users":path_users, "workingdir": workingdir})
      .call(function(err,d){
           if (err) console.log(err);
           res.send(d);
      });  
})

app.get('/getsimilardocuments', function(req, res){
    console.log("Getting similar documents");
    var path = "../file/"+pathlib.basename(corpus)+"/"+username+"/cosdistance.csv";        
 
    fs.readFile(path, "utf8", function(err, data){
            if (err) console.log(err);  
            var rows = data.split('\n');
            var doclist = [];
            var k = 0;
            for (var i=1; i < rows.length; i++){
                var cell = rows[i].split(',');
                doclist[k] = cell[0];
                k = k + 1;
            } 
            res.send(doclist);
    }) 
    
})


/*Sherlon: The code below will read the content of a document and send to Document View in Client*/
app.get('/getdocument', function(req, res){
    console.log("Getting document: " + req.query.docname);
    
    var path = "../data/"+pathlib.basename(corpus)+"/"+req.query.docname;  
    fs.readFile(path, "utf8", function(err, data){
            if (err) console.log(err); 
            res.send(data);
    })
});

/*Sherlon: The code below will verify that the current document has already been read and respond to the Client*/
app.get('/wasdocumentread', function(req, res){
    console.log("Getting read documents");
    
    var path = "../file/"+pathlib.basename(corpus)+"/"+username+"/ReadDocuments.txt";
    fs.readFile(path, "utf8", function(err, data){ //Assincrono
        if(err) console.log(err);
        res.send(data);
    })
});

/*Sherlon: The code below will sum the Word Frequency of a document and send to Client*/
app.get('/getwordfrequency', function(req, res){
    console.log("Getting word frequency of document: " + req.query.docname);
    
    var path = "../file/"+pathlib.basename(corpus)+"/"+username+"/coordinates.json";
    fs.readFile(path, "utf8", function(err, data){
            if (err) console.log(err);

            //Sherlon: Get the "body_processed" attribute from coordinates.json, because it is pre-processed (Without Stop-Words, Lematization, ...)
            var jsonParsedArray = JSON.parse(data);
            var text;
            for (key in jsonParsedArray) {
              if (jsonParsedArray[key]["name"] == req.query.docname){
                text = jsonParsedArray[key]["body_preprocessed"];
              }
            }

            var wordArray = text.split(/[ .?!,*'"]/);
            var newArray = [], wordObj;
            wordArray.forEach(function (word) {
              wordObj = newArray.filter(function (w){
                return w.text == word;
              });
              if (wordObj.length) {
                wordObj[0].size += 1;
              } else {
                newArray.push({text: word, size: 1});
              }
            });

            //Sherlon: Sorting the Json by size in descending order
            newArray = sortJsonArray(newArray, 'size', 'des');

            //Sherlon: The max number of Frequent Terms
            var N = 10;
            var newData = [];
            //Sherlon: Select only the N most frequent words
            for (var i = 0; i < newArray.length; i++){
                if (i < N){
                  var obj = newArray[i];
                  newData.push({text: obj["text"], size: obj["size"]});
                } else {
                  break;
                }
            }
            //console.log(newData);
            
            json = JSON.stringify(newData, null, 2);
            res.send(json);
    })       
});

app.get('/deleteterm', function(req, res){
   console.log("Deleting term: " + req.query.term);
   //Remove ngram from JSON file
   var path = "../file/"+pathlib.basename(corpus)+"/"+username+"/ImportantTerms.json";
    fs.readFile(path, "utf8", function(err, data){
                  if(err) console.log(err);   
                  file = JSON.parse(data);
                  var keys = Object.keys(file);
                  
                  for (var i = 0; i < keys.length; i++){
                      if (file[keys[i]].term == req.query.term){
                        file.splice([keys[i]],1)
                        break;
                      }
                  }
                  json = JSON.stringify(file, null, 2)
                  fs.writeFile("../file/"+pathlib.basename(corpus)+"/"+username+"/ImportantTerms.json", json, "utf8", (err) => {
                        if (err) console.log(err);
                        res.send('The file has been saved!');
                  });     
                  
    }) 
});

app.get('/addterm', function(req, res){
   console.log("Adding term: " + req.query.term);
   R("./scripts/main.R")
      .data({"command": "addterm", "term": req.query.term, "corpus": corpus, "path_core": path_core, "path_users":path_users, "workingdir": workingdir})
      .call(function(err,out){
        console.log("error " + err)
        console.log(out);
        res.send("success");
      });  
});

app.post('/retrainclassifier', function (req, res) {
    console.log("Retraining classifier" );  
    var currentdate = new Date(); 
              var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    console.log(datetime);
    R("./scripts/main.R")
      .data({"command": "retrainclassifier", "corpus": corpus, "path_core": path_core, "path_users":path_users, "workingdir": workingdir})
      .call(function(err,out){
        fs.access("../file/"+pathlib.basename(corpus)+"/"+username+"/suggestionlist.json", error => {
          if (!error) {
                fs.unlink("../file/"+pathlib.basename(corpus)+"/"+username+"/suggestionlist.json",function(error){
                    if (error) console.log(error);
                    var currentdate = new Date(); 
                    var datetime = "Last Sync: " + currentdate.getDate() + "/"
                        + (currentdate.getMonth()+1)  + "/" 
                        + currentdate.getFullYear() + " @ "  
                        + currentdate.getHours() + ":"  
                        + currentdate.getMinutes() + ":" 
                        + currentdate.getSeconds();
                    console.log(datetime);
                    res.send("success");
                });
            } else {
                console.log(error);
            }
        });    
    }); 
});

//Sherlon: This function appends a document to the Read Documents List
function updateReadDocuments(name){
  //Sherlon: Saving current document as read
    var path = "../file/"+pathlib.basename(corpus)+"/"+username+"/ReadDocuments.txt";
    fs.readFile(path, "utf8", function(err, data){
      if(err) console.log(err);
      
      var readDocument;
      readDocument = name + "\n" + data;
      
      fs.writeFile("../file/"+pathlib.basename(corpus)+"/"+username+"/ReadDocuments.txt", readDocument, "utf8", (err) => {
            if (err) console.log(err);
            console.log("Setting document as read: " + name); 
      });
    });
}

app.get('/setasnotrelevant', function (req, res) {
    console.log("Setting a document as NOT relevant " + req.query.docname + " from: " + req.query.origin);
    
    //Sherlon: Saving current document as read
    updateReadDocuments(req.query.docname);

    if (req.query.origin == 'suggestion'){
           fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/suggestionlist.json", "utf8", function(err, data){
                      if(err) console.log(err);   
                      file = JSON.parse(data);
                      var keys = Object.keys(file);

                      for (var i = 0; i < keys.length; i++){
                          if (file[keys[i]].docname == req.query.docname){
                            file.splice([keys[i]],1)
                            break;
                          }
                      }
                      json = JSON.stringify(file, null, 2)
                      fs.writeFile("../file/"+pathlib.basename(corpus)+"/"+username+"/suggestionlist.json", json, "utf8", (err) => {
                            if (err) console.log(err);                         
                             console.log('deleted from suggestion ');
                      });     

        }) 
     } else if (req.query.origin == 'focus'){
        fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/focuslist.json", "utf8", function(err, data){
                      if(err) console.log(err);   
                      file = JSON.parse(data);
                      var keys = Object.keys(file);

                      for (var i = 0; i < keys.length; i++){
                          if (file[keys[i]].docname == req.query.docname){
                            file.splice([keys[i]],1)
                            break;
                          }
                      }
                      json = JSON.stringify(file, null, 2)
                      fs.writeFile("../file/"+pathlib.basename(corpus)+"/"+username+"/focuslist.json", json, "utf8", (err) => {
                            if (err) console.log(err);
                            console.log('deleted from focus ');                             
                      });     

        })    
    }    
    fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/notrelevant.json", "utf8", function(err, data){
            if(err) console.log(err);   
            file = JSON.parse(data);
            var keys = Object.keys(file);
            var added = false;
            for (var i = 0; i < keys.length; i++){
                if (file[keys[i]].docname == req.query.docname){                   
                    added = true;                   
                    break;
                }
            }
            if (!added){
                var body = "";
                var path = "../data/"+pathlib.basename(corpus)+"/"+req.query.docname;        
                            
                var title = R("./scripts/main.R")
                .data({"command": "gettitle", "corpus": corpus, "docname": req.query.docname, "path_core": path_core, "path_users":path_users, "workingdir": workingdir})
                .callSync()
                var element = {"docname": req.query.docname, "title": title};

                file.push(element)
                json = JSON.stringify(file, null, 2)
                fs.writeFile("../file/"+pathlib.basename(corpus)+"/"+username+"/notrelevant.json", json, "utf8", (err) => {
                    if (err) console.log(err);                    
                    res.send('The file has been saved!');
                });      
            }           
    }); 
    
});

app.get('/setasrelevant', function (req, res) {
  console.log("Setting a document as relevant " + req.query.docname + " from: " + req.query.source);  
  if (req.query.docname != 'undefined'){
      var currentdate = new Date(); 
      var datetime = "Last Sync: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
      console.log(datetime);
      
      //Sherlon: Saving current document as read
      updateReadDocuments(req.query.docname);

      if (req.query.source == 'suggestion'){          
          fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/suggestionlist.json", "utf8", function(err, data){
                  if(err) console.log(err);   
                  file = JSON.parse(data);
                  var keys = Object.keys(file);
                  
                  for (var i = 0; i < keys.length; i++){
                      if (file[keys[i]].docname == req.query.docname){
                        file.splice([keys[i]],1)
                        break;
                      }
                  }
                  json = JSON.stringify(file, null, 2)
                  fs.writeFile("../file/"+pathlib.basename(corpus)+"/"+username+"/suggestionlist.json", json, "utf8", (err) => {
                        if (err) console.log(err);
                        console.log('deleted from suggestion ');
                  });               
          })
         
      }
      if (req.query.source == 'notrelevant'){        
     
         fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/notrelevant.json", "utf8", function(err, data){
                  if(err) console.log(err);   
                  file = JSON.parse(data);
                  var keys = Object.keys(file);
                  
                  for (var i = 0; i < keys.length; i++){
                      if (file[keys[i]].docname == req.query.docname){
                        file.splice([keys[i]],1)
                        break;
                      }
                  }
                  json = JSON.stringify(file, null, 2)
                  fs.writeFile("../file/"+pathlib.basename(corpus)+"/"+username+"/notrelevant.json", json, "utf8", (err) => {
                        if (err) console.log(err);                       
                        console.log('deleted from not relevant '); 
                  });     
                  
          })
           
      }
      
      fs.readFile("../file/"+pathlib.basename(corpus)+"/"+username+"/focuslist.json", "utf8", function(err, data){
                if(err) console.log(err);   
                file = JSON.parse(data);
                var keys = Object.keys(file);
                var added = false;
                for (var i = 0; i < keys.length; i++){
                    if (file[keys[i]].docname == req.query.docname){                   
                        added = true;                   
                        break;
                    }
                }
                if (!added){          
                    
                    var body = "";
                    var path = "../data/"+pathlib.basename(corpus)+"/"+req.query.docname;         
                
                    var title = R("./scripts/main.R")
                        .data({"command": "gettitle", "corpus": corpus, "docname": req.query.docname, "path_core": path_core, "path_users":path_users, "workingdir": workingdir})
                        .callSync()
                    var element = {"docname": req.query.docname, "title": title, "isbase": false, "label": 1};       
                    file.push(element)
                    json = JSON.stringify(file, null, 2)
                    fs.writeFile("../file/"+pathlib.basename(corpus)+"/"+username+"/focuslist.json", json, "utf8", (err) => {
                        if (err) console.log(err);                            
                            res.send('The file has been saved!');
                            var currentdate = new Date(); 
                            var datetime = "Last Sync: " + currentdate.getDate() + "/"
                                            + (currentdate.getMonth()+1)  + "/" 
                                            + currentdate.getFullYear() + " @ "  
                                            + currentdate.getHours() + ":"  
                                            + currentdate.getMinutes() + ":" 
                                            + currentdate.getSeconds();
                            console.log(datetime);
                    });          

                }else{
                    res.send("Already added");
                }           
        });
  }else{
      console.log("error in document name")
  }
  
});

app.get('/setasrelevantdocwithngram', function(req, res){
    console.log("Setting relevant documents with ngram "+ req.query.ngram );
    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
    console.log(datetime);
    if (req.query.ngram.length > 2){
           R("./scripts/main.R")
          .data({"command": "setrelevantngrambatch", "ngram": req.query.ngram.toString().trim(), "path_core": path_core, "path_users":path_users, "corpus": corpus, "workingdir": workingdir})
          .call(function(err,out){
            if (err) console.log(err);
            console.log(out);             
            var currentdate = new Date(); 
            var datetime = "success: " + currentdate.getDate() + "/"
                        + (currentdate.getMonth()+1)  + "/" 
                        + currentdate.getFullYear() + " @ "  
                        + currentdate.getHours() + ":"  
                        + currentdate.getMinutes() + ":" 
                        + currentdate.getSeconds();
            console.log(datetime);
            res.send('success'); 
          })        
    }   
})

app.get('/setasnotrelevantdocwithngram', function(req, res){
    console.log("Setting as not relevant documents with ngram "+ req.query.ngram ); 
    var currentdate = new Date(); 
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
    console.log(datetime);
    if (req.query.ngram.length > 2){
           R("./scripts/main.R")
          .data({"command": "setnotrelevantngrambatch", "ngram": req.query.ngram.toString().trim(), "path_core": path_core, "path_users":path_users, "corpus": corpus, "baseDocument": base, "workingdir": workingdir})
          .call(function(err,out){
            if (err) console.log(err);
            console.log(out);            
            var currentdate = new Date(); 
            var datetime = "success: " + currentdate.getDate() + "/"
                        + (currentdate.getMonth()+1)  + "/" 
                        + currentdate.getFullYear() + " @ "  
                        + currentdate.getHours() + ":"  
                        + currentdate.getMinutes() + ":" 
                        + currentdate.getSeconds();
            console.log(datetime);
            res.send('success');  
          })
    }else{
       res.send('success');   
    }
    
})

app.get('/setsimilarasrelevant', function(req, res){
    console.log("Setting as relevant similar documents to: "+ req.query.document );
    
    //Sherlon: Saving current document as read
    updateReadDocuments(req.query.document);
    
    if (req.query.document.length > 2){
           R("./scripts/main.R")
          .data({"command": "setsimilarasrelevantbatch", "document": req.query.document.toString().trim(), "path_core": path_core, "path_users":path_users, "corpus": corpus, "baseDocument": base, "embtech": embtech, "workingdir": workingdir})
          .call(function(err,out){
                if (err) console.log(err);
                
                console.log(out); 
                res.set('Content-Type', 'text/plain');
                res.send('success');
                
         });
    }
})

app.get('/setsimilarasnotrelevant', function(req, res){
    console.log("Setting as not relevant similar documents to: "+ req.query.document );

    //Sherlon: Saving current document as read
    updateReadDocuments(req.query.document);

    var currentdate = new Date(); 
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
    console.log(datetime);
    if (req.query.document.length > 2){
           R("./scripts/main.R")
          .data({"command": "setsimilarasnotrelevantbatch", "document": req.query.document.toString().trim(), "path_core": path_core, "path_users":path_users, "corpus": corpus, "baseDocument": base, "embtech": embtech, "workingdir": workingdir})
          .call(function(err,out){
            if (err) console.log(err);
            console.log(out);
            res.send('success');  
            var currentdate = new Date(); 
            var datetime = "success: " + currentdate.getDate() + "/"
                        + (currentdate.getMonth()+1)  + "/" 
                        + currentdate.getFullYear() + " @ "  
                        + currentdate.getHours() + ":"  
                        + currentdate.getMinutes() + ":" 
                        + currentdate.getSeconds();
            console.log(datetime);
          })
    }else{
       res.send('success');   
    }
})

app.get('/getnotrelevantlist', function(req, res){
  console.log("Getting list of not relevant documents");
  var path = "../file/"+pathlib.basename(corpus)+"/"+username+"/notrelevant.json";
  fs.readFile(path, "utf8", function(err, data){ //Assincrono
        if(err) console.log(err);   
        console.log("success");
        res.send(data);
  });
})


/*Sherlon: Functions related to the Export Data Session*/

function readFocusList(callback){
  var path = "../file/"+pathlib.basename(corpus)+"/"+username+"/";
  var focuslist = path + "focuslist.json";
  fs.readFile(focuslist, "utf8", function(err, data){ //Assincrono
    if(err) console.log(err);
    var file = JSON.parse(data);
    var keys = Object.keys(file);
    var output = "";

    //Sherlon: Save SEED Documents
    output += "SEED DOCUMENTS:\n";
    for (var i = 0; i < keys.length; i++){
      if (file[keys[i]].label == 2)
        output += "\t" + file[keys[i]].title + "\n";
    }

    //Sherlon: Save RELEVANT Documents
    output += "\nRELEVANT DOCUMENTS:\n";
    for (var i = 0; i < keys.length; i++){
      if (file[keys[i]].label != 2)
        output += "\t" + file[keys[i]].title + "\n";
    }
    callback(output);
  });
}

function readSuggestionList(previousdata, callback){
  var path = "../file/"+pathlib.basename(corpus)+"/"+username+"/";
  var suggestionlist = path + "suggestionlist.json";
  fs.readFile(suggestionlist, "utf8", function(err, data){ //Assincrono
    if(err) console.log(err);
    var file = JSON.parse(data);
    var keys = Object.keys(file);
    var output = previousdata;

    //Sherlon: Save SUGGESTED Documents
    output += "\nSUGGESTED DOCUMENTS:\n";
    for (var i = 0; i < keys.length; i++){
      output += "\t" + file[keys[i]].title + "\n";
    }
    callback(output);
  });
}

function readNotRelevantList(previousdata, callback){
  var path = "../file/"+pathlib.basename(corpus)+"/"+username+"/";
  var notrelevantlist = path + "notrelevant.json";
  fs.readFile(notrelevantlist, "utf8", function(err, data){ //Assincrono
    if(err) console.log(err);
    var file = JSON.parse(data);
    var keys = Object.keys(file);
    var output = previousdata;

    //Sherlon: Save SUGGESTED Documents
    output += "\nNOT RELEVANT DOCUMENTS:\n";
    for (var i = 0; i < keys.length; i++){
      output += "\t" + file[keys[i]].title + "\n";
    }
    callback(output);
  });
}

/*Download File in Client Side*/
app.get('/exportsessiondata', function(req, res){
  console.log("Exporting Session Data");  
  var path = "../file/"+pathlib.basename(corpus)+"/"+username+"/";
  
  readFocusList( function(output){
    var dataFocus = output; //Somente os dados da Focuslist
    readSuggestionList( dataFocus, function(output){
      var dataSuggestion = output; //Os dados da Focuslist + Suggestionlist
      readNotRelevantList( dataSuggestion, function(output){

        var currentdate = new Date(); 
        var datetime = "-" + currentdate.getDate() + "-"
                    + (currentdate.getMonth()+1)  + "-" 
                    + currentdate.getFullYear() + "-"  
                    + currentdate.getHours() + "h"  
                    + currentdate.getMinutes() + "m" 
                    + currentdate.getSeconds() + "s";

        var sessiondata = path + "SessionDataTrivir.txt"; //Nome do arquivo no servidor
        var dataNotRelevant = output; //Os dados da Focuslist + Suggestionlist + NotRelevantlist
        fs.writeFile(sessiondata, dataNotRelevant, "utf8", (err) => {
          if (err) console.log(err);
          console.log("Session data file was created");
          var renamesessiondata = path + "SessionDataTrivir" + datetime + ".txt"; //Nome do arquivo no cliente
          res.download(sessiondata, renamesessiondata);
        });

      });
    });
  });
})

//Seta o servidor para a porta 3000
app.listen(3000, function () {
  console.log('Listening on port 3000!');
});