
// HELPER FUNCTIONS 
function replaceUnderscores(str) {
  /*
    replaces underscore characters with spaces
  */

  return str.replace(/_/g, ' ')
}


function isOverflowed() {
  /*
    check to see if the instructions area is overflowed - typically caused by a very long bases sequence
  */
  if (d3.selectAll('.tooltip-container')[0][0].scrollHeight >  d3.selectAll('.tooltip-container')[0][0].clientHeight) {
    d3.selectAll(".show-overflow-btn")
    .style("display", "inline")
    toggleOverflow()
  } else {
     d3.selectAll(".show-overflow-btn")
    .style("display", "none")   
  }
}

function toggleOverflow() {
   /*
    expand the instruction area to allow the user to see all of the content that is contained in the area
    also allows the user to collaps the content back to its original size
  */ 
  var overflowBtn = d3.select('.show-overflow-btn')
    overflowBtn.on('click', function(d) {

      if (overflowBtn[0][0].value == "Show More") {

        d3.selectAll('.tooltip-container')
          .style("max-height", "inherit")
          .style("overflow", "");
          overflowBtn[0][0].value = 'Show Less'

        } else {

        d3.selectAll('.tooltip-container')
          .style("max-height", "360px")
          .style("overflow", "hidden");
          overflowBtn[0][0].value = 'Show More'        
        }
      
    })    
  }

// MAIN CHART FUNCTIONS
function createPlasmaidDiagram() {
  /*
    main function that will render the plasmaid diagram as well as the legend
    also controls any of the animation and interactivity
  */

  // initialize the properties that will be used to set the size of the svg
  var width = 460,
      height = 320,
      radius = Math.min(width, height) / 2

  // d3 builtin that creates an array of 20 colors
  var color = d3.scale.category20()

  // initialize the arc object which is one of the keys to creating the plasmaid diagram
  var arc = d3.svg.arc()
      .outerRadius(function(d) {

        // check to see if its a nullFeature as we want them to be more narrow than real dna features
        if (d.data.name == 'nullFeature') {
          return radius - 10
        } else {
          return radius - 0  
        }
      })
      
        // check to see if its a nullFeature as we want them to be more narrow than real dna features
      .innerRadius(function(d) {
        if (d.data.name == 'nullFeature') {
          return radius - 15
        } else {
          return radius - 30  
        }
      });
   
   // object that will allow each dna feature to expand when selected by the user to indicate that it is selected
  var increaseArc = d3.svg.arc()
      .outerRadius(function(d) {
        if (d.data.name == 'nullFeature') {
          return radius - 10
        } else {
          return radius - 0  
        }
      })
      .innerRadius(function(d) {
        if (d.data.name == 'nullFeature') {
          return radius - 15
        } else {
          return radius - 40  
        }
      });     

  // d3.layout.pie will create teh start and end angles of the segments used in the diagram
  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.size; });

  var svg = d3.select(".chart").append("svg")
      .attr("width", width)
      .attr("height", height+20)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 1.9 + ")");

  var tooltip = d3.selectAll('.tooltip-container')

  // ajax call to get the json file with our data
  d3.json("/fixtures/dnamolecule.json", function(error, dataset) {

    // convert and extract the data so that it is easy to work with in d3
    var data = convertData(dataset)

      // sort the data in ascending order based on the start value of each object
      // this is done so that I can fill in the "missing" values needed to complete the plasmaid
      data.sort(function(a, b) {
          return parseFloat(a.start) - parseFloat(b.start);
      });

      data = addMissingData(data);

    // initialize our object that will create the elements of the pasmaid
    var g = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("path")
      .attr("d", arc)
      .attr("class", "arc")

      // we only want to give color to real dna features, not nullFeatures
      .style("fill", function(d,i) {
        if (d.data.name == 'nullFeature') {
          return "black"
        } else {
          return color(i); 
        }
      })
      .each(function(d) { this._current = d; })
      
      // event that updates our 'instructions' area with information about the selected dna feature
      g.on('click', function(d) {

        // check to see if currentFeature has been initialized
        if (typeof currentFeature !== 'undefined') {
           
          // reduce the size of the last selected feature
           d3.select(currentFeature)
          .transition()
          .duration(1000)
          .attr("d", arc)
        }
     
        // clear the current text
        tooltip.text('');

        // update the instructions area once a dna feature is selected
        if (d.data.name != "nullFeature") {
          tooltip.append("g").append("text").html("<h4>"+d.data.name+" - " + d.data.strand + "</h4> <hr /> <h5>"  + "</h5><p class='feature-start-end'>["+ d.data.start +"] Start - [" + d.data.end +"] End </p>" +d.data.bases );   
        } else {
          tooltip.append("g").append("text").html("<h4>Welcome to DNA Viewer</h4><hr/><span class='instructions'> Using DNA Viewer, you can explore the DNA features of a DNA molecule. To your left, you will find a Plasmid Diagram that visually shows the features of the DNA molecule. Clicking on one of the DNA features in the Plasmid Diagram will replace this text with more information about the feature such as its sequence and direction. Selecting one or multiple rectangles in the legend will add or remove that feature from the Plasmid Diagram. In the table below, you can view the high level features. </span>")
        }

      var total = d3.sum(data.map(function(d) {
        return (d.enabled) ? d.size : 0;        
        })
      );

      // keep track of the selected feature so that its arc can be decreased when a new feature is selected
      currentFeature = this
      d3.select(this)
        .transition()
        .duration(1000)
        .attr("d", increaseArc)

      // check to see if information related to the selected feature overflows the text area
      isOverflowed()
      
    });

function createLegendData(data) {
  /* 
    creates new dataset with nullFeatures removed so that the black areas of the chart do not show up in the legend
  */
var legendData = [];
data.forEach(function(d, i) {

  if (d.name != "nullFeature") {

    // keep the original indexes so that the legend color matches the chart
    d.colorIndex = i

    legendData.push(d)
  }
})
  return legendData
}

function createLegend(legendData) {
  /* 
    creates legend for the plasmaid
  */
  var legend = d3.select(".chart").append("svg")
    .attr("class", "legend")
    .attr("width", radius)
    .attr("height", radius * 2)
    .selectAll("g")
    .data(legendData)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * 21 + ")"; });

    legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("class", "legend-rect")
      .style("fill", function(d, i) { return color(d.colorIndex); })
      .style("stroke",function(d, i) { return color(d.colorIndex); })

      // removes the feature from the diagram and makes the legend reflect the change
      .on('click', function(label) {
        var rect = d3.select(this);
        var enabled = true;
        var totalEnabled = d3.sum(data.map(function(d) {
          return (d.enabled) ? 1 : 0;
          })
        );
      
        if (rect.attr('class') === 'disabled') {
          rect.attr('class', '');
        } else {
          if (totalEnabled < 2) return;
          rect.attr('class', 'disabled');
          enabled = false;
        }

    pie.value(function(d) {
      if (d === label) d.enabled = enabled;
      return (d.enabled) ? d.size : 0;
    });

    path = g.data(pie(data));

   // this is the key to updating the diagram
   path.transition()
      .duration(750)
      .attrTween('d', function(d) {
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          return arc(interpolate(t));
        };
      });
  });

  legend.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; })

  }

