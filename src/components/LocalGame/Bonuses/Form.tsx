import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import Checkbox from "src/components/Common/Checkbox";
import CheckboxLabelWithImage from "src/components/Common/CheckboxLabelWithImage";
import Select from "src/components/Common/Select";
import BonusesTooltip from "./Tooltip";
import { BonusFrequencies, BonusesSettings } from "src/settings/server";

import "../../Common/Form.css";
import BerserkerBonusImage from "assets/bonuses/berserkerkit.bmp";
import ClusterBonusImage from "assets/bonuses/clusterkit.png";
import FlamerBonusImage from "assets/bonuses/flamerkit.bmp";
import PredatorBonusImage from "assets/bonuses/predatorkit.bmp";
import VestBonusImage from "assets/bonuses/vestkit.png";

type BonusesFormProps = {
    bonusesSettings: BonusesSettings;
}

const BonusesForm: React.FC<BonusesFormProps> = props => {
    const handleBonusesFrequencyChange = (newValue: string): void => {
        props.bonusesSettings.frequency = Number(newValue) as BonusFrequencies;
    }

    const handleBerserkerBonusToggle = (checked: boolean): void => {
        props.bonusesSettings.berserker = checked;
    }

    const handleClusterBonusToggle = (checked: boolean): void => {
        props.bonusesSettings.cluster = checked;
    }

    const handleFlamerBonusToggle = (checked: boolean): void => {
        props.bonusesSettings.flamer = checked;
    }

    const handlePredatorBonusToggle = (checked: boolean): void => {
        props.bonusesSettings.predator = checked;
    }

    const handleVestBonusToggle = (checked: boolean): void => {
        props.bonusesSettings.vest = checked;
    }

    const checkboxLabelsMinWidth = "10em";

    return (
        <div className="form">
            <div className="field">
                <label className="label"> Frequency </label>
                <div className="user-input">
                    <Select
                        options={[
                            {value: BonusFrequencies.Never.toString(), label: "Never"},
                            {value: BonusFrequencies.VeryRare.toString(), label: "Very rare"},
                            {value: BonusFrequencies.Rare.toString(), label: "Rare"},
                            {value: BonusFrequencies.Average.toString(), label: "Average"},
                            {value: BonusFrequencies.Frequent.toString(), label: "Frequent"},
                            {value: BonusFrequencies.VeryFrequent.toString(), label: "Very frequent"},
                        ]}
                        selectedValue={props.bonusesSettings.frequency.toString()}
                        onSelectedChange={handleBonusesFrequencyChange}
                        menuPlacement="top" />
                </div>
            </div>

            <div className="field">
                <label className="label label-with-info">
                    Bonuses
                    <FontAwesomeIcon
                        className="info-icon"
                        data-tip
                        data-for="bonuses-tooltip"
                        icon={faInfoCircle} />
                </label>
                <div className="user-input checkboxes-list">
                    <Checkbox
                        checked={props.bonusesSettings.berserker}
                        colorTheme="dark"
                        rightLabel={
                            <CheckboxLabelWithImage
                                label="Berserker"
                                labelMinWidth={checkboxLabelsMinWidth}
                                imagePath={BerserkerBonusImage} />
                        }
                        onToggle={handleBerserkerBonusToggle} />

                    <Checkbox
                        checked={props.bonusesSettings.cluster}
                        colorTheme="dark"
                        rightLabel={
                            <CheckboxLabelWithImage
                                label="Cluster grenades"
                                labelMinWidth={checkboxLabelsMinWidth}
                                imagePath={ClusterBonusImage} />
                        }
                        onToggle={handleClusterBonusToggle} />

                    <Checkbox
                        checked={props.bonusesSettings.flamer}
                        colorTheme="dark"
                        rightLabel={
                            <CheckboxLabelWithImage
                                label="Flamer"
                                labelMinWidth={checkboxLabelsMinWidth}
                                imagePath={FlamerBonusImage} />
                        }
                        onToggle={handleFlamerBonusToggle} />

                    <Checkbox
                        checked={props.bonusesSettings.predator}
                        colorTheme="dark"
                        rightLabel={
                            <CheckboxLabelWithImage
                                label="Predator"
                                labelMinWidth={checkboxLabelsMinWidth}
                                imagePath={PredatorBonusImage} />
                        }
                        onToggle={handlePredatorBonusToggle} />

                    <Checkbox
                        checked={props.bonusesSettings.vest}
                        colorTheme="dark"
                        rightLabel={
                            <CheckboxLabelWithImage
                                label="Bulletproof vest"
                                labelMinWidth={checkboxLabelsMinWidth}
                                imagePath={VestBonusImage} />
                        }
                        onToggle={handleVestBonusToggle} />
                </div>

                <BonusesTooltip id="bonuses-tooltip" />
            </div>
        </div>
    )
}

export default observer(BonusesForm);