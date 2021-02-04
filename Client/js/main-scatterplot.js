var svg;
var xScale;
var yScale;
var datascatterplot;
var colorFocus = "#17a2b8";       //Relevant (Blue)
var colorSuggestion = "#ffc107";  //Suggested (Yellow)
var colorNotRelevant = "#d75a4a"; //Not Relevant (Red)
var colorBase = "#007527";        //Seed (Green)
var circle_radius = 8;            //Sherlon: This variable defines the size of the circle

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? "rgb(" + [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ].join(', ') + ")" : null;
}

/*This Function controls the Point Cloud in Scatter Plot View (Original Visualization)*/
function LoadScatterplot() {
    d3.request("http://127.0.0.1:3000/scatterplot")    
    .header("Content-Type", "application/json")
    .post(function(error, d){
   
        //PARAMETERS AND VARIABLES
        datascatterplot = JSON.parse(d.responseText);

        d3.select(".scatterplot-svg").remove();
        
        // add the tooltip area to the webpage
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);      
       
        svg = d3.select("#scatterplotcontainer").append("svg"),
            margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = $("#scatterplotheader").width(), // - margin.left - margin.right,
            height = window.innerHeight - margin.top - margin.bottom - $("#termscontainer").height(),
            g = svg.append("g").attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");
         
        var barHeight = 30;  
        var barWidth = 110;
         
        // setup x 
        var xValue = function(d) { return +d.X1;}; // data -> value
        xScale = d3.scaleLinear().range([0, width]).nice(); // value -> display
        var xMap = function(d) { return xScale(xValue(d));} // data -> display     

        // setup y
        var yValue = function(d) { return +d.X2;}; // data -> value
        yScale = d3.scaleLinear().range([height, 0]).nice(); // value -> display
        var yMap = function(d) { return yScale(yValue(d));} // data -> display           
        
        xScale.domain([d3.min(datascatterplot, xValue)-1, d3.max(datascatterplot, xValue)+1]);
        yScale.domain([d3.min(datascatterplot, yValue)-1, d3.max(datascatterplot, yValue)+1]); 
             
        var zoomBeh = d3.zoom()
            .scaleExtent([.5, 20]) //Sherlon: Zoom [min, max]
            .extent([[0, 0], [width, height]])
            .on("zoom", zoom);
         
        d3.select("#scatterplotcontainer")        
            .style("height", height+"px")
            .style("width", width +"px")        
        svg.attr("height", height)
            .attr("width", width)         
            .attr("class", "scatterplot-svg")
            .call(zoomBeh)
      
        svg.selectAll(".dot")
            .data(datascatterplot)
            .enter().append("circle")         
            .attr("r", circle_radius)
            .attr("cx", xMap)
            .attr("cy", yMap)    
            .style("fill", function(d) {return ScatterplotColor(d.name)})
            .style("stroke", function(d) {return ScatterplotStroke(d.name)})
            //.style("stroke", "#000")
            .attr("class", "dot")
          
        /* Sherlon: Removi o nome do documento, pois, de acordo com o especialista em IHC, esta funcionalidade faz o usuario desviar sua atenção.
        .on("mouseover", function(d) {           
            d3.transition()
               .duration(200)
               .select('.tooltip')                   
               .style("opacity", .9)                   
            tooltip.html("<tooltiptext>"+d.name+"</tooltiptext>")
               .style("width", (getTextWidth(d.name, "12px Arial") + 20) + "px")
               .style("left", svg.node().getBoundingClientRect().left + "px")
               .style("top", svg.node().getBoundingClientRect().top + "px") 
        })
        .on("mouseout", function(d) {
            d3.transition()
               .duration(500)
               .select('.tooltip') 
               .style("opacity", 0); 
          })
        */
        .on("click", function(d, i){
            d3.selectAll(".dot").style("stroke-width", "1px")
            if (d3.select(this).style("stroke-width") == "1px"){
                d3.select(this).style("stroke-width", "3px")
                OpenDocument(d.name);
                GetWordFrequency(d.name);
                var selected_circle = d3.select(this);
                //Removing any existing menu
                d3.selectAll(".barmenu")
                    .remove()    
                if (($("#focustoggle")[0].disabled == false) && ($("#signaturetoggle")[0].disabled == false) && ($("#suggestiontoggle")[0].disabled == false) && (selected_circle.style("fill") != hexToRgb(colorBase))){
                    //Creating a new menu
                    //Defining the div that will contain the menu                 
                    var options_scatter = d3.select("div#menucontainer").append("svg")
                                            .attr("class", "barmenu")
                                            .attr("width", function(){
                                                return barWidth;
                                            })
                                            .attr("height", function(){
                                                return barHeight + 10                        
                                            })
                                            .attr("fill","#d8eaff")
                    //Positioning the div                 
                    yPos = d3.event.pageY - 55;

                    d3.select("div#menucontainer")
                        .style("left", function(){
                            //Sherlon: Porque eh preciso retornar valores diferentes? Esta ficando sobreposto ao circulo!
                            /*if ((selected_circle.style("fill") != hexToRgb(colorFocus)) && (selected_circle.style("fill")) != hexToRgb(colorNotRelevant)){
                                return (d3.event.pageX - 110) + "px";
                            }else{
                                return (d3.event.pageX - 55) + "px";
                            }*/
                            return (d3.event.pageX - 55) + "px";
                        })
                        .style("top", function(){return yPos+ "px"})
                    
                    //Defining the background (rect) for the buttons
                    options_scatter.append("rect")
                        .attr("class","barmenu")
                        .attr("height", barHeight)
                        .attr("width", 100)
                        .attr("fill", "#a9a9a9")                        
                        .attr("y", 8)
                        .attr("x", 0)
                    
                    //Defining the close button
                    options_scatter.append("svg:image")
                            .attr("class", "barmenu")
                            .attr("xlink:href", "images/close.png")
                            .attr("width", "20px")
                            .attr("y", 0)
                            .attr("x", function(){
                                return 90;
                            }) 
                            .on("click", function(){                            
                                d3.selectAll(".barmenu")
                                    .remove()
                            })
                    
                    //Defining the delete button (Red -)
                    //Sherlon: Se o documento atual for amarelo ou azul, define ele como vermelho.
                    if (selected_circle.style("fill") != hexToRgb(colorNotRelevant)){
                        options_scatter.append("svg:image")
                            .attr("class", "barmenu")
                            .attr("xlink:href", "images/error.png")
                            .attr("width", "25px")
                            .attr("y", 10)
                            .attr("x", 10)
                            .on("click", function(){
                                d3.selectAll(".barmenu")
                                    .remove() 
                                selected_circle.style("fill", hexToRgb(colorNotRelevant))
                                selected_circle.style("stroke", getReadStroke('wasread'));
                                selected_circle.style("stroke-width", "1px");
                                SetDocumentAsNotRelevant(d, 'scatter')
                            })
                     }

                     //Defining the add button (Blue)
                     //Sherlon: Se o documento atual for cinza, amarelo ou vermelho, define ele como azul.
                     if (selected_circle.style("fill") != hexToRgb(colorFocus)){
                        options_scatter.append("svg:image")
                            .attr("class", "barmenu")
                            .attr("xlink:href", "images/navigation-1.png")
                            .attr("width", "25px")
                            .attr("y", 10)
                            .attr("x", function(){
                                if (selected_circle.style("fill") == hexToRgb(colorNotRelevant)){
                                    return 10;
                                }else{
                                  return 50;  
                                }
                            }) 
                            .on("click", function(){                        
                                d3.selectAll(".barmenu")
                                    .remove()  
                                selected_circle.style("fill", hexToRgb(colorFocus));
                                selected_circle.style("stroke", getReadStroke('wasread'));
                                selected_circle.style("stroke-width", "1px");
                                SetDocumentAsRelevant(d, 'scatter');
                            })     
                    }

                    //Defining the add Button (Green)
                    //Sherlon: Se o documento atual for azul, define ele como verde e seus similares como azuis.
                    if (selected_circle.style("fill") == hexToRgb(colorFocus)){
                        options_scatter.append("svg:image")
                            .attr("class", "barmenu")
                            .attr("xlink:href", "images/add-1.png")
                            .attr("width", "25px")
                            .attr("y", 10)
                            .attr("x", 50)
                            .on("click", function(){
                                d3.selectAll(".barmenu")
                                    .remove()
                                selected_circle.style("fill", hexToRgb(colorBase))
                                selected_circle.style("stroke", getReadStroke('wasread'));
                                selected_circle.style("stroke-width", "1px");
                                setSimilarDocumentsAsRelevant(d.name)
                            })
                    }

                    //Defining the delete Button (Red +)
                    //Sherlon: Se o documento atual for vermelho, define todos seus similares como vermelhos
                    if (selected_circle.style("fill") == hexToRgb(colorNotRelevant)){
                         options_scatter.append("svg:image")
                            .attr("class", "barmenu")
                            .attr("xlink:href", "images/addred.png")
                            .attr("width", "25px")
                            .attr("y", 10)
                            .attr("x", 50)                           
                            .on("click", function(){                        
                                d3.selectAll(".barmenu")
                                    .remove()
                                selected_circle.style("stroke", getReadStroke('wasread'));
                                selected_circle.style("stroke-width", "1px");
                                setSimilarDocumentsAsNotRelevant(d.name)
                            })                        
                    }
                }
            }
        });
    })
}

