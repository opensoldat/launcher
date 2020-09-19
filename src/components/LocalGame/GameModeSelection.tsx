import React from "react";

import { GameModes } from "../../types";

import "./GameModeSelection.css";

type GameModeSelectionProps = {
    gameMode: number;
    onGameModeChange: (newGameMode: number) => void;
};

const GameModeSelection: React.FC<GameModeSelectionProps> = props => {
    const selectedButtonClass = "selected";
    const buttons = [
        {gameMode: GameModes.CaptureTheFlag, label: "Capture the flag"},
        {gameMode: GameModes.TeamDeathMatch, label: "Team deathmatch"},
        {gameMode: GameModes.DeathMatch, label: "Deathmatch"},
        {gameMode: GameModes.Infiltration, label: "Infiltration"},
        {gameMode: GameModes.RamboMatch, label: "Rambomatch"},
        {gameMode: GameModes.HoldTheFlag, label: "Hold the flag"},
        {gameMode: GameModes.PointMatch, label: "Pointmatch"}
    ];

    return (
        <div className="game-modes">
            {buttons.map(button => (
                <button
                    className={props.gameMode === button.gameMode ? selectedButtonClass : ""}
                    key={button.gameMode}
                    onClick={(): void => props.onGameModeChange(button.gameMode)}>
                    {button.label}
                </button>
            ))}
        </div>
    )
}

export default GameModeSelection;