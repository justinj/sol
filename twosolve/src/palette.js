import React from "react";
import getColours from "src/getColours";
import StyleSheet from "react-style";

var styles = StyleSheet.create({
  paletteSquare: {
    width: 50,
    height: 50,
    boxSizing: "border-box",
    border: "1px solid black"
  },
  unselectedBar: {
    height: 15,
    visibility: "hidden"
  },
  selectedBar: {
    width: 50,
    height: 15,
    backgroundColor: "#DDDDFF",
    visibility: "visible"
  }
});

class PaletteSquare extends React.Component {
  render() {
    return <div
      style={{
        display: "inline-block"
      }}>
      <div
        styles={[styles.paletteSquare]}
        onClick={e => this.props.onClick(this.props.colour)}
        style={{
          backgroundColor: this.props.colour
        }}>
      </div>
      <div styles={[(this.props.colour === this.props.selectedColour)
       ? styles.selectedBar : styles.unselectedBar]} />
    </div>
    ;
  }
}

class Palette extends React.Component {
  render() {
    return <div>
      {getColours().map(c =>
                        <PaletteSquare
                          colour={c}
                          selectedColour={this.props.selectedColour}
                          onClick={this.onChangePalette.bind(this)} />)}
    </div>;
  }

  onChangePalette(newColour) {
    this.props.onChangeColour(newColour);
  }
}

export default Palette;
