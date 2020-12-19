import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import Select from "../../Common/Select";
import BonusesTooltip from "./Tooltip";
import { BonusFrequencies, BonusesSettings } from "src/settings/server";

import "../../Common/Form.css";

type BonusesFormProps = {
    bonusesSettings: BonusesSettings;
}

const BonusesForm: React.FC<BonusesFormProps> = props => {
    const handleBonusesFrequencyChange = (newValue: string): void => {
        props.bonusesSettings.frequency = Number(newValue) as BonusFrequencies;
    }

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
                <div className="user-input">
                </div>

                <BonusesTooltip id="bonuses-tooltip" />
            </div>
        </div>
    )
}

export default observer(BonusesForm);