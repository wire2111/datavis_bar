
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

function getData(URL) {
  return fetch(URL)
    .then(response => response.json())
    .then(data => {
      
      const DATA = data
    
      const WIDTH = 1000;
      const HEIGHT = 500;
      const PADDING = 40;
      
      const DATE_INDEX = 0;
      const GDP_INDEX = 1;
      
      const DATE_MIN_DOMAIN = DATA.from_date; //"1947-01-01" real min
      const DATE_MAX_DOMAIN = DATA.to_date; //"2015-07-01" real max
      
      const GDP_MIN_DOMAIN = d3.min(DATA.data, d => d[1]); //243.1 real min
      const GDP_MAX_DOMAIN = d3.max(DATA.data, d => d[1]); //18064.7 real max
      
      const BAR_WIDTH = (WIDTH - PADDING * 2) / DATA.data.length;
      
      const dateScale = d3.scaleTime(
        [new Date(DATE_MIN_DOMAIN), new Date(DATE_MAX_DOMAIN)],
        [PADDING, WIDTH - PADDING]
      )
      
      const gdpScaleYStart = d3.scaleLinear(
        [0, GDP_MAX_DOMAIN],
        [HEIGHT - PADDING, PADDING]
      )
      
      const xAxisDate = d3.axisBottom(dateScale)
      const yAxisGDP = d3.axisLeft(gdpScaleYStart)
      
      function handleMouseOver(event) {
        if (event.target.dataset.gdp) {
          document.getElementById("tooltip").style.visibility = "visible";
          document.getElementById("tooltip").innerHTML = `<p>DATE: ${event.target.dataset.date}</p>
                                                          <p>GDP: ${event.target.dataset.gdp}</p>`;
          document.getElementById("tooltip").setAttribute("data-date", event.target.dataset.date);
        }
      }
      
      
      function handleMouseOut() {
        document.getElementById("tooltip").style.visibility = "hidden";
      }
      
      
      /*
      console.log("min date: ", dateScale(new Date("1947-01-01")));
      console.log("max date: ", dateScale(new Date("2015-07-01")));
      
      console.log("min gdpY: ", gdpScaleYStart(243.1));
      console.log("max gdpY: ", gdpScaleYStart(18064.7));
      */
      
      
      
      const svg = d3.select("#vis")
                    .append("svg")
                      .attr("width", WIDTH)
                      .attr("height", HEIGHT);
      
      svg.selectAll("rect")
         .data(DATA.data)
         .enter()
         .append("rect")
           .attr("x", (d,i) => BAR_WIDTH * i + PADDING)
           .attr("y", d => gdpScaleYStart(d[GDP_INDEX]))
           .attr("width", BAR_WIDTH)
           .attr("height", d => HEIGHT - PADDING - gdpScaleYStart(d[GDP_INDEX]))
           .attr("class", "bar")
           .attr("data-date", d => d[DATE_INDEX])
           .attr("data-gdp", d => d[GDP_INDEX])
           .on("mouseover", e => handleMouseOver(e))
           .on("mouseout", e => handleMouseOut());
      
      
      svg.append("g")
           .attr("transform", `translate(0, ${HEIGHT-PADDING})`)
           .attr("id", "x-axis")
           .call(xAxisDate);
      
      svg.append("g")
           .attr("transform", `translate(${PADDING}, 0)`)
           .attr("id", "y-axis")
           .call(yAxisGDP); 
      
      d3.select("#wrap")
        .append("div")
          .style("visibility", "hidden")
          .attr("id", "tooltip")
          .text("ohi")
      
    })
}

getData(URL)