function zoom() {
    var new_xScale = d3.event.transform.rescaleX(xScale);
    var new_yScale = d3.event.transform.rescaleY(yScale);
    svg.selectAll(".dot")
        .attr('cx', function(d) {return new_xScale(d['X1'])})
        .attr('cy', function(d) {return new_yScale(d['X2'])})
        //Sherlon: The attr below will set the radius of all circles dinamycally according to the Zoom
        .attr('r', function(d) {
            var zoom = d3.event.transform.k;
            return circle_radius + zoom;
        });
}

function transform(d) {
    return "translate(" + xScale(d['X1']) + "," + yScale(d['X2']) + ")";
}

/*This Function controls the Force Layout in Scatter Plot View*/
function LoadForceLayout() {
    d3.request("http://127.0.0.1:3000/forcelayout")    
        .header("Content-Type", "application/json")
        .post(function(error, d){
            
            //PARAMETERS AND VARIABLES
            datascatterplot = JSON.parse(d.responseText);

            //alert(d.responseText); //Texto plano do JSON
            
            d3.select(".scatterplot-svg").remove();
            
            svg = d3.select("#scatterplotcontainer").append("svg"),
                margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = $("#scatterplotheader").width(), // - margin.left - margin.right,
                height = window.innerHeight - margin.top - margin.bottom - $("#termscontainer").height(),
                g = svg.append("g").attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");
            d3.select("#scatterplotcontainer")        
                .style("height", height+"px")
                .style("width", width +"px")        
            svg.attr("height", height)
                .attr("width", width)         
                .attr("class", "scatterplot-svg")

            datascatterplot = filterEdgesByDistance(datascatterplot);

            createV4SelectableForceDirectedGraph(svg, datascatterplot);
    })
}

