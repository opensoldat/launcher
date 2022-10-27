import React from "react";
import { GameModes } from "../../types";

type GameModeDescriptionProps = {
  gameMode: number;
};

const GameModeDescription: React.FC<GameModeDescriptionProps> = (
  props: GameModeDescriptionProps
) => (
  <div>
    {props.gameMode === GameModes.CaptureTheFlag && (
      <span>Capture the enemy flag and bring it to your base to score.</span>
    )}
    {props.gameMode === GameModes.DeathMatch && (
      <span>Kill everything that moves.</span>
    )}
    {props.gameMode === GameModes.HoldTheFlag && (
      <span>
        Get the yellow flag and hold it with your team for as long as possible.
        The team earns 1 point every 5 seconds of holding.
      </span>
    )}
    {props.gameMode === GameModes.Infiltration && (
      <span>
        Red team gets 30 points for retrieving the black flag. Blue team gets 1
        point every 5 seconds if the flag is in base.
      </span>
    )}
    {props.gameMode === GameModes.PointMatch && (
      <span>
        Get 1 point for kill. If you carry the yellow flag you get 2 points for
        kill. Also you get multi-points for multi-kills.
      </span>
    )}
    {props.gameMode === GameModes.RamboMatch && (
      <span>
        &quot;First blood&quot; style. Whoever owns the Rambo bow gains super
        Rambo powers. Only Rambo gets points for kill.
      </span>
    )}
    {props.gameMode === GameModes.TeamDeathMatch && (
      <span>Up to 4 teams fight against each other.</span>
    )}
  </div>
);

export default GameModeDescription;
