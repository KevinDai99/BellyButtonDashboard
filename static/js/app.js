let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init() {
    // Select the dropdown element
    var data_selector = d3.select("#selDataset");
    
    // Populate the dropdown with subject ID's from the list of sample Names
      d3.json(url).then((data) => {
        var subject_ID = data.names;
        subject_ID.forEach((id) => {
          data_selector
          .append("option")
          .text(id)
          .property("value", id);
        });
      
      // Use the first subject ID from the names to build initial plots
      const firstPerson = subject_ID[0];
      updateCharts(firstPerson);
      updateMetadata(firstPerson);
    });
  }
  
  
  
  function updateMetadata(sample) {
    d3.json(url).then((data) => {
        var metadata = data.metadata;
        var filterArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = filterArray[0];
        var metaPanel = d3.select("#sample-metadata");
        metaPanel.html("");
        Object.entries(result).forEach(([key, value]) => {
            metaPanel.append("h6").text(`${key.toLowerCase()}: ${value}`)
        })
    });
  }
  
  
  function updateCharts(sample) {    
    d3.json(url).then((data) => {
    var samples = data.samples;
    var filterArray = samples.filter(sampleObject => sampleObject.id == sample);
    var result = filterArray[0];
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;   
    // Bubble Chart
    var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
        colorscale:"Electric"
        }
    };
    var data = [trace1];
    var layout = {
        title: 'Bacteria Cultures per Sample',
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
        margin: {t:30}
    };
    Plotly.newPlot('bubble', data, layout); 
    // Bar Chart
    var trace1 = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        name: "Greek",
        type: "bar",
        orientation: "h"
    };
    var data = [trace1];
    var layout = {
        title: "Top Ten OTUs for Individual " +sample,
        margin: {l: 100, r: 100, t: 100, b: 100}
    };
    Plotly.newPlot("bar", data, layout);  
    });
  }
  
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    updateCharts(newSample);
    updateMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();