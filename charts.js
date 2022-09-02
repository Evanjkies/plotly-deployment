function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// CHALLENGE PART 1 BAR CHART

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultsArray = samples.filter(object => object.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultsArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDS = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleVals = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIDS.slice(0,10).map(otuID =>`OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
      var barData = [
      {
      x: sampleVals.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
      
      }  
    ];   
    

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      width: 400, height: 400,
      title: "Top Ten Bacteria Cultures Found",
      showlegend: false,     
      // yaxis: {title: "OTU IDs"},
      // xaxis: {title: "Samples"},
     
          
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

  });
 }

// CHALLENGE PART 2 BUBBLE CHART

// Bar and Bubble charts
// Create the buildCharts function.
// function buildCharts(sample) {
  // // Use d3.json to load and retrieve the samples.json file 
  // d3.json("samples.json").then((data) => {
    

  //   // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
  //   Plotly.newPlot(); 

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otuIDS,
        y: sampleVals,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleVals,
          color: otuIDS,
          colorscale: "Jet"
        }
      }   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 25} 
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

// CHALLENGE PART 3 GAUGE CHART

    // Create a variable that holds the samples array. 

    // Create a variable that filters the samples for the object with the desired sample number.

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
  

    // 2. Create a variable that holds the first sample in the metadata array.
    var metaresults = metadataArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
    var washFreq = metaresults.wfreq;
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b> Belly Button Washing Frequency</b> <br> # of Scrubs per Week" },
      gauge: {
        axis: { range: [null, 10], tickwidth: 2, tickcolor: "black" },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "firebrick" },
          { range: [2, 4], color: "darkorange" },
          { range: [4, 6], color: "greenyellow" },
          { range: [6, 8], color: "lightseagreen" },
          { range: [8, 10], color: "dodgerblue" }
        ],
        threshold: {
          value: washFreq,
        }
      },
      
    }];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 450, height: 400, margin: { t: 0, b: 0 },
      font: { color: "black"}
    };
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}