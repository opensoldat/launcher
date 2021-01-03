import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import ServerSettings from "src/settings/server";

import Checkbox from "../../Common/Checkbox";
import GameStylesSelection from "./StylesSelection";
import GameStylesTooltip from "../../Common/GameStylesTooltip";
import PointsLimitField from "./PointsLimitField";
import SliderNumberInput from "../../Common/SliderNumberInput";
import Tooltip from "../../Common/Tooltip";

import "../../Common/Form.css";

type GameplayFormProps = {
    serverSettings: ServerSettings;
}

const GameplayForm: React.FC<GameplayFormProps> = props => {
    const gameplay = props.serverSettings.gameplay;
    const isTeamGameMode = props.serverSettings.isTeamGameMode;

    const handleAdvanceAmountChange = (newValue: number): void => {
        gameplay.styles.advanceAmount = newValue;
    }

    const handleCheckboxToggle = (checked: boolean, fieldName?: string): void => {
        switch (fieldName) {
            case "bullet-time":
                gameplay.bulletTime = checked;
                break;

            case "friendly-fire":
                gameplay.friendlyFire = checked;
                break;

            case "sniper-line":
                gameplay.sniperLine = checked;
                break;

            case "survival-destroy-weapons":
                gameplay.styles.survivalDestroyWeaponsAfterRound = checked;
                break;
        }
    }

    const handleMaxWaveRespawnTimeChange = (newRespawnTime: number): void => {
        gameplay.maxWaveRespawnTime = newRespawnTime;
    }

    const handleMinWaveRespawnTimeChange = (newRespawnTime: number): void => {
        gameplay.minWaveRespawnTime = newRespawnTime;
    }

    const handleRespawnTimeChange = (newRespawnTime: number): void => {
        gameplay.respawnTime = newRespawnTime;
    }

    const handleTimeLimitChange = (newTimeLimit: number): void => {
        gameplay.timeLimit = newTimeLimit;
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
                        value={gameplay.timeLimit}
                        onValueChange={handleTimeLimitChange}
                        id="time-limit" />
                </div>
            </div>

            <PointsLimitField
                gameMode={gameplay.mode}
                pointsLimits={gameplay.pointsLimits} />

            <div className="field">
                <label className="label label-with-info">
                    Game styles
                    <FontAwesomeIcon
                        className="info-icon"
                        data-tip
                        data-for="game-styles-tooltip"
                        icon={faInfoCircle} />
                </label>
                <div className="user-input checkboxes-list">
                    <GameStylesSelection gameStyles={gameplay.styles} />
                </div>

                <GameStylesTooltip id="game-styles-tooltip" />
            </div>

            {gameplay.styles.survivalEnabled &&
            <div className="field">
                <label className="label">
                    Survival settings
                </label>
                <div className="user-input">
                    <Checkbox
                        colorTheme="dark"
                        name="survival-destroy-weapons"
                        rightLabel="Destroy all weapons when round ends"
                        checked={gameplay.styles.survivalDestroyWeaponsAfterRound}
                        onToggle={handleCheckboxToggle} />
                </div>
            </div>
            }

            {gameplay.styles.advanceEnabled &&
            <div className="field">
                <label className="label" htmlFor="advance-amount">
                    Advance amount
                </label>
                <div className="user-input">
                    <SliderNumberInput
                        id="advance-amount"
                        min={1}
                        max={25}
                        value={gameplay.styles.advanceAmount}
                        onValueChange={handleAdvanceAmountChange} />
                </div>
            </div>
            }

            {isTeamGameMode &&
            <React.Fragment>
                <div className="field">
                    <label className="label label-with-info" htmlFor="min-wave-respawn-time">
                        Minimum wave respawn time (seconds)
                        <FontAwesomeIcon
                            className="info-icon"
                            data-tip
                            data-for="min-wave-respawn-time-tooltip"
                            icon={faInfoCircle} />
                    </label>
                    <div className="user-input">
                        <SliderNumberInput
                            min={0}
                            max={60}
                            value={gameplay.minWaveRespawnTime}
                            onValueChange={handleMinWaveRespawnTimeChange}
                            id="min-wave-respawn-time" />
                    </div>

                    <Tooltip id="min-wave-respawn-time-tooltip">
                        <div>A player can&apos;t have a respawn time less than this.</div>
                    </Tooltip>
                </div>
                <div className="field">
                    <label className="label label-with-info" htmlFor="max-wave-respawn-time">
                        Maximum wave respawn time (seconds)
                        <FontAwesomeIcon
                            className="info-icon"
                            data-tip
                            data-for="max-wave-respawn-time-tooltip"
                            icon={faInfoCircle} />
                    </label>
                    <div className="user-input">
                        <SliderNumberInput
                            min={0}
                            max={60}
                            value={gameplay.maxWaveRespawnTime}
                            onValueChange={handleMaxWaveRespawnTimeChange}
                            id="max-wave-respawn-time" />
                    </div>

                    <Tooltip id="max-wave-respawn-time-tooltip">
                        <div>A global respawn timer is used so everyone that dies waits until this timer ends,</div>
                        <div>and teammates respawn at the same time together.</div>
                        <div>The time is based on the amount of players in the game.</div>
                    </Tooltip>
                </div>
            </React.Fragment>
            }

            <div className="field">
                <label className="label label-with-info" htmlFor="respawn-time">
                    Respawn time (seconds)
                    <FontAwesomeIcon
                        className="info-icon"
                        data-tip
                        data-for="respawn-time-tooltip"
                        icon={faInfoCircle} />
                </label>
                <div className="user-input">
                    <SliderNumberInput
                        min={0}
                        max={60}
                        value={gameplay.respawnTime}
                        onValueChange={handleRespawnTimeChange}
                        id="respawn-time" />
                </div>

                <Tooltip id="respawn-time-tooltip">
                    <div>Time that it takes for the player to respawn after death in non-team game modes.</div>
                    <div>Additionally, it affects the behavior of some game objects, like medikits.</div>
                </Tooltip>
            </div>

            <div className="field">
                <label className="label" htmlFor="friendly-fire">
                    Friendly fire
                </label>
                <div className="user-input">
                    <Checkbox
                        colorTheme="dark"
                        id="friendly-fire"
                        name="friendly-fire"
                        checked={gameplay.friendlyFire}
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
                        checked={gameplay.bulletTime}
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
                        checked={gameplay.sniperLine}
                        onToggle={handleCheckboxToggle} />
                </div>
            </div>
        </div>
    )
}

export default observer(GameplayForm);