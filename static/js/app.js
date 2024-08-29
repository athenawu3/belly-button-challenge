// URL
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Promise Pending
const dataPromise = d3.json(url);

// Fetch the JSON data
d3.json(url).then(function(data) {

  // Get names array
  const names = data.names;

  // Select dropdown menu
  const menu = d3.select("select");

  // Append options under dropdown menu
  for (let i=0; i<names.length; i++) {
    let name = names[i];
    menu.append("option").text(name);
  };
});


// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const results = metadata.filter(person => person.id == sample);
    const result = results[0]

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    })

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const results = samples.filter(person => person.id == sample);
    const result = results[0]

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build a Bubble Chart
    let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      type: "scatter",
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids
      },
      hoverinfo: "text"
    };

    let bubble_chart = [bubble_trace];
    
    let bubble_layout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"}
    };

    // Render the Bubble Chart

    Plotly.newPlot("bubble", bubble_chart, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const bar_trace = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    };

    let bar_chart = [bar_trace];

    let bar_layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Number of Bacteria"}
    }

    // Render the Bar Chart
    Plotly.newPlot("bar", bar_chart, bar_layout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const menu = d3.select("select")

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i=0; i<names.length; i++) {
      let name = names[i];
      menu.append("option").text(name);
    };

    // Get the first sample from the list
    let first_sample = names[0];

    // Build charts and metadata panel with the first sample
    let metadata_panel = buildMetadata(names[0]);
    console.log(metadata_panel);
    let charts = buildCharts(names[0]);
    console.log(charts)

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Initialize the dashboard
init();
