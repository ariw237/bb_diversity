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

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    //console.log(data);
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSampleArray = samples.filter(objNum => objNum.id == sample)
    //  5. Create a variable that holds the first sample in the array.
    var filteredSample = filteredSampleArray[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = filteredSample.otu_ids;
    var otuLabels = filteredSample.otu_labels;
    var sampleValues = filteredSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.

    var yticks =  otuIds;


    // 8. Create the trace for the bar chart.
    var barData = [{x:sampleValues.slice(0,10).reverse(),
                    y: yticks.slice(0,10).reverse().map(id => "OTU " + id.toString()),
                    type: 'bar',
                    orientation: 'h',
                    text: otuLabels.slice(0,10).reverse()}];
    // 9. Create the layout for the bar chart.
    var barLayout =  {
      title: "<b>Top Ten Bacterial Species</b>",
      xaxis: {title: "Sample Amounts" },
      yaxis: {title: "Bacteria Sample ID"},
      paper_bgcolor: '#D3D3D3',
      plot_bgcolor: '#A9A9A9',
      height:375


    };

   var barConfig = {responsive:true}
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout, barConfig);
    var bubbleData = [
                     {x:otuIds,
                      y:sampleValues,
                      mode: 'markers',
                      text: otuLabels,
                      marker: {size: sampleValues,
                               color: otuIds}
                      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {title: "<b>Bacteria Cultures Per Sample</b>",
                        xaxis: {title:"OTU ID"},
                        yaxis:{title: "Sample Amount"},
                        paper_bgcolor: '#D3D3D3',
                        plot_bgcolor: '#A9A9A9',
                        autosize:true

    };
    var bubbleConfig = {responsive:true}

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, bubbleConfig);
    var metaData = data.metadata;
    var filteredMetaData = metaData.filter(objNum => objNum.id == sample);
    var filteredMetaID = filteredMetaData[0];
    var wfreq = filteredMetaID.wfreq;
    var gaugeData = [{
      domain:{row:0 , column:0},
      value: wfreq,

      type: "indicator",
      mode: "gauge+number",
      gauge:{
        axis: {range: [0,10], tickwidth:1},
        bar:{color:"black"},
        steps:[{range:[0,2], color: "red"},
              {range:[2,4], color: "orange"},
              {range:[4,6], color: "yellow"},
              {range:[6,8], color: "green"},
              {range:[8,10], color: "darkgreen"}]
      }
    }

    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {width:360, height:375,
    paper_bgcolor: '#D3D3D3',
    title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",

    };
    var gaugeConfig = {responsive:true}
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout, gaugeConfig);


  });

}
