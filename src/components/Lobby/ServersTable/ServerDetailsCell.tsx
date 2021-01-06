import { observer } from "mobx-react";
import React from "react";
import Spinner from "src/components/Common/Spinner";
import LobbyServersStore from "src/stores/lobby/servers"
import { Server } from "src/types"

import "../../Common/Form.css";
import "./ServerDetailsCell.css";

type ServerDetailsCellProps = {
    server: Server;
    serversStore: LobbyServersStore;
}

const ServerDetailsCell: React.FC<ServerDetailsCellProps> = props => {
    // Refresh players' list on each mount.
    React.useEffect(() => {
        props.serversStore.fetchPlayersList(props.server.ip, props.server.port.toString())
    }, []);

    const serverId = props.server.ip + props.server.port.toString();
    const playersListContent = (
        <div className="players-list">
        {props.serversStore.playersLists[serverId] == null
        ?   <span>No data to display, try refreshing.</span>
        :   props.serversStore.playersLists[serverId].map((playerNickname, index) => (
            <span key={index}>
                {playerNickname}
            </span>
            ))
        }
        </div>
    )

    return (
        <div className="form">
            <div className="field">
                <label className="label">
                    Players
                </label>
                <div className="user-input">
                {props.serversStore.isFetchingPlayersList[serverId]
                ?   <Spinner />
                :   playersListContent
                }
                </div>
            </div>
        </div>
    )
}

export default observer(ServerDetailsCell);