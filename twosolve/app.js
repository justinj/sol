import React from "react";
import ControllableCube from "src/cube";
import Palette from "src/palette";
import getColours from "src/getColours";
import Two from "src/two";
import solve from "lib/compiled/solve";
import two from "lib/compiled/two";

class Ui extends React.Component {
  constructor() {
    super()
    this.state = {
      cubeState: new Two(),
      selectedColour: getColours()[0]
    };
  }

  render() {
    return <div>
      <ControllableCube
        cubeState={this.state.cubeState}
        onChange={this.handleChangeState.bind(this)}
        onClick={this.handleClickOnCube.bind(this)}
      />
      <Palette
        selectedColour={this.state.selectedColour}
        onChangeColour={this.handleChangeColour.bind(this)}
      />
      <div>{this.state.solution}</div>
      <button onClick={this.handleSolve.bind(this)}>SOLVE THAT SHIZ</button>
    </div>;
  }

  _oriesForType(type) {
    return this.state.cubeState.pieces().map(p => p.orientationType === type ? p.orientation : 0);
  }

  handleSolve() {
    let puzzle = this.state.cubeState.solPuzzle();
    let ories = this.state.cubeState.pieces().map(piece => piece.orientation);
    let orieComponent = {
      perm: [0, 1, 2, 3, 4, 5, 6],
      // TODO: questionable?
      orientations: {
        0: this._oriesForType(0),
        1: this._oriesForType(1),
        2: this._oriesForType(2),
        3: this._oriesForType(3)
      }
    }
    this.setState({
      solution: solve({
        puz: puzzle,
        state: {
          perm: [0, 1, 2, 3, 4, 5, 6],
          orieUD: orieComponent,
          orieFB: orieComponent,
          orieLR: orieComponent,
        }
      })
    });
  }

  handleClickOnCube(index) {
    this.setState({
      cubeState: this.state.cubeState.updateIndex(index, getColours().indexOf(this.state.selectedColour))
    });
  }

  handleChangeColour(newColour) {
    this.setState({
      selectedColour: newColour
    });
  }

  handleChangeState(newState) {
    this.setState({
      cubeState: newState
    });
  }
}

React.render(<Ui />, document.getElementById("mount"));
