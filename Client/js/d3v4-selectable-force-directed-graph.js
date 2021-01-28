var colorFocus = "#17a2b8";       //Relevant (Blue)
var colorSuggestion = "#ffc107";  //Suggested (Yellow)
var colorNotRelevant = "#d75a4a"; //Not Relevant (Red)
var colorBase = "#007527";        //Seed (Green)

function createV4SelectableForceDirectedGraph(svg, graph) {
    // if both d3v3 and d3v4 are loaded, we'll assume
    // that d3v4 is called d3v4, otherwise we'll assume
    // that d3v4 is the default (d3)
    if (typeof d3v4 == 'undefined')
        d3v4 = d3;

    var width = +svg.attr("width"),
        height = +svg.attr("height");

    //let parentWidth = d3v4.select('svg').node().parentNode.clientWidth;
    //let parentHeight = d3v4.select('svg').node().parentNode.clientHeight;
    let parentWidth = $("#scatterplotheader").width();
    let parentHeight = window.innerHeight - margin.top - margin.bottom - $("#termscontainer").height();

    //var svg = d3v4.select('svg')
    var svg = d3v4.select('#scatterplotcontainer svg')
    .attr('width', parentWidth)
    .attr('height', parentHeight)

    // remove any previous graphs
    svg.selectAll('.g-main').remove();

    // Removing any existing menu
        d3.selectAll(".barmenu")
            .remove()   

    var gMain = svg.append('g')
    .classed('g-main', true);

    var rect = gMain.append('rect')
        .attr('width', parentWidth)
        .attr('height', parentHeight)
        .style('fill', 'white')

    var gDraw = gMain.append('g');

    var zoom = d3v4.zoom()
    .extent([[0, 0], [width, height]]) //(Adicionei)
    .scaleExtent([0.5, 20]) //(Adicionei) Sherlon: Zoom [min, max]
    .on('zoom', zoomed)

    gMain.call(zoom);

    function zoomed() {
        gDraw.attr('transform', d3v4.event.transform)
    }

    var color = d3v4.scaleOrdinal(d3v4.schemeCategory20);

    if (! ("links" in graph)) {
        console.log("Graph is missing links");
        return;
    }

    var nodes = {};
    var i;
    for (i = 0; i < graph.nodes.length; i++) {
        nodes[graph.nodes[i].id] = graph.nodes[i];
        graph.nodes[i].weight = 1.01;
    }

    // the brush needs to go before the nodes so that it doesn't
    // get called when the mouse is over a node
    var gBrushHolder = gDraw.append('g');
    var gBrush = null;

    var link = gDraw.append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = gDraw.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        /*.attr("fill", function(d) { 
            if ('color' in d)
                return d.color;
            else
                return color(d.group); 
        })*/
        .attr("fill", function(d) {return ScatterplotColor(d.id)})     //Sherlon: Adiciona a cor dos documentos
        .attr("stroke", function(d) {return ScatterplotStroke(d.id)})  //Sherlon: Adiciona a borda (Read / Unread)
        .call(d3v4.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

      
    // add titles for mouseover blurbs
    node.append("title")
        .text(function(d) { 
            if ('name' in d)
                return d.name;
            else
                return d.id; 
        });

    var simulation = d3v4.forceSimulation()
        .force("link", d3v4.forceLink()
                .id(function(d) { return d.id; })
                .distance(function(d) { 
                    return 30;
                    //var dist = 20 / d.value;
                    //console.log('dist:', dist);
                    return dist; 
                })
              )
        .force("charge", d3v4.forceManyBody())
        .force("center", d3v4.forceCenter(parentWidth / 2, parentHeight / 2))
        .force("x", d3v4.forceX(parentWidth/2))
        .force("y", d3v4.forceY(parentHeight/2));

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        // update node and line positions at every step of 
        // the force simulation
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    var brushMode = false;
    var brushing = false;

    var brush = d3v4.brush()
        .on("start", brushstarted)
        .on("brush", brushed)
        .on("end", brushended);

    function brushstarted() {
        // keep track of whether we're actively brushing so that we
        // don't remove the brush on keyup in the middle of a selection
        brushing = true;

        node.each(function(d) { 
            d.previouslySelected = shiftKey && d.selected; 
        });
    }

    rect.on('click', () => {
        node.each(function(d) {
            d.selected = false;
            d.previouslySelected = false;
        });
        node.classed("selected", false);
    });

    function brushed() {
        if (!d3v4.event.sourceEvent) return;
        if (!d3v4.event.selection) return;

        var extent = d3v4.event.selection;

        node.classed("selected", function(d) {
            return d.selected = d.previouslySelected ^
            (extent[0][0] <= d.x && d.x < extent[1][0]
             && extent[0][1] <= d.y && d.y < extent[1][1]);
        });
    }

    function brushended() {
        if (!d3v4.event.sourceEvent) return;
        if (!d3v4.event.selection) return;
        if (!gBrush) return;

        gBrush.call(brush.move, null);

        if (!brushMode) {
            // the shift key has been release before we ended our brushing
            gBrush.remove();
            gBrush = null;
        }

        brushing = false;
    }

    d3v4.select('body').on('keydown', keydown);
    d3v4.select('body').on('keyup', keyup);

    var shiftKey;

    function keydown() {
        shiftKey = d3v4.event.shiftKey;

        if (shiftKey) {
            // if we already have a brush, don't do anything
            if (gBrush)
                return;

            brushMode = true;

            if (!gBrush) {
                gBrush = gBrushHolder.append('g');
                gBrush.call(brush);
            }
        }
    }

    function keyup() {
        shiftKey = false;
        brushMode = false;

        if (!gBrush)
            return;

        if (!brushing) {
            // only remove the brush if we're not actively brushing
            // otherwise it'll be removed when the brushing ends
            gBrush.remove();
            gBrush = null;
        }
    }

    function dragstarted(d) {
      if (!d3v4.event.active) simulation.alphaTarget(0.9).restart();
        //console.log(d.id); //Sherlon: Select the document in force layout

        OpenDocument(d.id);      //Sherlon: Retrieve and Show in the System the Document Content
        GetWordFrequency(d.id);  //Sherlon: Retrieve and Show in the System the Document Word Cloud

        if (!d.selected && !shiftKey) {
            // if this node isn't selected, then we have to unselect every other node
            node.classed("selected", function(p) {
                return p.selected =  p.previouslySelected = false;
            });
        }

        d3v4.select(this).classed("selected", function(p) { 
            d.previouslySelected = d.selected;
            return d.selected = true;
        });

        node.filter(function(d) { return d.selected; })
        .each(function(d) { //d.fixed |= 2; 
          d.fx = d.x;
          d.fy = d.y;
        })


        /*********************************************************************************************/
        //Sherlon: Funcionalidades para manipular os documentos pelo force layout (Copiei do Scatterplot e adaptei)

        var barHeight = 30;  
        var barWidth = 110;

        //d3.selectAll(".circle")
        //d3.select(this).style("stroke-width", "3px")
        var selected_circle = d3.select(this);
        d.name = d.id; //Sherlon: Criar compatibilidade com as funcoes ja implementadas

        //Sherlon: Access circles information:
        //console.log(selected_circle.attr("cx"));
        //console.log(selected_circle.attr("cy"));
        //console.log(selected_circle.style("fill"));

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
            yPos = event.pageY - 55;

            d3.select("div#menucontainer")
                .style("left", function(){
                    return (event.pageX - 55) + "px";
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
                        setSimilarDocumentsAsRelevant(d.id)
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
                        setSimilarDocumentsAsNotRelevant(d.id)
                    })
            }
        }


        /*********************************************************************************************/

    }

    function dragged(d) {
        //d.fx = d3v4.event.x;
        //d.fy = d3v4.event.y;
        node.filter(function(d) {
            return d.selected;
        })
        .each(function(d) { 
            d.fx += d3v4.event.dx;
            d.fy += d3v4.event.dy;
        })
    }

    function dragended(d) {
        if (!d3v4.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
            node.filter(function(d) { return d.selected; })
                .each(function(d) { //d.fixed &= ~6; 
            d.fx = null;
            d.fy = null;
        })
    }

    /* //Sherlon: Remove os textos explicativos
    var texts = ['Use the scroll wheel to zoom',
                 'Hold the shift key to select nodes']

    svg.selectAll('text')
        .data(texts)
        .enter()
        .append('text')
        .attr('x', 900)
        .attr('y', function(d,i) { return 470 + i * 18; })
        .text(function(d) { return d; });*/

    return graph;
};