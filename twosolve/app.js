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
    console.log(this.state.cubeState.getPerm());
    // var solution = solve({
    //   puz: two,
    //   state: {
    //     perm: this.state.cubeState.getPerm(),
    //     orie: {
    //       perm: [0, 1, 2, 3, 4, 5, 6],
    //       orie: this.state.cubeState.getOrie()
    //     }
    //   },
    //   justOne: false
    // });
    // <div id="solutions">
    //   <div>{solution.map(s => <span>{s}<br /></span>)}</div>
    // </div>

    console.log(this.state.cubeState.pieces());
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
    </div>;
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
