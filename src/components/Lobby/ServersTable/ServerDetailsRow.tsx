import React from "react";
import LobbyServersStore from "src/stores/lobby/servers"
import { Server } from "src/types"

type ServerDetailsRowProps = {
    server: Server;
    serversStore: LobbyServersStore;
}

const ServerDetailsRow: React.FC<ServerDetailsRowProps> = props => {
    return (
        <tr>
            <td colSpan={8}>

            </td>
        </tr>
    )
}

export default ServerDetailsRow;