/*Sherlon: This function returns the filtered data by a threshold defined dinamically by the user*/
function filterEdgesByDistance(data) {
    var threshold = document.getElementById('sliderCosineDistance').value / 100;
    data.links = data.links.filter(function(jsonObject) {
        //return jsonObject.cosdist > threshold; //Diminui os links ao aumentar o threshold, pois menos links possuem alta similaridade (Isso sim eh distancia do cosseno).
        return jsonObject.value < threshold; //Aumenta os links ao aumentar o threshold, pois cada vez mais links estarão abaixo de 1 (Isso nao eh distancia do cosseno (Vis-KT)).
    });
    console.log(data);
    return data;
}

/* Functions called from control.js */

/*Sherlon: this function identifies the selected circle and create a border*/
function StrokeCircle(docname){
    var option = $('input[name=inlineRadioOptions]:checked', '.scatterplotVisualizations').val();
    if (option == "Point Cloud") {
        var circles = d3.selectAll(".dot")._groups[0]; 
        d3.selectAll(".dot").style("stroke-width", "1px")
        for (var i = 0; i < circles.length; i++){      
             if(circles[i].__data__.name == docname){
                 var doc = circles[i];
                 break;
             }       
        }
        doc.setAttribute("style", "fill: "+doc.style.fill+"; stroke: "+doc.style.stroke +"; stroke-width: 3px;");
    } else if (option == "Force Layout") {
        var nodes = d3.selectAll(".node .dot")._groups[0];
        d3.selectAll(".node .dot").style("stroke-width", "1px")
        for (var i = 0; i < nodes.length; i++){
            if (d3.select(nodes[i]).attr("name") == docname){
                var doc = nodes[i];
                console.log(d3.select(nodes[i]).attr("name"));
                break;
            }
        }
        doc.setAttribute("style", "fill: "+doc.style.fill+"; stroke: "+doc.style.stroke +"; stroke-width: 2px;");
    }
}

