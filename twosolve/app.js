import React from "react";
import Two from "lib/two";
import simian from "cube-simian";
import solve from "lib/compiled/solve";
import two from "lib/compiled/two";

var colours = ["white", "orange", "green", "red", "yellow", "blue"];

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
          fill: colours[this.props.side],
          stroke: "black",
          strokeWidth: 3
        }}
      />
    </svg>;
  }
}

class ControllableCube extends React.Component {
  constructor() {
    super();
    var self = this;
    this.state = {
      cube: new Two(),
      keypressListener: document.addEventListener("keypress", function(e) {
        self.setState({
          cube: self.state.cube.apply(simian.keycodeToMove(e.keyCode))
        });
      })
    }
  }

  componentDidUnmount() {
    document.removeEventListener(this.state.keypressListener);
  }

  render() {
    var solution = solve({
      puz: two,
      state: {
        perm: this.state.cube.getPerm(),
        orie: {
          perm: [0, 1, 2, 3, 4, 5, 6],
          orie: this.state.cube.getOrie()
        }
      },
      justOne: false
    });
    return <div>
      <div id="solutions">
        <Cube cube={this.state.cube} />
        <div>{solution.map(s => <span>{s}<br /></span>)}</div>
      </div>
    </div>;
  }
}

class Cube extends React.Component {
  render() {
    return <div id="cube">
      <svg height="410" width="310">
        {this.props.cube.stickers().map((sticker, i) => <Sticker side={this.props.cube.colourAt(i)} index={i} />)}
      </svg>
    </div>
  }
}

React.render(<ControllableCube />, document.getElementById("mount"));
