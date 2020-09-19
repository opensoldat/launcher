import React from "react";

import IntegerInput from "./IntegerInput";
import Slider from "./Slider";

import "./SliderNumberInput.css";

type SliderNumberInputProps = {
    id?: string;
    name?: string;

    min: number;
    max: number;
    step?: number;

    value: number;
    onValueChange: (newValue: number, fieldName?: string) => void;
}

const SliderNumberInput: React.FC<SliderNumberInputProps> = props => {
    const handleSliderChange = (newValue: number): void => {
        props.onValueChange(newValue, props.name);
    }

    return (
        <div className="slider-number-input-container">
            <Slider
                min={props.min}
                max={props.max}
                step={props.step}
                value={props.value}
                onValueChange={handleSliderChange} />
        
            <div className="number-input-container">
                <IntegerInput
                    id={props.id}
                    name={props.name}
                    value={props.value}
                    onValueChange={props.onValueChange}
                    min={props.min}
                    max={props.max} />
            </div>
        </div>
    )
}

export default SliderNumberInput;