// create the legend data
var legendData = createLegendData(data);

  // render the legend
  createLegend(legendData);

  // render the table
var summaryTable = tabulate(data, ["name", "type", "start", "end", "strand", "size"]);
  d3.selectAll(".hidden-row")
  .style("display", "none");
})
}

// FUNCTIONS USED WITHIN createChart 
function convertData(dataset) {
  /*
    extracts the necessary data from the original dataset and converts into an
    array of objects which is necessary for work with this particular d3.js layout
  */
  // initialize array that will store our data in a format suitable for d3.js
  data = []

  // iterate over data to extract what is decessary necessary 
  dataset.dnafeatures.forEach(function(d,i) {
    
    // initialize object that will store the dna features needed for analysis
    dnafeature = {};
    dnafeature.name = replaceUnderscores(d.dnafeature.name)
    dnafeature.size = d.dnafeature.length;
    dnafeature.bases = d.dnafeature.pattern.bases;
    dnafeature.start = parseFloat(d.start)
    dnafeature.end = d.end;
    
    // used for styling and has nothing to do with a gene
    dnafeature.display = "" 

    if (d.strand === -1) {
      dnafeature.strand = "Backward"
    } else {
      dnafeature.strand = "Forward"
    }
    dnafeature.type = replaceUnderscores(d.dnafeature.category.name)
    
    // used for adding or removing data from the plasmaid when a rectangle in the legend is selected
    dnafeature.enabled = true; 
    
    data.push(dnafeature);

  })
  return data
} 


function addMissingData(data) {
  /*
    the data in its current form has gaps that need to be filled to complete the plasmaid
    the data looks like [{start:29, end:58}, {start:283, end: 389}...]
    it needs to look like [{start:0, end:28}, {start:29, end:58}, {start:59, end:282}...]
    this function will iterate over our current data, identify the 'gaps', and insert a nullFeature
    object into the data array that contains the missing start and end values
  */
  for (i in data) {

    if (i  % 2 === 1) {

      // compare data object i with data object i-1 to see if there are missing gaps
      if ( data[i-1].end + data[i-1].size + 1 != data[i].start ) {

        // initialize the nullFeature object
        nullFeature = {}

        // this isn't a real feature so it doesn't have a name
        nullFeature.name = 'nullFeature'

        // check to see if it's the first data object which needs to contain start:0
        if (i-1 == 0) {
          nullFeature.start = data[i-1].start - (data[i-1].end - data[i-1].size)

        } else {

          // set the start value of the nullFeature
          nullFeature.start = data[i-1].end + 1
        }

        // set the end value of the nullFeature
        nullFeature.end = data[i].start - 1

        // set the size value of the nullFeature
        nullFeature.size = nullFeature.end - nullFeature.start

        // this isn't a real feature so it doesn't have a bases
        nullFeature.bases = ''

        // used for styling in the legend
        nullFeature.display = "none"
        
        // nullFeatures don't have a direction
        nullFeature.strand = ""
        
        // nullFeatures don't have a type
        nullFeature.type = ""

        // used for adding or removing data from the plasmaid when a rectangle in the legend is selected
        nullFeature.enabled = true
        
        // insert the nullFeature into the data array with the real dna features
        data.splice(i-1,0,nullFeature)
      }
    } 
  } 
  return data
}


function tabulate(data, columns) {
  /*
  // generates the summary table
  */
    var table = d3.select(".summary-table").append("table")
            .attr("class", "table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .attr("class", function(d) {
          if (d.name == "nullFeature") {
            return "hidden-row"
          } else {
            return "visibile-row"
          }
        })

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier") // sets the font style
        .html(function(d) { return d.value; })
        
        // set the class so that we can hide nullFeatures in the table
        .attr("class", function(d) {
          if (d.value == "") {
            return "hideTableRow"
          } else {
            return "showTableRow"
          }
        })
    return table;
}


$(document).ready(function() {
  createPlasmaidDiagram();
})