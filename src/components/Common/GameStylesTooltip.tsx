import React from "react";

import Tooltip from "./Tooltip";
import "./GameStylesTooltip.css";

type GameStylesTooltipProps = {
    id: string;
}

const GameStylesTooltip: React.FC<GameStylesTooltipProps> = props => (
    <Tooltip
        className="game-styles-tooltip"
        id={props.id}>
        <ul className="list">
            <li className="list-item">
                <div className="content">
                    <span className="label">
                        Realistic:
                    </span> 
                    <div className="description">
                        Health is low, falling from high platforms hurts, weapons have recoil, and you only see what your player sees.
                    </div>
                </div>
            </li>

            <li className="list-item">
                <div className="content">
                    <span className="label">
                        Survival:
                    </span>
                    <div className="description">
                        You don&apos;t respawn after death. Everyone respawns when only one player (or team) remains alive.
                    </div>
                </div>
            </li>

            <li className="list-item">
                <div className="content">
                    <span className="label">
                        Advance:
                    </span>
                    <div className="description">
                        Players are limited to secondary weapons on game start. A new weapon can be selected every few kills
                        (customizable with &quot;Advance amount&quot; option). Players lose their weapons on death with same rules.
                    </div>
                </div>
            </li>
        </ul>
    </Tooltip>
)

export default GameStylesTooltip;