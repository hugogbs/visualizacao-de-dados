
var width = 1000;
var svg = d3.select("#chart")
    .append("svg")
    .attr('version', '1.1')
    .attr('viewBox', '0 0 '+width+' '+width)
    .attr('width', '100%')
    .attr('class', 'bubble-chart');

var format = d3.format(",d");

var color = d3.scaleOrdinal(['#1f77b4']);
//var color = d3.scaleOrdinal(['#bcbd22', '#17becf']);
//var color = d3.scaleQuantize(d3.schemeCategory10);

var pack = d3.pack()
    .size([width, width])
    .padding(1.5);

d3.json("https://rawgit.com/hugogbs/visualizacao-de-dados/master/data/letras.json", function(error, classes) {
  if (error) throw error;

  // Altera o tipo de dado
//  classes.forEach(function(d) {
//    d.id = +d.id;
//    d.value = +d.capacidade;
//    d.class = d.estado;
//  });

  classes.forEach(function(d) {
    d.id = +d.id;
    d.value = +d.frequency;
    d.class = d.letter;
  });

  var root = d3.hierarchy({children: classes})
      .sum(function(d) { return d.value; })
      .sort( function(a, b) { return -(a.value - b.value); });

  var node = svg.selectAll(".node")
    .sort( function(a, b) { return  -1;} )
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("circle")
      .transition().delay(500).duration(2000)
      .attr("id", function(d) { return d.data.id; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return d.color; });

  node.append("clipPath")
      .attr("id", function(d) { return "clip-" + d.data.id; })
    .append("use")
      .attr("xlink:href", function(d) { return "#" + d.data.id; });

  node.append("text")
      .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
    .selectAll("tspan")
    .data(function(d) { return d.data.class; })
    .enter().append("tspan")
      .text(function(d) { return d; });

});
