import React from "react";
import { observer } from "mobx-react";

import IntegerInput from "../Common/IntegerInput";
import Select from "../Common/Select";
import { Resolution, SelectOption } from "../../types";

import "./ResolutionSelect.css";

type ResolutionSelectProps = {
    resolution: Resolution;
}

/* When resolution prop reference changes, we compare the prop's values
 * with our list of common resolutions, and decide which option to
 * preselect for the user. If resolution's width or height is 0, we
 * preselect option to match display, because that's also Soldat's behavior.
 */
const ResolutionSelect: React.FC<ResolutionSelectProps> = props => {
    const commonResolutions: Resolution[] = [
        { width: 640, height: 480 },
        { width: 800, height: 600 },
        { width: 1024, height: 768 },
        { width: 1280, height: 720 },
        { width: 1280, height: 960 },
        { width: 1280, height: 1024 },
        { width: 1440, height: 900 },
        { width: 1600, height: 900 },
        { width: 1600, height: 1200 },
        { width: 1920, height: 1080 },
        { width: 2048, height: 1152 },
        { width: 2560, height: 1440 },
        { width: 2560, height: 1600 }
    ];

    const computeSelectedOption = (resolution: Resolution): string => {
        if (resolution.width === 0 || resolution.height === 0) {
            return "match-display";
        }

        const matchingResolution = commonResolutions.find(commonResolution => {
            return commonResolution.width === resolution.width &&
                   commonResolution.height === resolution.height
        });
        if (matchingResolution) {
            return JSON.stringify(matchingResolution);
        }

        return "custom";
    }
    const [selectedOption, setSelectedOption] = React.useState(null);
    React.useEffect(() => {
        setSelectedOption(computeSelectedOption(props.resolution));
    }, [props.resolution]);

    const selectOptions: SelectOption[] = [];
    selectOptions.push({ value: "match-display", label: "Match display"});
    commonResolutions.forEach(commonResolution => {
        selectOptions.push({
            value: JSON.stringify(commonResolution),
            label: `${commonResolution.width} x ${commonResolution.height}`
        });
    });
    selectOptions.push({ value: "custom", label: "Custom..."});

    const handleInputChange = (newValue: number, inputName?: string): void => {
        switch (inputName) {
            case "resolution-width":
                props.resolution.width = newValue;
                break;
            case "resolution-height":
                props.resolution.height = newValue;
                break;
        }
    }

    const handleSelectChange = (newValue: string): void => {
        setSelectedOption(newValue);

        if (newValue === "match-display") {
            props.resolution.width = 0;
            props.resolution.height = 0;
        } else if (newValue === "custom") {
            // If last selected option was to match display's resolution,
            // and user moves to custom, we don't want to show zeroes...
            // Another option would be to retrieve information about user's
            // display resolution here, but it seems overkill.
            props.resolution.width = props.resolution.width === 0 ? 1024 : props.resolution.width;
            props.resolution.height = props.resolution.height === 0 ? 768 : props.resolution.height;
        } else {
            const selectedResolution = JSON.parse(newValue) as Resolution;
            props.resolution.width = Number(selectedResolution.width);
            props.resolution.height = Number(selectedResolution.height);
        }
    }

    return (
        <div className="resolution-select">
            <Select
                options={selectOptions}
                selectedValue={selectedOption}
                onSelectedChange={handleSelectChange}
                menuPosition="fixed" />

            {selectedOption === "custom" &&
                <div className="custom-resolution-fields">
                    <IntegerInput
                        name="resolution-width"
                        value={props.resolution.width}
                        onValueChange={handleInputChange}
                        min={100}
                        max={8192} />
                    <span className="separator"> x </span>
                    <IntegerInput
                        name="resolution-height"
                        value={props.resolution.height}
                        onValueChange={handleInputChange}
                        min={100}
                        max={8192} />
                </div>
            }
        </div>
    )
}

export default observer(ResolutionSelect);