function UpdateScatterplotColors(name){
    var option = $('input[name=inlineRadioOptions]:checked', '.scatterplotVisualizations').val();
    if (option == "Point Cloud") {
        var circles = d3.selectAll(".dot")._groups[0];
        //Se um documento for passado como parametro, atualiza apenas este documento
        if (name != "null"){
            for (var i = 0; i < circles.length; i++){  
                if (circles[i].__data__.name == name){
                    circles[i].setAttribute("style", "fill: "+ ScatterplotColor(circles[i].__data__.name)+"; stroke: "+circles[i].style.stroke +"; stroke-width: 1px; opacity: 1.0; visibility: "+circles[i].style.visibility)
                    break;
                }       
            }
        //Mas se nenhum documento for passado como parametro, atualiza todos os documentos
        } else{
            for (var i = 0; i < circles.length; i++){ 
                circles[i].setAttribute("style", "fill: "+ ScatterplotColor(circles[i].__data__.name)+"; stroke: "+circles[i].style.stroke +"; stroke-width: 1px; opacity: 1.0; visibility: "+circles[i].style.visibility)      
            }         
        }
    } else if (option == "Force Layout") {
        var nodes = d3.selectAll(".node .dot")._groups[0];
        //Se um documento for passado como parametro, atualiza apenas este documento
        if (name != "null"){
            for (var i = 0; i < nodes.length; i++){  
                if (d3.select(nodes[i]).attr("name") == name){
                    nodes[i].setAttribute("style", "fill: "+ ScatterplotColor(d3.select(nodes[i]).attr("name"))+"; stroke: "+nodes[i].style.stroke +"; stroke-width: 1px; opacity: 1.0; visibility: "+nodes[i].style.visibility)
                    break;
                }       
            }
        //Mas se nenhum documento for passado como parametro, atualiza todos os documentos
        } else{
            for (var i = 0; i < nodes.length; i++){ 
                nodes[i].setAttribute("style", "fill: "+ ScatterplotColor(d3.select(nodes[i]).attr("name"))+"; stroke: "+nodes[i].style.stroke +"; stroke-width: 1px; opacity: 1.0; visibility: "+nodes[i].style.visibility)      
            }         
        }
    }
}

