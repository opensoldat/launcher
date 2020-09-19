import React from "react";

import "./Slider.css";

type SliderProps = {
    min: number;
    max: number;
    value: number;
    onValueChange: (newValue: number) => void;
    step?: number;
}

const Slider: React.FC<SliderProps> = props => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.onValueChange(Number(event.target.value));
    }

    return (
        <div className="slider-container">
            <input
                type="range"
                min={props.min}
                max={props.max}
                value={props.value}
                onChange={handleChange}
                step={props.step || 1}
                className="slider">
            </input>
        </div>
    )
}

export default Slider;