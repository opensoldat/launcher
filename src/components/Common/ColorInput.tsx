import React from "react";
import { PhotoshopPicker, ColorResult } from "react-color";
import Draggable from "react-draggable";

import { HexColor } from "../../types";
import "./ColorInput.css";

type ColorInputProps = {
  id: string;
  name: string;
  colorPickerHeader?: string;

  color: HexColor;
  onColorChange: (color: HexColor, name: string) => void;
};

type ColorInputState = {
  showColorPicker: boolean;
};

class ColorInput extends React.Component<ColorInputProps, ColorInputState> {
  private initialColor: HexColor;

  constructor(props: ColorInputProps) {
    super(props);

    this.state = {
      showColorPicker: false,
    };
  }

  // Handle scenario when user navigates away from page/form that
  // contains this color input. If user was using the color picker,
  // we want to restore initial color, as if user canceled his color
  // choice.
  componentWillUnmount(): void {
    if (this.initialColor && this.state.showColorPicker) {
      this.cancelColorChange();
    }
  }

  render(): JSX.Element {
    const buttonStyle = {
      backgroundColor: this.props.color,
    };

    return (
      <div className="color-input">
        <button
          id={this.props.id}
          name={this.props.name}
          type="button"
          className="color-input-button"
          style={buttonStyle}
          onClick={this.showColorPicker}
          value={this.props.color}
        >
          <span className="color-input-text">
            {this.props.color.toUpperCase()}
          </span>
        </button>

        {this.state.showColorPicker && (
          <Draggable handle=".photoshop-picker > div:first-child">
            <div className="color-picker-container">
              <PhotoshopPicker
                color={this.props.color}
                onChange={this.updateColor}
                onAccept={this.hideColorPicker}
                onCancel={this.cancelColorChange}
                header={this.props.colorPickerHeader}
                className="color-picker"
              />
            </div>
          </Draggable>
        )}
      </div>
    );
  }

  private cancelColorChange = (): void => {
    this.props.onColorChange(this.initialColor, this.props.name);
    this.hideColorPicker();
  };

  private hideColorPicker = (): void => {
    this.setState({
      showColorPicker: false,
    });
  };

  private showColorPicker = (): void => {
    this.initialColor = this.props.color;

    this.setState({
      showColorPicker: true,
    });
  };

  private updateColor = (newColor: ColorResult): void => {
    this.props.onColorChange(newColor.hex, this.props.name);
  };
}

export default ColorInput;
