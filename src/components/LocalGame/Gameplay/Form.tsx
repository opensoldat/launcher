import React from "react";
import { observer } from "mobx-react";

import GameStylesSelection from "./StylesSelection";
import PointsLimitField from "./PointsLimitField";
import SliderNumberInput from "../../Common/SliderNumberInput";

import { GameplaySettings } from "../../../types";

import "../../Common/Form.css";
import "./Form.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import GameStylesTooltip from "../../Common/GameStylesTooltip";
import Checkbox from "../../Common/Checkbox";
import Tooltip from "../../Common/Tooltip";

type GameplayFormProps = {
    gameplaySettings: GameplaySettings;
}

const GameplayForm: React.FC<GameplayFormProps> = props => {
    const handleAdvanceAmountChange = (newValue: number): void => {
        props.gameplaySettings.styles.advanceAmount = newValue;
    }

    const handleCheckboxToggle = (checked: boolean, fieldName?: string): void => {
        switch (fieldName) {
            case "bullet-time":
                props.gameplaySettings.bulletTime = checked;
                break;

            case "friendly-fire":
                props.gameplaySettings.friendlyFire = checked;
                break;

            case "sniper-line":
                props.gameplaySettings.sniperLine = checked;
                break;

            case "survival-destroy-weapons":
                props.gameplaySettings.styles.survivalDestroyWeaponsAfterRound = checked;
                break;
        }
    }

    const handleTimeLimitChange = (newTimeLimit: number): void => {
        props.gameplaySettings.timeLimit = newTimeLimit;
    }

    return (
        <div className="gameplay-form form">
            <div className="field">
                <label className="label" htmlFor="time-limit">
                    Time limit (minutes)
                </label>
                <div className="user-input">
                    <SliderNumberInput
                        min={1}
                        max={120}
                        value={props.gameplaySettings.timeLimit}
                        onValueChange={handleTimeLimitChange}
                        id="time-limit" />
                </div>
            </div>

            <PointsLimitField
                gameMode={props.gameplaySettings.mode}
                pointsLimits={props.gameplaySettings.pointsLimits} />

            <div className="field">
                <label className="label label-with-info">
                    Game styles
                    <FontAwesomeIcon
                        className="info-icon"
                        data-tip
                        data-for="game-styles-tooltip"
                        icon={faInfoCircle} />
                </label>
                <div className="user-input game-styles">
                    <GameStylesSelection gameStyles={props.gameplaySettings.styles} />
                </div>

                <GameStylesTooltip id="game-styles-tooltip" />
            </div>

            {props.gameplaySettings.styles.survivalEnabled &&
            <div className="field">
                <label className="label">
                    Survival settings
                </label>
                <div className="user-input">
                    <Checkbox
                        colorTheme="dark"
                        name="survival-destroy-weapons"
                        rightLabel="Destroy all weapons when round ends"
                        checked={props.gameplaySettings.styles.survivalDestroyWeaponsAfterRound}
                        onToggle={handleCheckboxToggle} />
                </div>
            </div>
            }

            {props.gameplaySettings.styles.advanceEnabled &&
            <div className="field">
                <label className="label" htmlFor="advance-amount">
                    Advance amount
                </label>
                <div className="user-input">
                    <SliderNumberInput
                        id="advance-amount"
                        min={1}
                        max={25}
                        value={props.gameplaySettings.styles.advanceAmount}
                        onValueChange={handleAdvanceAmountChange} />
                </div>
            </div>
            }

            <div className="field">
                <label className="label" htmlFor="friendly-fire">
                    Friendly fire
                </label>
                <div className="user-input">
                    <Checkbox
                        colorTheme="dark"
                        id="friendly-fire"
                        name="friendly-fire"
                        checked={props.gameplaySettings.friendlyFire}
                        onToggle={handleCheckboxToggle} />
                </div>
            </div>

            <div className="field">
                <label className="label label-with-info" htmlFor="bullet-time">
                    Bullet time
                    <FontAwesomeIcon
                        className="info-icon"
                        data-tip
                        data-for="bullet-time-tooltip"
                        icon={faInfoCircle} />
                </label>
                <div className="user-input">
                    <Checkbox
                        colorTheme="dark"
                        id="bullet-time"
                        name="bullet-time"
                        checked={props.gameplaySettings.bulletTime}
                        onToggle={handleCheckboxToggle} />
                </div>

                <Tooltip id="bullet-time-tooltip">
                    A slow motion bullet time effect appears when all players are near death.
                </Tooltip>                        
            </div>

            <div className="field">
                <label className="label" htmlFor="sniper-line">
                    Sniper line
                </label>
                <div className="user-input">
                    <Checkbox
                        colorTheme="dark"
                        id="sniper-line"
                        name="sniper-line"
                        checked={props.gameplaySettings.sniperLine}
                        onToggle={handleCheckboxToggle} />
                </div>
            </div>
        </div>
    )
}

export default observer(GameplayForm);