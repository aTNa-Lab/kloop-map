import React, {Component} from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import {csv, scaleSequential, interpolate, extent} from "d3";
import { geoCentroid } from "d3-geo";

const queryString = require('query-string');


const geoUrl = "https://raw.githubusercontent.com/aTNa-Lab/RepForTests/master/kg_districs.json"
// const csvUrl = "https://raw.githubusercontent.com/aTNa-Lab/RepForTests/master/kg_map_data.csv"

class App extends Component {

  state ={
    data: {},
    ready: false,
    width: window.innerWidth,
    height: window.innerHeight - 5
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);

    let urlString = queryString.parse(window.location.search, {decode: false})
    console.log(urlString)
    if (urlString.url) {
      csv(urlString.url)
      .then(d => {
        this.setState({data: d, ready: true})
        console.log("Min/Max", extent(d.map(item => item.sum)))
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight - 5 });
  };

  colorScale = scaleSequential().domain([100,1000]).interpolator(interpolate("white", "orange"));

  returnColor = (geoProp) => {
    let color = ""
    this.state.data.map(d => {
      if (d.name === geoProp.name) {
        color = this.colorScale(d.sum)
      }
    })
    return color
  }

  returnCurrent = (geoProp) => {
    let current = ""
    this.state.data.map(d => {
      if (d.name === geoProp.name) {
        current = d
      }
    })
    return current
  }
  
  render() {
    console.log(this.state)
    return (
    this.state.ready ? <div>
      <ComposableMap projection="geoEqualEarth" width={this.state.width} height={this.state.height} projectionConfig={{scale: 4000}}>
      {/* <ComposableMap height={353} > */}
      {/* <ZoomableGroup zoom={25} maxZoom={200} minZoom={22} center={[74.5,41.2]} > */}
      <ZoomableGroup center={[74.5,41.2]} zoom={2.3}>
      <Geographies geography={geoUrl}>
        {({ geographies }) => (
          <>
            {geographies.map(geo => (
              <Geography
                key={geo.rsmKey} 
                geography={geo} 
                fill={this.returnColor(geo.properties)}
                stroke="#FFF"
                strokeWidth="0.01"
                style={{
                  default: {outline: "none"},
                  hover: {outline: "none"},
                  pressed: {outline: "none"}
                }}
              />
            ))}
            {geographies.map(geo => {
              const centroid = geoCentroid(geo);
              const current = this.returnCurrent(geo.properties)
              return (
                <g key={geo.rsmKey + "-name"}>
                  <Marker coordinates={centroid}>
                    <text fontSize={4} textAnchor="middle">
                      {geo.properties.name}
                    </text>
                    <text y={6} fontSize={4} textAnchor="middle">
                      {current.sum}
                    </text>
                  </Marker>
                </g>
              );
            })}
          </>
        )}
      </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div> : null
)}};

export default App
