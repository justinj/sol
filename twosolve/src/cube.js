import React from "react";
import simian from "cube-simian";
import getColours from "src/getColours";

var locations = [
  {x: 2, y: 0},
  {x: 3, y: 0},
  {x: 2, y: 1},
  {x: 3, y: 1},
  {x: 0, y: 2},
  {x: 1, y: 2},
  {x: 2, y: 2},
  {x: 3, y: 2},
  {x: 4, y: 2},
  {x: 5, y: 2},
  {x: 0, y: 3},
  {x: 1, y: 3},
  {x: 2, y: 3},
  {x: 3, y: 3},
  {x: 4, y: 3},
  {x: 5, y: 3},
  {x: 2, y: 4},
  {x: 3, y: 4},
  {x: 2, y: 5},
  {x: 3, y: 5},
  {x: 2, y: 6},
  {x: 3, y: 6},
  {x: 2, y: 7},
  {x: 3, y: 7}
];

var STICKER_SIZE = 50;
class Sticker extends React.Component {
  render() {
    var loc = locations[this.props.index];
    return <svg>
      <rect x={5 + loc.x * STICKER_SIZE} y={5 + loc.y * STICKER_SIZE}
        width={STICKER_SIZE} height={STICKER_SIZE}
        style={{
          fill: getColours()[this.props.side],
          stroke: "black",
          strokeWidth: 3
        }}
        onClick={e => this.props.onClick(this.props.index)}
      />
    </svg>;
  }
}

class Cube extends React.Component {
  render() {
    return <div id="cube">
      <svg height="410" width="310">
        {this.props.cube.stickers().map((sticker, i) =>
                                        <Sticker
                                          side={this.props.cube.colourAt(i)}
                                          index={i}
                                          onClick={this.props.onClick}/>)}
      </svg>
    </div>
  }
}

class ControllableCube extends React.Component {
  constructor() {
    super();
    this.state = {
      keypressListener: document.addEventListener("keypress", e => {
        this.props.onChange(this.props.cubeState.apply(simian.keycodeToMove(e.keyCode)));
      })
    }
  }

  componentDidUnmount() {
    document.removeEventListener(this.state.keypressListener);
  }

  render() {
    return <Cube
      cube={this.props.cubeState}
      onClick={this.props.onClick} />;
  }
}

export default ControllableCube;
