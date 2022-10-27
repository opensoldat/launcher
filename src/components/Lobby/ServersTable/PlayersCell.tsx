import React from "react";
import { Server } from "../../../types";
import "./PlayersCell.css";

type PlayersCellProps = {
  server: Server;
};

const PlayersCell: React.FC<PlayersCellProps> = (props) => (
  <div className="players-cell">
    <span className="players-count">
      {props.server.numPlayers}/{props.server.maxPlayers}
    </span>

    <span className="bots-count">
      {props.server.numBots > 0 && `+${props.server.numBots} bots`}
    </span>
  </div>
);

export default PlayersCell;
