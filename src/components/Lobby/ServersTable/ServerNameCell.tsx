import React from "react";
import { FlagIcon, FlagIconCode } from "react-flag-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFistRaised, faLock } from "@fortawesome/free-solid-svg-icons";

import { Server } from "../../../types";
import "./ServerNameCell.css";

type ServerNameCellProps = {
    server: Server;

    customWeaponsTooltipId: string;
    requiredPasswordTooltipId: string;
}

const ServerNameCell: React.FC<ServerNameCellProps> = props => (
    <div className="server-name-cell">
        <FlagIcon
            code={props.server.country as FlagIconCode}
            className="flag-icon"
            width={24}
            height={18} />

        <span className="server-name">
            {props.server.name}
        </span>

        <div className="server-info-icons">
            {props.server.customWeapons &&
                <span className="icon">
                    {/* Not a great icon, but looks like FontAwesome doesn't
                    * provide any gun-related icons for free. They might provide
                    * one soon, as they seem to be working on it:
                    * https://github.com/FortAwesome/Font-Awesome/issues/3888
                    */}
                    <FontAwesomeIcon
                        icon={faFistRaised}
                        data-tip
                        data-for={props.customWeaponsTooltipId} />
                </span>
            }

            {props.server.hasPassword &&
                <span className="icon">
                    <FontAwesomeIcon
                        icon={faLock}
                        data-tip
                        data-for={props.requiredPasswordTooltipId} />
                </span>
            }
        </div>
    </div>
)

export default ServerNameCell;