import React from "react";
import { observer } from "mobx-react";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import GameStylesTooltip from "../../Common/GameStylesTooltip";
import PlayersCell from "./PlayersCell";
import ServerDetailsRow from "./ServerDetailsRow";
import ServerNameCell from "./ServerNameCell";
import ServersTableActions from "./Actions";
import SortableColumn from "./SortableColumn";
import Spinner from "../../Common/Spinner";
import Tooltip from "../../Common/Tooltip";

import { GameModes, Server } from "../../../types";
import LobbyServersStore from "../../../stores/lobby/servers";
import OnlineGamesStore from "../../../stores/onlineGames";

import "./index.css";
import "../../Common/Buttons.css";


type ServersTableProps = {
    onServerClick: (server: Server) => void;
    onServerDoubleClick: (server: Server) => void;
    onlineGamesStore: OnlineGamesStore;
    serversStore: LobbyServersStore;
    showServerDetails: { [key: string]: boolean };
}

const ServersTable: React.FC<ServersTableProps> = props => {
    if (props.serversStore &&
        props.serversStore.servers == null &&
        !props.serversStore.isFetching) {
        props.serversStore.fetchServers()
        .catch(function(errorMessage: string) {
            toast.error(errorMessage, { autoClose: 2500 });
        });
    }

    React.useEffect(() => {
        // Workaround for tooltips not displaying when we add triggering elements
        // at runtime (I'm referring to icons in table's cells - those are added
        // only after receiving data from lobby).
        ReactTooltip.rebuild();
    }, [props.serversStore.filteredServers]);

    const handleServerClick = (event: React.MouseEvent, server: Server): void => {
        props.onServerClick(server);

        // In case of multiple clicks in a short time, we only want to toggle
        // server details' visibility once. 
        if (event.detail >= 2) {
            return;
        }
        const serverId = server.ip + server.port.toString();
        props.showServerDetails[serverId] = !props.showServerDetails[serverId];
    }

    return (
        <React.Fragment>
            <ServersTableActions serversStore={props.serversStore} />

            <div className="servers-table-container">
                {props.serversStore.isFetching &&
                    <div className="centered-container">
                        <div className="centered-content">
                            <Spinner />
                        </div>
                    </div>
                }
                {(props.serversStore.servers &&
                    props.serversStore.servers.length === 0 &&
                    !props.serversStore.isFetching) &&
                    <div className="centered-container">
                        <div className="centered-content">
                            No servers... Try refreshing.
                        </div>
                    </div>
                }
                {(props.serversStore.servers &&
                    props.serversStore.servers.length > 0 &&
                    props.serversStore.filteredServers &&
                    props.serversStore.filteredServers.length === 0 &&
                    !props.serversStore.isFetching) &&
                    <div className="centered-container">
                        <div className="centered-content">
                            No servers matching your filters.
                        </div>
                    </div>
                }

                <table className="servers-table">
                    <thead>
                        <tr>
                            <SortableColumn
                                columnName="ServerName"
                                label="Server name"
                                sortStore={props.serversStore.sortStore} />
                            
                            <SortableColumn
                                columnName="Players"
                                label="Players"
                                sortStore={props.serversStore.sortStore} />
                            
                            <SortableColumn
                                columnName="Map"
                                label="Map"
                                sortStore={props.serversStore.sortStore} />

                            <SortableColumn
                                columnName="GameMode"
                                label="Game mode"
                                sortStore={props.serversStore.sortStore} />

                            <th>
                                <div className="game-styles-header-cell">
                                    Game styles
                                    
                                    <FontAwesomeIcon
                                        className="icon"
                                        data-tip
                                        data-for="game-styles-tooltip"
                                        icon={faInfoCircle}
                                        size="1x" />
                                </div>
                            </th>
                            <th>
                                Additional info
                            </th>

                            <SortableColumn
                                columnName="IP"
                                label="IP"
                                sortStore={props.serversStore.sortStore} />

                            <SortableColumn
                                columnName="Port"
                                label="Port"
                                sortStore={props.serversStore.sortStore} />
                        </tr>
                    </thead>

                    <tbody>
                    {props.serversStore.filteredServers.map(server =>
                    <React.Fragment key={server.ip + server.port.toString()}>
                        <tr
                            className={
                                props.onlineGamesStore.getClient(server.ip, server.port)
                                ? "connected"
                                : ""
                            }
                            onClick={(event: React.MouseEvent): void => handleServerClick(event, server)}
                            onDoubleClick={(): void => props.onServerDoubleClick(server)} >
                            <td>
                                <ServerNameCell
                                    server={server}
                                    customWeaponsTooltipId="custom-weapons-tooltip"
                                    requiredPasswordTooltipId="required-password-tooltip" />
                            </td>

                            <td >
                                <PlayersCell server={server} />
                            </td>

                            <td>
                                {server.currentMap}
                            </td>

                            <td>
                                {server.gameMode === GameModes.CaptureTheFlag && "Capture the flag"}
                                {server.gameMode === GameModes.DeathMatch && "Deathmatch"}
                                {server.gameMode === GameModes.HoldTheFlag && "Hold the flag"}
                                {server.gameMode === GameModes.Infiltration && "Infiltration"}
                                {server.gameMode === GameModes.PointMatch && "Pointmatch"}
                                {server.gameMode === GameModes.RamboMatch && "Rambomatch"}
                                {server.gameMode === GameModes.TeamDeathMatch && "Team deathmatch"}
                            </td>

                            <td>
                                {[
                                    server.advance && "Advance",
                                    server.realistic && "Realistic",
                                    server.survival && "Survival"
                                ].filter(Boolean).join(", ")}
                            </td>

                            <td>
                                {server.info}
                            </td>

                            <td>
                                {server.ip}
                            </td>

                            <td>
                                {server.port}
                            </td>
                        </tr>

                        {props.showServerDetails[server.ip + server.port.toString()] &&
                        <ServerDetailsRow
                            server={server}
                            serversStore={props.serversStore} />
                        }
                    </React.Fragment>
                    )}
                    </tbody>
                </table>

                {/* This tooltip is here (instead of closer to game style's header cell)
                    * for the sake of not having to deal with z-indexing, and other
                    * issues with tooltip being partly hidden by other HTML elements */}
                <GameStylesTooltip id="game-styles-tooltip" />

                <Tooltip id="custom-weapons-tooltip">
                    <span> Custom weapons settings </span> 
                </Tooltip>
                
                <Tooltip id="required-password-tooltip">
                    <span> Requires password </span>
                </Tooltip>
            </div>
        </React.Fragment>
    )
}

export default observer(ServersTable);