function FilterScatterplot(documents){
    $("#resetscatterplotbutton").css("visibility", "visible");
    k = +document.getElementById('filterscatterplotinput').value;
    k = k +1;    
    documents = documents.slice(0, k)

    var option = $('input[name=inlineRadioOptions]:checked', '.scatterplotVisualizations').val();
    if (option == "Point Cloud") {
        d3.selectAll(".dot").style("visibility", "hidden")
        var circles = d3.selectAll(".dot")._groups[0]; 
        for (var i = 0; i < circles.length; i++){ 
            for (var j = 0 ; j < documents.length; j++){        
                if (circles[i].__data__.name == documents[j].replace(/['"]+/g, '')){
                    circles[i].setAttribute("style", "fill: "+circles[i].style.fill+"; stroke: "+circles[i].style.stroke +"; stroke-width: 1px; opacity: 1.0; visibility: visible"); 
                }
            }        
        }
    } else if (option == "Force Layout") {
        var visible_documents = []

        //Define a visibilidade dos pontos
        d3.selectAll(".node .dot").style("visibility", "hidden") 
        var nodes = d3.selectAll(".node .dot")._groups[0];
        for (var i = 0; i < nodes.length; i++){
            for (var j = 0 ; j < documents.length; j++){
                if (d3.select(nodes[i]).attr("name") == documents[j].replace(/['"]+/g, '')){
                    nodes[i].setAttribute("style", "fill: "+nodes[i].style.fill+"; stroke: "+nodes[i].style.stroke +"; stroke-width: 1px; opacity: 1.0; visibility: visible");
                    visible_documents.push(d3.select(nodes[i]).attr("name"));
                }
            }
        }
        
        //Define a visibilidade das arestas
        d3.selectAll(".link .edge").style("visibility", "hidden")
        var links = d3.selectAll(".link .edge")._groups[0];
        for (var i = 0; i < links.length; i++){
            //console.log( d3.select(links[i]).attr("source") + " -> " + d3.select(links[i]).attr("target") );
            //var n = d3.select("[name=" + "\"" + d3.select(links[i]).attr("source") + "\"" + "]")._groups[0];
            var source = d3.select(links[i]).attr("source");
            var target = d3.select(links[i]).attr("target");
            if (visible_documents.includes(source) && visible_documents.includes(target)){
                links[i].setAttribute("style", "visibility: visible");
            }
        }
    }
}

function showDocumentsWithNgram(text){ 
    if ((text != undefined)&&(text != "")){
        $("#resetscatterplotbutton").css("visibility", "visible");
        var option = $('input[name=inlineRadioOptions]:checked', '.scatterplotVisualizations').val();
        if (option == "Point Cloud") {
            d3.selectAll(".dot").style("visibility", "hidden")
            var circles = d3.selectAll(".dot")._groups[0]; 
            for (var i = 0; i < circles.length; i++){   
                circle_name = circles[i].__data__.body_preprocessed.toLowerCase();
                text = text.toLowerCase();
                if(circle_name.includes(text)){
                    circles[i].setAttribute("style", "fill: "+circles[i].style.fill+"; stroke: "+circles[i].style.stroke +"; stroke-width: 1px; opacity: 1.0; visibility: visible");                         
                }        
            }
        } else if (option == "Force Layout") {
            var visible_documents = []

            //Define a visibilidade dos pontos
            d3.selectAll(".node .dot").style("visibility", "hidden") 
            var nodes = d3.selectAll(".node .dot")._groups[0];
            for (var i = 0; i < nodes.length; i++){
                //console.log(d3.select(nodes[i]).attr("name"));
                var circle_name = d3.select(nodes[i]).attr("content_preprocessed").toLowerCase(); //Colocar aqui o conteudo do body-preprocessed
                text = text.toLowerCase();
                if (circle_name.includes(text)){
                    nodes[i].setAttribute("style", "fill: "+nodes[i].style.fill+"; stroke: "+nodes[i].style.stroke +"; stroke-width: 1px; opacity: 1.0; visibility: visible");
                    visible_documents.push(d3.select(nodes[i]).attr("name"));
                }
            }
            
            //Define a visibilidade das arestas
            d3.selectAll(".link .edge").style("visibility", "hidden")
            var links = d3.selectAll(".link .edge")._groups[0];
            for (var i = 0; i < links.length; i++){
                //console.log( d3.select(links[i]).attr("source") + " -> " + d3.select(links[i]).attr("target") );
                //var n = d3.select("[name=" + "\"" + d3.select(links[i]).attr("source") + "\"" + "]")._groups[0];
                var source = d3.select(links[i]).attr("source");
                var target = d3.select(links[i]).attr("target");
                if (visible_documents.includes(source) && visible_documents.includes(target)){
                    links[i].setAttribute("style", "visibility: visible");
                }
            }
        }
    }  
}


/* Scatterplot Menu Buttons*/

//Botão de reset do Scatterplot (Xis vermelho)
$("#resetscatterplotbutton").unbind().click(function(e){
    $("#resetscatterplotbutton").css("visibility", "hidden");
    var option = $('input[name=inlineRadioOptions]:checked', '.scatterplotVisualizations').val();
    if (option == "Point Cloud") {
        d3.selectAll(".dot").style("visibility", "visible")
        d3.selectAll(".dot").style("opacity", "1.0")
    } else if (option == "Force Layout") {
        d3.selectAll(".node .dot").style("visibility", "visible")
        d3.selectAll(".link .edge").style("visibility", "visible")
    }
    document.getElementById('searchdocumentinput').value = "";
    document.getElementById('filterscatterplotinput').value = "";
})

//Botão de filtrar documentos por palavras (Lupa)
$("#searchdocumentbutton").unbind().click(function(e){
    var text = document.getElementById('searchdocumentinput').value;
    if ((text != undefined)&&(text != "")){
        $("#resetscatterplotbutton").css("visibility", "visible");
        var option = $('input[name=inlineRadioOptions]:checked', '.scatterplotVisualizations').val();
        if (option == "Point Cloud") {
            d3.selectAll(".dot").style("visibility", "hidden")
            var circles = d3.selectAll(".dot")._groups[0]; 
            for (var i = 0; i < circles.length; i++){   
                circle_name = circles[i].__data__.body.toLowerCase();
                text = text.toLowerCase();
                if(circle_name.includes(text)){
                    circles[i].setAttribute("style", "fill: "+circles[i].style.fill+"; stroke: "+circles[i].style.stroke +"; stroke-width: 1px; opacity: 1.0; visibility: visible");                         
                }        
            }
        } else if (option == "Force Layout") {
            var visible_documents = []

            //Define a visibilidade dos pontos
            d3.selectAll(".node .dot").style("visibility", "hidden") 
            var nodes = d3.selectAll(".node .dot")._groups[0];
            for (var i = 0; i < nodes.length; i++){
                //console.log(d3.select(nodes[i]).attr("name"));
                var circle_name = d3.select(nodes[i]).attr("content").toLowerCase(); //Colocar aqui o conteudo do body
                text = text.toLowerCase();
                console.log(circle_name);
                console.log(text);
                if (circle_name.includes(text)){
                    nodes[i].setAttribute("style", "fill: "+nodes[i].style.fill+"; stroke: "+nodes[i].style.stroke +"; stroke-width: 1px; opacity: 1.0; visibility: visible");
                    visible_documents.push(d3.select(nodes[i]).attr("name"));
                }
            }
            
            //Define a visibilidade das arestas
            d3.selectAll(".link .edge").style("visibility", "hidden")
            var links = d3.selectAll(".link .edge")._groups[0];
            for (var i = 0; i < links.length; i++){
                //console.log( d3.select(links[i]).attr("source") + " -> " + d3.select(links[i]).attr("target") );
                //var n = d3.select("[name=" + "\"" + d3.select(links[i]).attr("source") + "\"" + "]")._groups[0];
                var source = d3.select(links[i]).attr("source");
                var target = d3.select(links[i]).attr("target");
                if (visible_documents.includes(source) && visible_documents.includes(target)){
                    links[i].setAttribute("style", "visibility: visible");
                }
            }
        }
    }
})

//Botão de filtrar por interessantes, ou seja, o Point Clutter Reduction (Gotas)
$("#filterrelevantsbutton").unbind().click(function(e){
    $("#resetscatterplotbutton").css("visibility", "visible");
    var option = $('input[name=inlineRadioOptions]:checked', '.scatterplotVisualizations').val();
    if (option == "Point Cloud") {
        d3.selectAll(".dot").style("visibility", "hidden") 
        var circles = d3.selectAll(".dot")._groups[0];
        for (var i = 0; i < circles.length; i++){ 
            if ((circles[i].style.fill == hexToRgb(colorFocus))||(circles[i].style.fill == hexToRgb(colorBase))||(circles[i].style.fill == hexToRgb(colorSuggestion))){
                circles[i].setAttribute("style", "fill: "+circles[i].style.fill+"; stroke: "+circles[i].style.stroke +"; stroke-width: 1px; opacity: 1.0; visibility: visible"); 
            }
        }
    } else if (option == "Force Layout") {
        var visible_documents = []

        //Define a visibilidade dos pontos
        d3.selectAll(".node .dot").style("visibility", "hidden") 
        var nodes = d3.selectAll(".node .dot")._groups[0];
        for (var i = 0; i < nodes.length; i++){
            //console.log(d3.select(nodes[i]).attr("name"));
            if ((nodes[i].style.fill == hexToRgb(colorFocus))||(nodes[i].style.fill == hexToRgb(colorBase))||(nodes[i].style.fill == hexToRgb(colorSuggestion))){
                nodes[i].setAttribute("style", "fill: "+nodes[i].style.fill+"; stroke: "+nodes[i].style.stroke +"; stroke-width: 1px; opacity: 1.0; visibility: visible");
                visible_documents.push(d3.select(nodes[i]).attr("name"));
            }
        }
        
        //Define a visibilidade das arestas
        d3.selectAll(".link .edge").style("visibility", "hidden")
        var links = d3.selectAll(".link .edge")._groups[0];
        for (var i = 0; i < links.length; i++){
            //console.log( d3.select(links[i]).attr("source") + " -> " + d3.select(links[i]).attr("target") );
            //var n = d3.select("[name=" + "\"" + d3.select(links[i]).attr("source") + "\"" + "]")._groups[0];
            var source = d3.select(links[i]).attr("source");
            var target = d3.select(links[i]).attr("target");
            if (visible_documents.includes(source) && visible_documents.includes(target)){
                links[i].setAttribute("style", "visibility: visible");
            }
        }
    }   
});

//Botão do KNN (Filtro)
$("#filterscatterplotbutton").unbind().click(function(e){
    k = document.getElementById('filterscatterplotinput').value;
    if ((k!=null)&&(k > 0)){
         getSimilarDocuments();
    }
})

//Radio para selecao da Visualizacao no Scatterplot View
$('.scatterplotVisualizations input').on('change', function() {
    var option = $('input[name=inlineRadioOptions]:checked', '.scatterplotVisualizations').val();
    
    //alert(option);
    
    if (option == "Point Cloud") {
        LoadScatterplot(); //Carregar a visualizacao Original (Nuvem de Pontos)
    }

    if (option == "Force Layout") {
        LoadForceLayout(); //Carregar a visualizacao do Force layout
    }

    if (option == "Sankey Graph") {
        //Carregar a visualizacao do Sankey Graph
    }
});

//Slider para modificacao da distancia do cosseno
//$('#sliderCosineDistance').on('input', function() { //Versao em tempo real (Precisaria fazer update no force para evitar muitas requisições ao servidor)
$('#sliderCosineDistance').on('change', function() { //Versao ao soltar o mouse
    var cosDistance = document.getElementById('sliderCosineDistance').value;
    var cosText = document.getElementById('cosinedistancevalue');
    cosText.value = cosDistance;

    var option = $('input[name=inlineRadioOptions]:checked', '.scatterplotVisualizations').val();
    if (option == "Point Cloud") {
        
    } else if (option == "Force Layout") {
        LoadForceLayout();
    }
});

//Slider para modificacao da distancia das arestas
$('#sliderEdgesDistance').on('change', function() { //Versao ao soltar o mouse
    var distance = document.getElementById('sliderEdgesDistance').value;
    var distText = document.getElementById('distancevalue');
    distText.value = distance;

    var option = $('input[name=inlineRadioOptions]:checked', '.scatterplotVisualizations').val();
    if (option == "Point Cloud") {
        
    } else if (option == "Force Layout") {
        LoadForceLayout();
    }
});