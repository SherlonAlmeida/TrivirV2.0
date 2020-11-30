function LoadWordcloud(words){
  var myWords = JSON.parse(words);

  // List of words
  /*var myWords = [{text: "Running", size: "10"},
                 {text: "Surfing", size: "20"},
                 {text: "Climbing", size: "50"},
                 {text: "Kiting", size: "30"},
                 {text: "Sailing", size: "20"},
                 {text: "Snowboarding", size: "60"},
                 {text: "Football", size: "5"},
                 {text: "Volleyball", size: "3"}]*/

  var colors = ["#1F77B4", "#AEC7E8", "#FF7F0E", "#FFBB78", "#2CA02C", "#34CDC6", "#E276F1",
                "#DEDB67", "#EE3E3E", "#F19D2B "]

  // set the dimensions and margins of the graph
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = $("#wordcloudviewdiv").width(),
      height = (window.innerHeight * 0.40) - $("#termscontainer").height() - $("#docviewmenu").height() - 30;  //- margin.top - margin.bottom;

  //Sherlon: Removes the previous wordcloud by the Class Name
  d3.selectAll(".wordcloudlayout")
              .remove()
  // append the svg object to the body of the page
  var svg = d3.select("#wordcloudviewdiv").append("svg")
      .attr("class", "wordcloudlayout") //Sherlon: Creates a Class Name to removes in every call
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
  // Wordcloud features that are different from one word to the other must be here
  var layout = d3.layout.cloud()
    .size([width, height])
    .words(myWords.map(function(d) { return {text: d.text, size: d.size}; }))
    .padding(10) //space between words
    .rotate(0) //.rotate(function() { return ~~(Math.random() * 2) * 90; }) //rotation angle in degrees
    .fontSize(function(d) { return (d.size*2) + 15; }) // font size of words
    .on("end", draw);
  layout.start();


  // This function takes the output of 'layout' above and draw the words
  // Better not to touch it. To change parameters, play with the 'layout' variable above
  // Wordcloud features that are THE SAME from one word to the other can be here
  function draw(words) {
    svg
      .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size; })
          .style("fill", function(d) { return colors[Math.floor(Math.random() * (colors.length - 1))]; })
          .attr("text-anchor", "middle")
          .style("font-family", "Impact")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
  }

}