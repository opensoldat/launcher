import React from "react";
import { observer } from "mobx-react";

import Checkbox from "../Common/Checkbox";
import Select from "../Common/Select";
import SliderNumberInput from "../Common/SliderNumberInput";

import { GameModes, BotDifficulties, BotsSettings } from "../../types";
import BotsValidationStore from "../../stores/server/botsValidation";

import "./BotsForm.css";

type BotsFormProps = {
    gameMode: GameModes;
    botsSettings: BotsSettings;
    botsValidationStore: BotsValidationStore;
}

const BotsForm: React.FC<BotsFormProps> = props => {
    const isTeamGameMode =
        props.gameMode === GameModes.CaptureTheFlag ||
        props.gameMode === GameModes.HoldTheFlag ||
        props.gameMode === GameModes.Infiltration ||
        props.gameMode === GameModes.TeamDeathMatch;
    
    const displayAlphaField = isTeamGameMode;
    const displayBravoField = isTeamGameMode;
    const displayCharlieField = props.gameMode === GameModes.TeamDeathMatch;
    const displayDeltaField = props.gameMode === GameModes.TeamDeathMatch;
    const displayNoTeamField = !isTeamGameMode;

    const handleBotsCountChange = (newBotsCount: number, inputFieldName: string): void => {
        switch (inputFieldName) {
            case "alpha-bots":
                props.botsSettings.alpha = newBotsCount;
                break;
            case "bravo-bots":
                props.botsSettings.bravo = newBotsCount;
                break;
            case "charlie-bots":
                props.botsSettings.charlie = newBotsCount;
                break;
            case "delta-bots":
                props.botsSettings.delta = newBotsCount;
                break;
            case "no-team-bots":
                props.botsSettings.noTeam = newBotsCount;
                break;
        }
    }

    const handleBotsChatToggle = (checked: boolean): void => {
        props.botsSettings.chat = checked;
    }

    const handleBotsDifficultyChange = (newValue: string): void => {
        props.botsSettings.difficulty = Number(newValue) as BotDifficulties;
    }

    return (
        <div className="form">
            {displayAlphaField &&
            <div className="field alpha">
                <label className="label" htmlFor="alpha-bots">
                    Alpha
                </label>
                <div className="user-input">
                    <SliderNumberInput
                        min={0}
                        max={30}
                        value={props.botsSettings.alpha}
                        onValueChange={handleBotsCountChange}
                        id="alpha-bots"
                        name="alpha-bots"/>
                </div>
            </div>
            }

            {displayBravoField &&
            <div className="field bravo">
                <label className="label" htmlFor="bravo-bots">
                    Bravo
                </label>
                <div className="user-input">
                    <SliderNumberInput
                        min={0}
                        max={30}
                        value={props.botsSettings.bravo}
                        onValueChange={handleBotsCountChange}
                        id="bravo-bots"
                        name="bravo-bots"/>
                </div>
            </div>
            }

            {displayCharlieField &&
            <div className="field charlie">
                <label className="label" htmlFor="charlie-bots">
                    Charlie
                </label>
                <div className="user-input">
                    <SliderNumberInput
                        min={0}
                        max={30}
                        value={props.botsSettings.charlie}
                        onValueChange={handleBotsCountChange}
                        id="charlie-bots"
                        name="charlie-bots"/>
                </div>
            </div>
            }

            {displayDeltaField &&
            <div className="field delta">
                <label className="label" htmlFor="delta-bots">
                    Delta
                </label>
                <div className="user-input">
                    <SliderNumberInput
                        min={0}
                        max={30}
                        value={props.botsSettings.delta}
                        onValueChange={handleBotsCountChange}
                        id="delta-bots"
                        name="delta-bots"/>
                </div>
            </div>
            }

            {displayNoTeamField &&
            <div className="field">
                <label className="label" htmlFor="no-team-bots">
                    Count
                </label>
                <div className="user-input">
                    <SliderNumberInput
                        min={0}
                        max={30}
                        value={props.botsSettings.noTeam}
                        onValueChange={handleBotsCountChange}
                        id="no-team-bots"
                        name="no-team-bots"/>
                </div>
            </div>
            }

            {props.botsValidationStore.countError &&
            <div className="bots-count-error-message error-message">
                {props.botsValidationStore.countError}
            </div>
            }

            <div className="field">
                <label className="label" htmlFor="bots-difficulty">
                    Difficulty
                </label>
                <div className="user-input">
                    <Select options={[
                                {value: BotDifficulties.Stupid.toString(), label: "Stupid"},
                                {value: BotDifficulties.Poor.toString(), label: "Poor"},
                                {value: BotDifficulties.Normal.toString(), label: "Normal"},
                                {value: BotDifficulties.Hard.toString(), label: "Hard"},
                                {value: BotDifficulties.Impossible.toString(), label: "Impossible"},
                            ]}
                            selectedValue={props.botsSettings.difficulty.toString()}
                            onSelectedChange={handleBotsDifficultyChange}
                            menuPosition="fixed" />
                </div>
            </div>

            <div className="field">
                <label className="label" htmlFor="bots-chat">
                    Allow chat
                </label>
                <div className="user-input">
                    <Checkbox
                        id="bots-chat"
                        colorTheme="dark"    
                        checked={props.botsSettings.chat}
                        onToggle={handleBotsChatToggle} />
                </div>
            </div>
        </div>
    )
}

export default observer(BotsForm);