import React from "react";
import { observer } from "mobx-react";

import SliderNumberInput from "../../Common/SliderNumberInput";

import { GameModes, PointsLimits } from "../../../types";

type PointsLimitFieldProps = {
    gameMode: GameModes;
    pointsLimits: PointsLimits;
}

type Field = {
    label: string;
    value: number;
    maxValue: number;
}

const PointsLimitField: React.FC<PointsLimitFieldProps> = props => {
    const getField = (): Field => {
        switch (props.gameMode) {
            case GameModes.CaptureTheFlag:
                return {
                    label: "Capture limit",
                    value: props.pointsLimits.captureTheFlag,
                    maxValue: 50
                }
            case GameModes.DeathMatch:
                return {
                    label: "Kills limit",
                    value: props.pointsLimits.deathMatch,
                    maxValue: 100
                }
            case GameModes.HoldTheFlag:
                return {
                    label: "Points limit",
                    value: props.pointsLimits.holdTheFlag,
                    maxValue: 300
                }
            case GameModes.Infiltration:
                return {
                    label: "Points limit",
                    value: props.pointsLimits.infiltration,
                    maxValue: 250
                }
            case GameModes.PointMatch:
                return {
                    label: "Points limit",
                    value: props.pointsLimits.pointMatch,
                    maxValue: 200
                }
            case GameModes.RamboMatch:
                return {
                    label: "Points limit",
                    value: props.pointsLimits.ramboMatch,
                    maxValue: 50
                }
            case GameModes.TeamDeathMatch:
                return {
                    label: "Kills limit",
                    value: props.pointsLimits.teamDeathMatch,
                    maxValue: 100
                }
        }
    }

    const handleLimitChange = (newValue: number): void => {
        switch (props.gameMode) {
            case GameModes.CaptureTheFlag:
                props.pointsLimits.captureTheFlag = newValue;
                break;
            case GameModes.DeathMatch:
                props.pointsLimits.deathMatch = newValue;
                break;
            case GameModes.HoldTheFlag:
                props.pointsLimits.holdTheFlag = newValue;
                break;
            case GameModes.Infiltration:
                props.pointsLimits.infiltration = newValue;
                break;
            case GameModes.PointMatch:
                props.pointsLimits.pointMatch = newValue;
                break;
            case GameModes.RamboMatch:
                props.pointsLimits.ramboMatch = newValue;
                break;
            case GameModes.TeamDeathMatch:
                props.pointsLimits.teamDeathMatch = newValue;
                break;
        }
    }

    return (
        <div className="field">
            <label className="label" htmlFor="points-limit">
                {getField().label}
            </label>
            <div className="user-input">
                <SliderNumberInput
                    min={1}
                    max={getField().maxValue}
                    value={getField().value}
                    onValueChange={handleLimitChange}
                    id="points-limit" />
            </div>
        </div>
    )
}

export default observer(PointsLimitField);