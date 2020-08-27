import React, {Component, memo} from "react";
import {csv, extent} from "d3";
import ReactTooltip from "react-tooltip";
import Map from './Components/Map'
import "./styles.css";

const queryString = require('query-string');

class App extends Component {

  state ={
    data: {},
    ready: false,
    width: window.innerWidth,
    height: window.innerHeight - 5,
    content: '',
    scale: 3000,
    font: 4
  }

  componentDidMount() {
    let urlString = queryString.parse(window.location.search, {decode: false})
    console.log(urlString)
    if (urlString.url) {
      csv(urlString.url)
      .then(d => {
        this.setState({data: d, ready: true})
        console.log("Min/Max", extent(d.map(item => item.sum)))
      })
    }
    if (urlString.scale) {
      this.setState({scale: urlString.scale})
    }
    if (urlString.font) {
      this.setState({font: urlString.font})
    }
  }

  setTooltipContent = (current) => {
    let content
    if (current) {
      content = `${current.name} — ${current.sum}`
    }
    else {
      content = current
    }
    this.setState({content: content})
  }
  
  render() {
    return (
      this.state.ready ? <div>
        <Map data={this.state.data} setTooltipContent={this.setTooltipContent} scale={this.state.scale} font={this.state.font} />
        <ReactTooltip>{this.state.content}</ReactTooltip>
      </div> : null
    )
  }
};

export default App
