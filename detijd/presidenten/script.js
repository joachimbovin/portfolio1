


// set the dimensions and margins of the graph
var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#graph")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


var defs = svg.append("defs");

defs.append("pattern")
  .attr("id", "jon-snow")
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("patternContentUnits", "objectBoundingBox")
  .append("image")
  .attr("height", 1)
  .attr("width", 1)
  .attr("preserveAspectRatio", "none")
  .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
  .attr("xlink:href", "joebiden.jpg")





//Read the data
d3.csv("dataPresidentImages2.csv", function(data) {


  defs.selectAll(".artist-pattern")
  .data(data)
  .enter().append("pattern")
  .attr("class", "artist-pattern")
  .attr("id", 
  function(d) {
    return d.name.toLowerCase().replace(/ /g, "-")
  }
  // "jon-snow"
  )
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("patternContentUnits", "objectBoundingBox")
  .append("image")
  .attr("height", 1)
  .attr("width", 1)
  .attr("preserveAspectRatio", "none")
  .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
  .attr("xlink:href", 
  function(d) {
      return d.imageURL
  }
  )

  // Add X axis
  var x = d3.scaleLinear()
    .domain([1750, 2050])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([35, 80])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain([10, 100])
    .range([ 1, 40]);


// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  var tooltip = d3.select("#graph")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")



  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
      console.log("hello there")
  }

  var mousemove = function(d) {
    tooltip
      .html("name: " + d.name + ", age: " + d.ageStart)
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }


  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.dateStart); } )
      .attr("cy", function (d) { return y(d.ageStart); } )
      .attr("r", function (d) { return z(60); } )
      .style("fill",
      
      //"url(#jon-snow)"
      
 
      function (d) {
        return "url(#" + d.name.toLowerCase().replace(/ /g, "-") + ")"
      }

      )
      
      //#69b3a2
      .style("opacity", "0.7")
      .attr("stroke", "black")
      .on("mouseover", mouseover )
      .on("mousemove", mousemove )
      .on("mouseleave", mouseleave )
  

})
